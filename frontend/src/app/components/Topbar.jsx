export default function Topbar() {
  // Dữ liệu của topbar
  const topbarData = {
    name: "David Moore",
    status: "last seen 5 mins ago",
    avatar: "/avatars/david.png",
    actions: [
      {
        id: "search",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        ),
      },
      {
        id: "call",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.05 5.05a11 11 0 013.9 3.9l-2.6 2.6a1 1 0 00-.27 1.02c.25.74.38 1.52.38 2.33a1 1 0 001 1h3a1 1 0 011 1v3.25a1 1 0 01-1.11 1A16 16 0 013.75 7.11 1 1 0 014.75 6h3.25a1 1 0 011 1c0 .81.13 1.59.38 2.33a1 1 0 001.02.27l2.6-2.6z"
            />
          </svg>
        ),
      },
      {
        id: "more",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        ),
      },
    ],
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white">
      {/* Avatar + tên + trạng thái */}
      <div className="flex items-center gap-3">
        <img
          src={topbarData.avatar}
          alt={topbarData.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="leading-tight">
          <h2 className="text-sm font-semibold text-gray-900">{topbarData.name}</h2>
          <p className="text-xs text-gray-500">{topbarData.status}</p>
        </div>
      </div>

      {/* Icon bên phải */}
      <div className="flex items-center gap-5 text-gray-500">
        {topbarData.actions.map((action) => (
          <button
            key={action.id}
            className="hover:text-gray-700"
            aria-label={action.id}
          >
            {action.icon}
          </button>
        ))}
      </div>
    </header>
  );
}
