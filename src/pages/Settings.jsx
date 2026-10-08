import { useEffect, useState } from "react";
import {
  Bell,
  User,
  Save,
  CheckCircle
} from "lucide-react";

function Settings() {
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedName =
      localStorage.getItem("sporthub_user_name") || "";

    setName(savedName);
  }, []);

  function saveSettings() {
    if (name.trim()) {
      localStorage.setItem(
        "sporthub_user_name",
        name.trim()
      );
    }

    localStorage.setItem(
      "sporthub_notifications",
      notifications
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="text-slate-500 mt-1">
          Manage your SportHub preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Profile
              </h2>

              <p className="text-sm text-slate-500">
                Your SportHub profile
              </p>
            </div>
          </div>

          <label className="text-sm font-medium text-slate-700">
            Your Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Notifications
              </h2>

              <p className="text-sm text-slate-500">
                Manage announcement notifications
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">
                Enable notifications
              </p>

              <p className="text-sm text-slate-500">
                Receive important club updates
              </p>
            </div>

            <button
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`w-12 h-6 rounded-full transition ${
                notifications
                  ? "bg-emerald-500"
                  : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition ${
                  notifications
                    ? "translate-x-6"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          <Save size={18} />
          Save Settings
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <CheckCircle size={18} />
            Settings saved successfully.
          </div>
        )}

      </div>
    </div>
  );
}

export default Settings;