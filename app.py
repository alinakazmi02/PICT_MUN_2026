import os
import re
import mimetypes
from flask import (
    Flask, render_template, request, jsonify, send_file,
    redirect, url_for, session, abort, Response
)
import config
from utils.network import get_primary_local_ip, get_all_local_ips, format_network_banner
from utils.storage import (
    save_uploaded_file, get_files_by_room, get_file_by_id,
    delete_file_by_id, increment_downloads, get_rooms,
    create_room, verify_room_pin, get_storage_stats
)
from utils.qr import generate_qr_base64

app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER

# Helper function for Range request streaming (enables seamless video/audio seeking)
def send_file_partial(path, mime_type):
    """
    Simple range request handler for streaming audio/video with seeking support.
    """
    range_header = request.headers.get('Range', None)
    if not range_header:
        return send_file(path, mimetype=mime_type)

    size = os.path.getsize(path)
    byte1, byte2 = 0, None
    m = re.search(r'(\d+)-(\d*)', range_header)
    if m:
        g = m.groups()
        byte1 = int(g[0])
        if g[1]:
            byte2 = int(g[1])

    if byte2 is None:
        byte2 = size - 1

    length = byte2 - byte1 + 1

    with open(path, 'rb') as f:
        f.seek(byte1)
        data = f.read(length)

    rv = Response(data, 206, mimetype=mime_type, direct_passthrough=True)
    rv.headers.add('Content-Range', f'bytes {byte1}-{byte2}/{size}')
    rv.headers.add('Accept-Ranges', 'bytes')
    rv.headers.add('Content-Length', str(length))
    return rv

@app.context_processor
def inject_global_vars():
    primary_ip = get_primary_local_ip()
    return {
        'primary_ip': primary_ip,
        'port': config.PORT,
        'base_url': f"http://{primary_ip}:{config.PORT}"
    }

@app.route('/')
def index():
    room_id = request.args.get('room', config.DEFAULT_ROOM).lower().strip()
    return render_template('index.html', active_room=room_id)

@app.route('/room/<room_id>')
def room_view(room_id):
    clean_room = room_id.lower().strip()
    return render_template('index.html', active_room=clean_room)

# API: Network & QR Information
@app.route('/api/network-info')
def api_network_info():
    primary_ip = get_primary_local_ip()
    all_ips = get_all_local_ips()
    room = request.args.get('room', config.DEFAULT_ROOM).lower().strip()
    
    current_url = f"http://{primary_ip}:{config.PORT}"
    if room and room != config.DEFAULT_ROOM:
        current_url += f"/room/{room}"
        
    qr_data_uri = generate_qr_base64(current_url)

    return jsonify({
        'status': 'success',
        'primary_ip': primary_ip,
        'all_ips': all_ips,
        'port': config.PORT,
        'current_url': current_url,
        'qr_data_uri': qr_data_uri,
        'stats': get_storage_stats()
    })

# API: Get Room List
@app.route('/api/rooms', methods=['GET'])
def api_get_rooms():
    rooms = get_rooms()
    safe_rooms = {}
    for rid, rdata in rooms.items():
        safe_rooms[rid] = {
            'name': rdata.get('name', rid),
            'has_pin': rdata.get('has_pin', False),
            'description': rdata.get('description', ''),
            'created_at': rdata.get('created_at', '')
        }
    return jsonify({'status': 'success', 'rooms': safe_rooms})

# API: Create Room
@app.route('/api/rooms/create', methods=['POST'])
def api_create_room():
    data = request.get_json() or {}
    room_id = data.get('room_id', '').strip()
    room_name = data.get('name', '').strip()
    pin = data.get('pin', '').strip() or None
    description = data.get('description', '').strip()

    if not room_id:
        return jsonify({'status': 'error', 'message': 'Room code/ID is required'}), 400

    clean_id, room_info = create_room(room_id, room_name, pin, description)
    # Automatically grant access to creator in session
    session[f"unlocked_{clean_id}"] = True

    return jsonify({
        'status': 'success',
        'room_id': clean_id,
        'room': {
            'name': room_info['name'],
            'has_pin': room_info['has_pin'],
            'description': room_info['description']
        }
    })

# API: Verify Room PIN
@app.route('/api/rooms/verify', methods=['POST'])
def api_verify_room():
    data = request.get_json() or {}
    room_id = data.get('room_id', '').lower().strip()
    pin = data.get('pin', '').strip()

    if verify_room_pin(room_id, pin):
        session[f"unlocked_{room_id}"] = True
        return jsonify({'status': 'success', 'message': 'PIN verified successfully'})
    else:
        return jsonify({'status': 'error', 'message': 'Incorrect PIN'}), 403

# API: List Files in Room
@app.route('/api/files', methods=['GET'])
def api_get_files():
    room = request.args.get('room', config.DEFAULT_ROOM).lower().strip()
    rooms = get_rooms()
    room_data = rooms.get(room)

    # Check if PIN is required and not unlocked in session
    if room_data and room_data.get('has_pin'):
        if not session.get(f"unlocked_{room}"):
            return jsonify({
                'status': 'locked',
                'message': 'This room is PIN protected',
                'room_name': room_data.get('name', room)
            }), 401

    files = get_files_by_room(room)
    return jsonify({
        'status': 'success',
        'room': room,
        'files': files
    })

# API: Upload Files
@app.route('/api/upload', methods=['POST'])
def api_upload_files():
    room = request.form.get('room', config.DEFAULT_ROOM).lower().strip()
    rooms = get_rooms()
    room_data = rooms.get(room)

    # Check PIN protection for uploads
    if room_data and room_data.get('has_pin'):
        if not session.get(f"unlocked_{room}"):
            return jsonify({'status': 'error', 'message': 'Unauthorized. Please unlock room first.'}), 401

    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400

    uploaded_files = request.files.getlist('file')
    saved_records = []

    for file_obj in uploaded_files:
        if file_obj.filename:
            record = save_uploaded_file(file_obj, room=room)
            saved_records.append(record)

    return jsonify({
        'status': 'success',
        'message': f"Uploaded {len(saved_records)} file(s)",
        'files': saved_records
    })

# Route: Download File
@app.route('/download/<file_id>')
def download_file(file_id):
    item, full_path = get_file_by_id(file_id)
    if not item or not full_path:
        abort(404)

    # Check PIN if room is protected
    room = item.get('room', config.DEFAULT_ROOM)
    rooms = get_rooms()
    room_data = rooms.get(room)
    if room_data and room_data.get('has_pin') and not session.get(f"unlocked_{room}"):
        return redirect(f"/?room={room}&locked=1")

    increment_downloads(file_id)
    return send_file(
        full_path,
        as_attachment=True,
        download_name=item.get('original_name', item.get('safe_name'))
    )

# Route: In-Browser Media Stream / Preview
@app.route('/stream/<file_id>')
def stream_file(file_id):
    item, full_path = get_file_by_id(file_id)
    if not item or not full_path:
        abort(404)

    room = item.get('room', config.DEFAULT_ROOM)
    rooms = get_rooms()
    room_data = rooms.get(room)
    if room_data and room_data.get('has_pin') and not session.get(f"unlocked_{room}"):
        abort(403)

    mime_type = item.get('mime_type', 'application/octet-stream')
    return send_file_partial(full_path, mime_type)

# API: Delete File
@app.route('/api/files/<file_id>', methods=['DELETE', 'POST'])
def api_delete_file(file_id):
    item, _ = get_file_by_id(file_id)
    if not item:
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

    room = item.get('room', config.DEFAULT_ROOM)
    rooms = get_rooms()
    room_data = rooms.get(room)
    if room_data and room_data.get('has_pin') and not session.get(f"unlocked_{room}"):
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    success = delete_file_by_id(file_id)
    if success:
        return jsonify({'status': 'success', 'message': 'File deleted'})
    return jsonify({'status': 'error', 'message': 'Could not delete file'}), 500

@app.errorhandler(404)
def not_found(e):
    return render_template('error.html', error_code=404, error_message="Page or resource not found"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('error.html', error_code=500, error_message="Internal Server Error"), 500

if __name__ == '__main__':
    banner = format_network_banner(config.HOST, config.PORT)
    print(banner)
    app.run(host=config.HOST, port=config.PORT, debug=True)
