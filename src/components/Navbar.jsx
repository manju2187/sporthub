import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";

function Navbar() {
  const [name, setName] = useState(
    localStorage.getItem("sporthub_user_name") || "Athlete"
  );

  useEffect(() => {
    const savedName =
      localStorage.getItem("sporthub_user_name") || "Athlete";

    setName(savedName);
  }, []);

  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Sports Club
        </h2>

        <p className="text-sm text-slate-500">
          Manage your sports activities
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="text-slate-500 hover:text-slate-800">
          <Search size={21} />
        </button>

        <button className="relative text-slate-500 hover:text-slate-800">
          <Bell size={21} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
            {firstLetter}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              {name}
            </p>

            <p className="text-xs text-slate-500">
              Member
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;