import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

# Lấy URI từ file .env
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("❌ Không tìm thấy MONGODB_URI trong file .env")

# Tạo client kết nối MongoDB
client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))

# Kiểm tra kết nối
try:
    client.admin.command('ping')
    print("✅ Đã kết nối MongoDB thành công!")
except Exception as e:
    print("❌ Kết nối MongoDB thất bại:", e)

# Export biến client và db để file khác dùng
db = client["ChatPlatform"]  # đổi tên database tùy nhu cầu
