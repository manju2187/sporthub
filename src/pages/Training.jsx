import { useEffect, useState } from "react";
import {
  Dumbbell,
  Clock,
  MapPin,
  User,
  X,
  CheckCircle
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Training() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTraining, setSelectedTraining] = useState(null);

  const [memberName, setMemberName] = useState(
    localStorage.getItem("sporthub_user_name") || ""
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTrainings();

    const savedName =
      localStorage.getItem("sporthub_user_name");

    if (savedName) {
      setMemberName(savedName);
    }
  }, []);

  async function loadTrainings() {
    const { data, error } = await supabase
      .from("trainings")
      .select("*")
      .order("date");

    if (error) {
      console.error("Error loading trainings:", error);
    } else {
      setTrainings(data || []);
    }

    setLoading(false);
  }

  function openTraining(training) {
    const savedName =
      localStorage.getItem("sporthub_user_name") || "";

    setMemberName(savedName);
    setSelectedTraining(training);
    setMessage("");
  }

  async function joinTraining() {
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
          activity_type: "Training",
          activity_id: selectedTraining.id
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
      `Successfully registered ${name} for training!`
    );

    setTimeout(() => {
      setSelectedTraining(null);
      setMessage("");
    }, 1800);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Training
        </h1>

        <p className="text-slate-500 mt-1">
          Explore upcoming sports training sessions
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading training sessions...
        </div>
      ) : trainings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          No training sessions available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Dumbbell size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">
                      {training.sport}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {training.level}
                    </p>
                  </div>
                </div>

                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  Training
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={17} />
                  Coach: {training.coach}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={17} />
                  {training.date} • {training.time}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={17} />
                  {training.location}
                </div>
              </div>

              <button
                onClick={() =>
                  openTraining(training)
                }
                className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-medium transition"
              >
                Join Training
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTraining && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Join {selectedTraining.sport}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedTraining.date} •{" "}
                  {selectedTraining.time}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTraining(null);
                  setMessage("");
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-slate-500">
                Coach
              </p>

              <p className="font-medium text-slate-800">
                {selectedTraining.coach}
              </p>

              <p className="text-sm text-slate-500 mt-3">
                Location
              </p>

              <p className="font-medium text-slate-800">
                {selectedTraining.location}
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
              onClick={joinTraining}
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

export default Training;