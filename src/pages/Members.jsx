import { useEffect, useState } from "react";
import {
  Users,
  User,
  Calendar,
  Dumbbell,
  Trash2,
  X,
  CheckCircle
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Members() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRegisteredMembers();
  }, []);

  async function loadRegisteredMembers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading registered members:", error);
      setMessage("Could not load registered members.");
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  }

  function askRemove(member) {
    setSelectedMember(member);
    setMessage("");
  }

  async function removeMember() {
    if (!selectedMember) return;

    setRemoving(true);
    setMessage("");

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", selectedMember.id);

    if (error) {
      console.error("Error removing registration:", error);

      setMessage(
        "Could not remove registration. Please try again."
      );

      setRemoving(false);
      return;
    }

    setRegistrations((current) =>
      current.filter(
        (member) => member.id !== selectedMember.id
      )
    );

    setMessage("Registration removed successfully.");

    setTimeout(() => {
      setSelectedMember(null);
      setMessage("");
    }, 1200);

    setRemoving(false);
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Registered Members
        </h1>

        <p className="text-slate-500 mt-1">
          Members who have registered for club activities
        </p>
      </div>

      {/* COUNT */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Users size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Registrations
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {registrations.length}
            </h2>
          </div>

        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading registered members...
        </div>
      ) : registrations.length === 0 ? (

        /* EMPTY STATE */

        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users size={25} />
          </div>

          <h2 className="mt-4 font-semibold text-slate-800">
            No registered members yet
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Members will appear here after registering
            for a training or event.
          </p>

        </div>

      ) : (

        /* MEMBERS */

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {registrations.map((registration) => (

            <div
              key={registration.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >

              {/* MEMBER HEADER */}

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <User size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {registration.member_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Registered Member
                  </p>
                </div>

              </div>

              {/* ACTIVITY */}

              <div className="mt-5 pt-4 border-t border-slate-100">

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  {registration.activity_type === "Training" ? (
                    <Dumbbell size={17} />
                  ) : (
                    <Calendar size={17} />
                  )}

                  <span>
                    {registration.activity_type}
                  </span>

                </div>

                <div className="mt-3">

                  <p className="text-xs text-slate-400">
                    Registration ID
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    #{registration.id}
                  </p>

                </div>

              </div>

              {/* REMOVE BUTTON */}

              <button
                onClick={() => askRemove(registration)}
                className="mt-5 w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-medium transition"
              >
                <Trash2 size={17} />
                Unregister
              </button>

            </div>

          ))}

        </div>
      )}

      {/* CONFIRMATION MODAL */}

      {selectedMember && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <div className="flex justify-between items-center">

              <h2 className="text-xl font-bold text-slate-900">
                Remove Registration?
              </h2>

              <button
                onClick={() => {
                  setSelectedMember(null);
                  setMessage("");
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={22} />
              </button>

            </div>

            <p className="text-slate-600 mt-4">
              Are you sure you want to unregister{" "}
              <span className="font-semibold text-slate-900">
                {selectedMember.member_name}
              </span>{" "}
              from this {selectedMember.activity_type.toLowerCase()}?
            </p>

            {message && (
              <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => {
                  setSelectedMember(null);
                  setMessage("");
                }}
                className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={removeMember}
                disabled={removing}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-xl font-medium"
              >
                {removing ? "Removing..." : "Yes, Unregister"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Members;