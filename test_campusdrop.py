import io
import unittest
import json
from app import app
from utils.network import get_primary_local_ip, get_all_local_ips
from utils.qr import generate_qr_base64
from utils.storage import get_storage_stats

class CampusDropTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test-secret-key'
        self.client = app.test_client()

    def test_01_network_detection(self):
        primary_ip = get_primary_local_ip()
        self.assertIsNotNone(primary_ip)
        self.assertIsInstance(primary_ip, str)
        print(f"[TEST] Primary Detected IP: {primary_ip}")

        all_ips = get_all_local_ips()
        self.assertTrue(len(all_ips) >= 1)
        print(f"[TEST] All Detected Local IPs: {all_ips}")

    def test_02_qr_generator(self):
        qr_b64 = generate_qr_base64("http://192.168.1.100:5000")
        self.assertTrue(qr_b64.startswith("data:image/png;base64,"))
        self.assertTrue(len(qr_b64) > 100)
        print("[TEST] QR code successfully generated as Base64 Data URI")

    def test_03_network_info_api(self):
        res = self.client.get('/api/network-info?room=public')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('qr_data_uri', data)
        self.assertIn('primary_ip', data)

    def test_04_room_creation_and_pin(self):
        # Create a PIN protected room
        res = self.client.post('/api/rooms/create', json={
            'room_id': 'CS-TEST-101',
            'name': 'Computer Systems Test Room',
            'pin': '1234',
            'description': 'Automated test private room'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['room_id'], 'cs-test-101')

        # Test listing rooms
        res = self.client.get('/api/rooms')
        self.assertEqual(res.status_code, 200)
        rooms_data = res.get_json()['rooms']
        self.assertIn('cs-test-101', rooms_data)
        self.assertTrue(rooms_data['cs-test-101']['has_pin'])

    def test_05_file_upload_and_stream_range(self):
        # Upload a sample text/code file
        sample_content = b"CampusDrop Local File Sharing Test Payload - " * 50
        data = {
            'room': 'public',
            'file': (io.BytesIO(sample_content), 'test_notes.txt')
        }
        res = self.client.post('/api/upload', data=data, content_type='multipart/form-data')
        self.assertEqual(res.status_code, 200)
        upload_json = res.get_json()
        self.assertEqual(upload_json['status'], 'success')
        self.assertEqual(len(upload_json['files']), 1)
        
        file_record = upload_json['files'][0]
        file_id = file_record['id']

        # Verify file in room list
        res = self.client.get('/api/files?room=public')
        self.assertEqual(res.status_code, 200)
        files = res.get_json()['files']
        self.assertTrue(any(f['id'] == file_id for f in files))

        # Test Range request streaming (HTTP 206 Partial Content)
        headers = {'Range': 'bytes=0-49'}
        res = self.client.get(f'/stream/{file_id}', headers=headers)
        self.assertEqual(res.status_code, 206)
        self.assertEqual(len(res.data), 50)
        self.assertIn('Content-Range', res.headers)
        res.close()

        # Test direct download
        res = self.client.get(f'/download/{file_id}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, sample_content)
        res.close()

        # Clean up / delete file
        res = self.client.delete(f'/api/files/{file_id}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()['status'], 'success')
        res.close()

if __name__ == '__main__':
    unittest.main()
