import Sidebar from './Sidebar';
import { Search, Bell, User } from 'lucide-react';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#262626]">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626] hover:bg-[#1f1f1f] hover:border-green-500/30 transition-all">
                <Bell size={20} className="text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </button>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-[#262626] hover:border-green-500/30 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
