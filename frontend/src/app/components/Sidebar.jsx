export default function Sidebar() {
  const chats = [
    {
      name: "Chatgram",
      message: "Chatgram Web was updated.",
      time: "19:48",
      unread: 1,
      avatar: "/avatars/chatgram.png",
      verified: true,
    },
    {
      name: "Jessica Drew",
      message: "Ok, see you later",
      time: "18:30",
      unread: 2,
      avatar: "/avatars/jessica.png",
    },
    {
      name: "David Moore",
      message: "You: i don't remember anything 😁",
      time: "18:16",
      avatar: "/avatars/david.png",
    },
    {
      name: "Greg James",
      message: "I got a job at SpaceX 🎉🚀",
      time: "18:02",
      avatar: "/avatars/greg.png",
    },
    {
      name: "Emily Dorson",
      message: "Table for four, 5PM. Be there.",
      time: "17:42",
      avatar: "/avatars/emily.png",
    },
    {
      name: "Office Chat",
      message: "Lewis: All done mate 😌",
      time: "17:08",
      avatar: "/avatars/office.png",
    },
    {
      name: "Announcements",
      message: "Channel created",
      time: "16:15",
      avatar: null,
      initial: "A",
      color: "bg-green-400",
    },
    {
      name: "Little Sister",
      message: "Tell mom i will be home for tea 💜",
      time: "Wed",
      avatar: "/avatars/sister.png",
    },
    {
      name: "Art Class",
      message: "Emily: 🎨 Editorial",
      time: "Tue",
      avatar: "/avatars/art.png",
    },
  ];

  return (
    <aside className="flex flex-col h-full bg-white">
      {/* Header với search */}
      <div className="flex items-center gap-3 p-4">
        <button className="p-2 rounded hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer"
          >
            {/* Avatar */}
            {chat.avatar ? (
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  chat.color || "bg-gray-400"
                }`}
              >
                {chat.initial}
              </div>
            )}

            {/* Nội dung */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{chat.name}</span>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                {chat.unread && (
                  <span className="ml-2 bg-green-500 text-white text-xs px-2 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
