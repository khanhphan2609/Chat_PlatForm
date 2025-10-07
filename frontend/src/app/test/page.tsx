"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types"; // import interface bạn đã tạo

export default function TestPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*").limit(5);
      if (error) {
        console.error("❌ Supabase error:", error.message);
        setError(error.message);
      } else if (data) {
        console.log("✅ Connected to Supabase:", data);
        // Ép kiểu về User[]
        setUsers(data as User[]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">🔍 Kiểm tra kết nối Supabase</h1>
      {error ? (
        <p className="text-red-600">Lỗi: {error}</p>
      ) : users.length > 0 ? (
        <ul className="list-disc ml-6">
          {users.map((u) => (
            <li key={u._id}>
              <b>{u.username}</b> ({u.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>Đang tải dữ liệu hoặc chưa có user...</p>
      )}
    </div>
  );
}
