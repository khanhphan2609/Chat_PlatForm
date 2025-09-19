export default function Message() {
  // Dữ liệu tin nhắn
  const messages = [
    {
      id: 1,
      sender: "other", // "other" = người bên kia, "me" = mình
      text: "OMG 😳 do you remember what you did last night at the work night out?",
      time: "18:12",
      reaction: "❤️",
      read: true,
    },
    {
      id: 2,
      sender: "me",
      text: "no haha",
      time: "18:16",
      read: true,
    },
    {
      id: 3,
      sender: "me",
      text: "i don't remember anything 😅",
      time: "18:16",
      read: true,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
        {/* Hiển thị ngày */}
        <div className="flex justify-center">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
            Today
          </span>
        </div>

        {/* Render tin nhắn */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "items-end gap-2"
            }`}
          >
            <div
              className={`px-3 py-2 max-w-[75%] shadow rounded-2xl ${
                msg.sender === "me"
                  ? "bg-green-400 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                {msg.reaction && (
                  <span className="text-red-500 text-xs">{msg.reaction}</span>
                )}
                <span
                  className={`text-xs ${
                    msg.sender === "me" ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </span>
                {msg.read && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ${
                      msg.sender === "me"
                        ? "text-white/80"
                        : "text-blue-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh nhập tin nhắn */}
      <div className="bg-white p-3 flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600">📎</button>
        <input
          type="text"
          placeholder="Message"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
        />
        <button className="text-blue-500 hover:text-blue-700">➤</button>
      </div>
    </div>
  );
}
