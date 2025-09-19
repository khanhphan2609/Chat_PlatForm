// import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Message from "@/app/components/Message";

export default function Home() {
  return (
    <div className="font-sans grid items-center justify-items-stretch min-h-screen">
      <main className="grid grid-cols-1 sm:grid-cols-12 h-screen w-screen">
        {/* Cột trái 4/12 */}
        <section className="sm:col-span-4 h-screen bg-gray-100">
          <Sidebar />
        </section>

        {/* Cột phải 8/12 */}
        <section className="sm:col-span-8 h-screen bg-gray-50">
          <Topbar />
          <Message />
        </section>
      </main>
    </div>
  );
}
