"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Giả sử token được lưu trong localStorage khi đăng nhập thành công
    const token = localStorage.getItem("token");

    if (token) {
      // Nếu đã đăng nhập → chuyển sang /chat
      router.replace("/chat");
    } else {
      // Nếu chưa đăng nhập → chuyển sang /auth/login
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Đang kiểm tra đăng nhập...</p>
    </div>
  );
}
