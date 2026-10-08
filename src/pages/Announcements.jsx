import { useEffect, useState } from "react";
import {
  Megaphone,
  CalendarDays
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading announcements:", error);
    } else {
      setAnnouncements(data || []);
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Announcements
        </h1>

        <p className="text-slate-500">
          Latest updates from the sports club
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading announcements...
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Megaphone size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h2 className="font-semibold text-slate-900">
                      {announcement.title}
                    </h2>

                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full h-fit">
                      {announcement.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">
                    {announcement.message}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                    <CalendarDays size={14} />

                    {new Date(
                      announcement.created_at
                    ).toLocaleDateString()}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No announcements available.
        </div>
      )}
    </div>
  );
}

export default Announcements;