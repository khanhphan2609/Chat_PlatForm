"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Message as Msg } from "@/types";

interface MessageProps {
  user: User | null;
}

const Message: React.FC<MessageProps> = ({ user }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lấy user hiện tại
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUserId(data.user.id);
        console.log("Current user id:", data.user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch + Realtime messages
  useEffect(() => {
    if (!user || !currentUserId) return;

    setMessages([]); // reset khi đổi conversation

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${user._id}),and(sender_id.eq.${user._id},receiver_id.eq.${currentUserId})`
        )
        .order("sent_at", { ascending: true });

      if (error) {
        console.error("Fetch messages error:", error);
      }
      if (data) {
        setMessages(data as Msg[]);
        console.log("Initial messages:", data);
      }
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Msg;
          // Chỉ thêm tin nhắn đúng conversation
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === user._id) ||
            (msg.sender_id === user._id && msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => {
              // Kiểm tra duplicate dựa trên _id
              if (prev.some((m) => m._id === msg._id)) return prev;
              return [...prev, msg];
            });
            console.log("Realtime new message:", msg);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentUserId]);

  // Scroll xuống cuối khi có messages mới
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || !user || !currentUserId) return;
    setSending(true);

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: currentUserId,
            receiver_id: user._id,
            content: input.trim(),
          },
        ]);

      if (error) console.error("Send message error:", error);

      // Không push trực tiếp vào state, rely vào Realtime
      setInput("");
    } catch (err) {
      console.error("Send message exception:", err);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a conversation to start chatting 💬</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <img
          src={user.avatar || "/avatars/default.png"}
          alt={user.username || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold">{user.username || "User"}</h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm ${
                msg.sender_id === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 p-4 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className={`px-4 py-2 rounded-full text-sm ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Message;
