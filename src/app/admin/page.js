import React from 'react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Upload Product', icon: '📦', active: true },
    { name: 'Dashboard', icon: '📊' },
    { name: 'Active Orders', icon: '🛒' },
    { name: 'Inventory List', icon: '🍎' },
    { name: 'Customer Data', icon: '👥' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFBF2]">
      {/* Sidebar - Using the exact Saffron from your image */}
      <aside className="w-80 bg-[#FF5C00] text-white flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-10">
          <h1 className="text-4xl font-black tracking-tighter leading-none">
            KAIRI<span className="text-white opacity-80 italic">.IN</span>
          </h1>
          <div className="h-1 w-12 bg-white mt-4"></div>
        </div>

        <nav className="flex-1 px-6">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                    item.active 
                    ? "bg-[#2D5F47] text-white shadow-lg translate-x-2" // The Green from your button
                    : "hover:bg-white/10 text-white"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="uppercase tracking-wider text-sm">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-10 border-t border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/60">
            Private Harvest Access
          </p>
        </div>
      </aside>

      {/* Main content placeholder - logic handles in other routes */}
      <main className="flex-1">
        {/* Iske content ke liye aap alag page ya route use karenge */}
      </main>
    </div>
  );
}