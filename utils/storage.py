import os
import json
import uuid
import mimetypes
import time
import hashlib
from datetime import datetime
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, METADATA_FILE, ROOMS_FILE, DEFAULT_ROOM

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def _load_json(file_path, default=None):
    if default is None:
        default = {}
    if not os.path.exists(file_path):
        return default
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default

def _save_json(file_path, data):
    try:
        temp_path = f"{file_path}.tmp"
        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        if os.path.exists(file_path):
            os.replace(temp_path, file_path)
        else:
            os.rename(temp_path, file_path)
    except Exception as e:
        print(f"Error saving {file_path}: {e}")

def format_size(size_bytes):
    """
    Format byte count into human readable string (KB, MB, GB).
    """
    if size_bytes == 0:
        return "0 B"
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    p = float(size_bytes)
    while p >= 1024.0 and i < len(size_names) - 1:
        p /= 1024.0
        i += 1
    return f"{p:.2f} {size_names[i]}".replace(".00", "")

def categorize_file(filename, mime_type=None):
    """
    Categorize file by extension & mime type for filtering and icons.
    """
    ext = os.path.splitext(filename)[1].lower()
    
    video_exts = {'.mp4', '.mkv', '.webm', '.avi', '.mov', '.wmv', '.flv', '.m4v'}
    audio_exts = {'.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'}
    image_exts = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'}
    doc_exts = {'.pdf', '.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls', '.txt', '.md', '.rtf', '.csv'}
    archive_exts = {'.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso'}
    code_exts = {'.py', '.js', '.html', '.css', '.json', '.cpp', '.c', '.java', '.ts', '.sh', '.rs', '.go', '.sql'}

    if ext in video_exts or (mime_type and mime_type.startswith('video/')):
        return 'video'
    if ext in audio_exts or (mime_type and mime_type.startswith('audio/')):
        return 'audio'
    if ext in image_exts or (mime_type and mime_type.startswith('image/')):
        return 'image'
    if ext in doc_exts or (mime_type and 'pdf' in mime_type):
        return 'document'
    if ext in archive_exts or (mime_type and ('zip' in mime_type or 'tar' in mime_type or 'compressed' in mime_type)):
        return 'archive'
    if ext in code_exts:
        return 'code'
    return 'other'

def get_rooms():
    """
    Returns list of all active rooms.
    """
    rooms = _load_json(ROOMS_FILE, {
        DEFAULT_ROOM: {
            "name": "Campus Lobby (Public)",
            "created_at": datetime.now().isoformat(),
            "has_pin": False,
            "description": "Open public sharing room for everyone on campus Wi-Fi"
        }
    })
    return rooms

def create_room(room_id, name, pin=None, description=""):
    """
    Create a new room with optional PIN.
    """
    rooms = get_rooms()
    clean_id = secure_filename(room_id).lower()
    if not clean_id:
        clean_id = f"room-{uuid.uuid4().hex[:6]}"

    pin_hash = None
    if pin:
        pin_hash = hashlib.sha256(str(pin).strip().encode('utf-8')).hexdigest()

    rooms[clean_id] = {
        "name": name or clean_id.upper(),
        "created_at": datetime.now().isoformat(),
        "has_pin": bool(pin),
        "pin_hash": pin_hash,
        "description": description or f"Study room {clean_id.upper()}"
    }
    _save_json(ROOMS_FILE, rooms)
    return clean_id, rooms[clean_id]

def verify_room_pin(room_id, pin):
    """
    Check if the PIN matches for a room.
    """
    rooms = get_rooms()
    room = rooms.get(room_id)
    if not room:
        return False
    if not room.get('has_pin'):
        return True
    
    input_hash = hashlib.sha256(str(pin).strip().encode('utf-8')).hexdigest()
    return input_hash == room.get('pin_hash')

def save_uploaded_file(file_storage, room=DEFAULT_ROOM):
    """
    Saves an uploaded file to disk and records metadata.
    """
    metadata = _load_json(METADATA_FILE, {})
    original_name = file_storage.filename or "unnamed_file"
    safe_name = secure_filename(original_name)
    if not safe_name:
        safe_name = f"file_{int(time.time())}"

    file_id = uuid.uuid4().hex
    
    # Store in room subdirectory or flat with unique prefix
    room_clean = secure_filename(room).lower() if room else DEFAULT_ROOM
    room_dir = os.path.join(UPLOAD_FOLDER, room_clean)
    os.makedirs(room_dir, exist_ok=True)

    disk_filename = f"{file_id}_{safe_name}"
    disk_path = os.path.join(room_dir, disk_filename)

    file_storage.save(disk_path)
    file_size = os.path.getsize(disk_path)

    mime_type, _ = mimetypes.guess_type(original_name)
    if not mime_type:
        mime_type = "application/octet-stream"

    category = categorize_file(original_name, mime_type)

    record = {
        "id": file_id,
        "original_name": original_name,
        "safe_name": safe_name,
        "disk_filename": disk_filename,
        "rel_path": os.path.join(room_clean, disk_filename),
        "size_bytes": file_size,
        "size_formatted": format_size(file_size),
        "uploaded_at": datetime.now().isoformat(),
        "mime_type": mime_type,
        "category": category,
        "room": room_clean,
        "downloads": 0
    }

    metadata[file_id] = record
    _save_json(METADATA_FILE, metadata)
    return record

def get_files_by_room(room=DEFAULT_ROOM):
    """
    Get all active files in a specific room.
    """
    metadata = _load_json(METADATA_FILE, {})
    room_clean = secure_filename(room).lower() if room else DEFAULT_ROOM
    
    # Filter files and ensure disk file still exists
    room_files = []
    updated = False
    
    for file_id, item in list(metadata.items()):
        if item.get('room') == room_clean:
            full_path = os.path.join(UPLOAD_FOLDER, item.get('rel_path', ''))
            if os.path.exists(full_path):
                room_files.append(item)
            else:
                # Clean orphaned metadata
                del metadata[file_id]
                updated = True

    if updated:
        _save_json(METADATA_FILE, metadata)

    # Sort descending by upload timestamp
    room_files.sort(key=lambda x: x.get('uploaded_at', ''), reverse=True)
    return room_files

def get_file_by_id(file_id):
    """
    Retrieve file metadata and absolute path by ID.
    """
    metadata = _load_json(METADATA_FILE, {})
    item = metadata.get(file_id)
    if not item:
        return None, None
    
    full_path = os.path.join(UPLOAD_FOLDER, item.get('rel_path', ''))
    if not os.path.exists(full_path):
        return None, None
    
    return item, full_path

def increment_downloads(file_id):
    metadata = _load_json(METADATA_FILE, {})
    if file_id in metadata:
        metadata[file_id]["downloads"] = metadata[file_id].get("downloads", 0) + 1
        _save_json(METADATA_FILE, metadata)

def delete_file_by_id(file_id):
    """
    Deletes a file from disk and metadata.
    """
    import gc
    metadata = _load_json(METADATA_FILE, {})
    if file_id not in metadata:
        return False
    
    item = metadata[file_id]
    full_path = os.path.join(UPLOAD_FOLDER, item.get('rel_path', ''))
    if os.path.exists(full_path):
        gc.collect()
        try:
            os.remove(full_path)
        except Exception:
            # Short sleep and retry for Windows file locks
            time.sleep(0.05)
            try:
                os.remove(full_path)
            except Exception as e:
                print(f"Error removing file {full_path}: {e}")
    
    del metadata[file_id]
    _save_json(METADATA_FILE, metadata)
    return True

def get_storage_stats():
    """
    Calculate total storage used, total files, and count per room.
    """
    metadata = _load_json(METADATA_FILE, {})
    total_bytes = 0
    total_files = len(metadata)
    categories = {}

    for item in metadata.values():
        total_bytes += item.get('size_bytes', 0)
        cat = item.get('category', 'other')
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_files": total_files,
        "total_size_bytes": total_bytes,
        "total_size_formatted": format_size(total_bytes),
        "categories": categories
    }
