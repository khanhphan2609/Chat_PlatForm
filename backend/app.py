# app.py
from fastapi import FastAPI
from routes import users
# , rooms, messages

app = FastAPI()

# Route mặc định
@app.get("/")
def root():
    return {"message": "API is running!"}

# Đăng ký router
app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
# app.include_router(messages.router, prefix="/messages", tags=["Messages"])
