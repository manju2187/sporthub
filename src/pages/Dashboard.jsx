import { useEffect, useState } from "react";
import {
  Users,
  Dumbbell,
  Trophy,
  Megaphone,
  CalendarDays,
  MapPin,
  Clock
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    trainings: 0,
    events: 0,
    registrations: 0
  });

  const [trainings, setTrainings] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const [
      registrationsResult,
      trainingsResult,
      eventsResult,
      announcementsResult
    ] = await Promise.all([
      supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("trainings")
        .select("*")
        .order("date")
        .limit(4),

      supabase
        .from("events")
        .select("*")
        .order("date")
        .limit(3),

      supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
    ]);

    if (registrationsResult.error) {
      console.error(
        "Registration error:",
        registrationsResult.error
      );
    }

    if (trainingsResult.error) {
      console.error(
        "Training error:",
        trainingsResult.error
      );
    }

    if (eventsResult.error) {
      console.error(
        "Events error:",
        eventsResult.error
      );
    }

    if (announcementsResult.error) {
      console.error(
        "Announcements error:",
        announcementsResult.error
      );
    }

    const registrations =
      registrationsResult.data || [];

    /*
      Get unique registered member names.

      Example:

      Darshan2 → Training
      Darshan2 → Event
      Rahul → Training

      Unique members = 2
      Total registrations = 3
    */

    const uniqueMembers = [
      ...new Set(
        registrations.map(
          (registration) =>
            registration.member_name
              ?.trim()
              .toLowerCase()
        )
      )
    ].filter(Boolean);

    setStats({
      members: uniqueMembers.length,
      trainings: trainingsResult.data?.length || 0,
      events: eventsResult.data?.length || 0,
      registrations: registrations.length
    });

    setTrainings(trainingsResult.data || []);
    setEvents(eventsResult.data || []);
    setAnnouncements(announcementsResult.data || []);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome to your Sports Club Management System
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* MEMBERS */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Registered Members
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {stats.members}
              </h2>

              <p className="text-xs text-slate-500 mt-2">
                Unique members
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={22} />
            </div>

          </div>

        </div>

        {/* TRAININGS */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Training Sessions
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {stats.trainings}
              </h2>

              <p className="text-xs text-slate-500 mt-2">
                Upcoming sessions
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Dumbbell size={22} />
            </div>

          </div>

        </div>

        {/* EVENTS */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Upcoming Events
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {stats.events}
              </h2>

              <p className="text-xs text-slate-500 mt-2">
                Competitions and events
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy size={22} />
            </div>

          </div>

        </div>

        {/* REGISTRATIONS */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Registrations
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {stats.registrations}
              </h2>

              <p className="text-xs text-slate-500 mt-2">
                Activity registrations
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarDays size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* TRAINING + EVENTS */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* TRAINING */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-5 border-b border-slate-100 flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-lg text-slate-900">
                Upcoming Training
              </h2>

              <p className="text-sm text-slate-500">
                Latest training sessions
              </p>
            </div>

            <Dumbbell
              size={21}
              className="text-emerald-500"
            />

          </div>

          <div className="p-5 space-y-4">

            {trainings.length === 0 ? (

              <p className="text-slate-500 text-sm">
                No training sessions available.
              </p>

            ) : (

              trainings.map((training) => (

                <div
                  key={training.id}
                  className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {training.sport}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Coach: {training.coach}
                      </p>
                    </div>

                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                      {training.level}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">

                    <div className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {training.date}
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {training.time}
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {training.location}
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        {/* EVENTS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-5 border-b border-slate-100 flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-lg text-slate-900">
                Upcoming Events
              </h2>

              <p className="text-sm text-slate-500">
                Competitions and activities
              </p>
            </div>

            <Trophy
              size={21}
              className="text-amber-500"
            />

          </div>

          <div className="p-5 space-y-4">

            {events.length === 0 ? (

              <p className="text-slate-500 text-sm">
                No upcoming events.
              </p>

            ) : (

              events.map((event) => (

                <div
                  key={event.id}
                  className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"
                >

                  <h3 className="font-semibold text-slate-800">
                    {event.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {event.sport}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">

                    <div className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {event.date}
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

      {/* ANNOUNCEMENTS */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">

        <div className="p-5 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-lg text-slate-900">
              Latest Announcements
            </h2>

            <p className="text-sm text-slate-500">
              Important club updates
            </p>
          </div>

          <Megaphone
            size={21}
            className="text-emerald-500"
          />

        </div>

        <div className="p-5 grid md:grid-cols-3 gap-4">

          {announcements.length === 0 ? (

            <p className="text-slate-500 text-sm">
              No announcements available.
            </p>

          ) : (

            announcements.map((announcement) => (

              <div
                key={announcement.id}
                className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"
              >

                <div className="flex items-center justify-between gap-2">

                  <h3 className="font-semibold text-slate-800">
                    {announcement.title}
                  </h3>

                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {announcement.type}
                  </span>

                </div>

                <p className="text-sm text-slate-500 mt-2">
                  {announcement.message}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;