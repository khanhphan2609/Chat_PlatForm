"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types";

interface SidebarProps {
  onSelectUser: (user: User) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser, onLogout }) => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Lấy user hiện tại
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("Current user data:", data, "Error:", error); // <-- debug
      if (data.user) {
        setCurrentUser({
          _id: data.user.id,
          username: data.user.user_metadata.username || data.user.email!,
          email: data.user.email!,
          avatar: data.user.user_metadata.avatar || "/avatars/you.png",
        });
      }
    };
    fetchCurrentUser();
  }, []);

  // Lấy danh sách user (limit 50) và realtime INSERT
  useEffect(() => {
    if (!currentUser) return;

    // Fetch initial users
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users") // bảng public.users
          .select("*")
          .neq("id", currentUser._id) // thay _id bằng id nếu dùng Supabase Auth
          .limit(50);

        if (error) {
          return;
        }

        if (data) setUsers(data as User[]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();

    // Realtime subscription
    const channel = supabase
      .channel("public:users") // tên channel tùy bạn đặt
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload) => {
          const newUser = payload.new as User;
          console.log("Realtime new user:", newUser);
          if (newUser._id !== currentUser._id) {
            setUsers((prev) => [newUser, ...prev]);
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Tìm kiếm user từ Supabase khi nhập
  useEffect(() => {
    if (!currentUser) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (!search.trim()) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .neq("_id", currentUser._id)
          .limit(50);

        console.log("Fetched users (empty search):", data, "Error:", error); // <-- debug
        if (data) setUsers(data as User[]);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("username", `%${search}%`)
        .neq("_id", currentUser._id)
        .limit(50);

      console.log(`Search "${search}" results:`, data, "Error:", error); // <-- debug
      if (data) setUsers(data as User[]);
    }, 300); // debounce 300ms
  }, [search, currentUser]);

  return (
    <aside className="flex flex-col h-full bg-white border-r">
      {/* Search */}
      <div className="flex items-center gap-3 p-4 border-b">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition"
            onClick={() => onSelectUser(user)}
          >
            <img
              src={user.avatar || "/avatars/default.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium truncate">{user.username}</span>
          </div>
        ))}
      </div>

      {/* Current user + logout */}
      {currentUser && (
        <div className="p-4 border-t flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{currentUser.username}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
