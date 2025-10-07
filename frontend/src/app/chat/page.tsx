"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";
import Message from "@/components/Message";
import { User } from "@/types";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.replace("/auth/login");
      else
        setCurrentUser({
          _id: data.user.id,
          username: data.user.user_metadata.username || data.user.email!,
          email: data.user.email!,
          avatar: data.user.user_metadata.avatar || "/avatars/you.png",
        });
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="font-sans grid items-center justify-items-stretch min-h-screen">
      <main className="grid grid-cols-1 sm:grid-cols-12 h-screen w-screen">
        <section className="sm:col-span-4 h-screen bg-gray-100">
          {currentUser && (
            <Sidebar onSelectUser={setSelectedUser} onLogout={handleLogout} />
          )}
        </section>

        <section className="sm:col-span-8 h-screen bg-gray-50 flex flex-col">
          <Message user={selectedUser} />
        </section>
      </main>
    </div>
  );
}
