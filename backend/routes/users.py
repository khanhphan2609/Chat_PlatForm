from fastapi import APIRouter, HTTPException
from connect_db import client
from pydantic import BaseModel, EmailStr
from bson import ObjectId

router = APIRouter()

# Kết nối database
db = client["chat_platform"]
users_collection = db["users"]

# Pydantic model để validate dữ liệu đầu vào
class UserCreate(BaseModel):
    email: EmailStr
    displayName: str

# Hàm serialize ObjectId
def serialize_user(user):
    return {
        # "_id": str(user["_id"]),  # Nếu muốn ẩn _id, giữ nguyên như bạn đang làm
        "email": user.get("email"),
        "displayName": user.get("displayName"),
        "status": user.get("status"),
        "createdAt": user.get("createdAt"),
    }

@router.get("/")
def get_users():
    users = list(users_collection.find())
    return [serialize_user(u) for u in users]

@router.get("/{user_id}")
def get_user_by_id(user_id: str):
    """Lấy thông tin 1 user theo _id"""
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user id")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_user(user)

@router.post("/")
def create_user(user: dict):
    """Tạo user mới"""
    new_user = users_collection.insert_one(user)
    return {"message": "User created", "id": str(new_user.inserted_id)}

@router.put("/{user_id}")
def update_user(user_id: str, updated_data: dict):
    """Cập nhật thông tin user"""
    try:
        oid = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user id")
    
    result = users_collection.update_one({"_id": oid}, {"$set": updated_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = users_collection.find_one({"_id": oid})
    return {"message": "User updated", "data": serialize_user(updated_user)}

@router.delete("/{user_id}")
def delete_user(user_id: str):
    """Xoá user theo _id"""
    try:
        oid = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user id")
    
    result = users_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User with id {user_id} deleted successfully"}
