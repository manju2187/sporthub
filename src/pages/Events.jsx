async function registerEvent() {
  const name = memberName.trim();

  if (!name) {
    setMessage("Please enter your name first.");
    return;
  }

  localStorage.setItem("sporthub_user_name", name);

  // Check if already registered
  const { data: existingRegistration, error: checkError } =
    await supabase
      .from("registrations")
      .select("id")
      .eq("member_name", name)
      .eq("activity_type", "Event")
      .eq("activity_id", selectedEvent.id)
      .maybeSingle();

  if (checkError) {
    console.error("Registration check error:", checkError);
    setMessage("Something went wrong. Please try again.");
    return;
  }

  if (existingRegistration) {
    setMessage("You are already registered for this event.");
    return;
  }

  // Create registration
  const { error } = await supabase
    .from("registrations")
    .insert([
      {
        member_name: name,
        activity_type: "Event",
        activity_id: selectedEvent.id
      }
    ]);

  if (error) {
    console.error("Registration error:", error);
    setMessage("Registration failed. Please try again.");
    return;
  }

  setMessage(
    `Successfully registered ${name} for the event!`
  );

  setTimeout(() => {
    setSelectedEvent(null);
    setMessage("");
  }, 1800);
}import { useEffect, useState } from "react";
import {
  Trophy,
  MapPin,
  Calendar,
  X,
  CheckCircle
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [memberName, setMemberName] = useState(
    localStorage.getItem("sporthub_user_name") || ""
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEvents();

    const savedName =
      localStorage.getItem("sporthub_user_name");

    if (savedName) {
      setMemberName(savedName);
    }
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date");

    if (error) {
      console.error(
        "Error loading events:",
        error
      );
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }

  function openEvent(event) {
    const savedName =
      localStorage.getItem("sporthub_user_name") || "";

    setMemberName(savedName);
    setSelectedEvent(event);
    setMessage("");
  }

  async function registerEvent() {
    const name = memberName.trim();

    if (!name) {
      setMessage("Please enter your name first.");
      return;
    }

    localStorage.setItem(
      "sporthub_user_name",
      name
    );

    const { error } = await supabase
      .from("registrations")
      .insert([
        {
          member_name: name,
          activity_type: "Event",
          activity_id: selectedEvent.id
        }
      ]);

    if (error) {
      console.error(
        "Registration error:",
        error
      );

      setMessage(
        "Registration failed. Please try again."
      );

      return;
    }

    setMessage(
      `Successfully registered ${name} for the event!`
    );

    setTimeout(() => {
      setSelectedEvent(null);
      setMessage("");
    }, 1800);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Events
        </h1>

        <p className="text-slate-500 mt-1">
          Upcoming competitions and sports events
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          No events available.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Trophy size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {event.name}
                  </h2>

                  <span className="inline-block mt-1 text-xs bg-slate-100 px-3 py-1 rounded-full">
                    {event.sport}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-5">
                {event.description}
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={17} />
                  {event.date}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={17} />
                  {event.location}
                </div>
              </div>

              <button
                onClick={() => openEvent(event)}
                className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition"
              >
                Register for Event
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Event Registration
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedEvent.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setMessage("");
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-slate-500">
                Date
              </p>

              <p className="font-medium text-slate-800">
                {selectedEvent.date}
              </p>

              <p className="text-sm text-slate-500 mt-3">
                Location
              </p>

              <p className="font-medium text-slate-800">
                {selectedEvent.location}
              </p>
            </div>

            <label className="block text-sm font-medium mb-2 text-slate-700">
              Your Name
            </label>

            <input
              type="text"
              value={memberName}
              onChange={(e) => {
                setMemberName(e.target.value);

                localStorage.setItem(
                  "sporthub_user_name",
                  e.target.value
                );
              }}
              placeholder="Enter your name"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
            />

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 text-sm ${
                  message.includes("Successfully")
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            <button
              onClick={registerEvent}
              className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;