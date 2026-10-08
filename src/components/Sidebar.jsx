import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Trophy,
  Megaphone,
  Settings
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Members",
      icon: Users
    },
    {
      name: "Training",
      icon: Dumbbell
    },
    {
      name: "Events",
      icon: Trophy
    },
    {
      name: "Announcements",
      icon: Megaphone
    },
    {
      name: "Settings",
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-5">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Sport<span className="text-emerald-400">Hub</span>
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Sports Club Management
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                active
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;