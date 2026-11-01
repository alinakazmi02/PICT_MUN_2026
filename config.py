import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuration settings
HOST = os.environ.get('CAMPUSDROP_HOST', '0.0.0.0')
PORT = int(os.environ.get('CAMPUSDROP_PORT', 5000))
SECRET_KEY = os.environ.get('SECRET_KEY', 'campusdrop-super-secure-local-key-2026')

# 10 GB Max upload size (allows large video/project distribution over local Wi-Fi)
MAX_CONTENT_LENGTH = 10 * 1024 * 1024 * 1024 

DEFAULT_ROOM = 'public'
METADATA_FILE = os.path.join(UPLOAD_FOLDER, '.metadata.json')
ROOMS_FILE = os.path.join(UPLOAD_FOLDER, '.rooms.json')
