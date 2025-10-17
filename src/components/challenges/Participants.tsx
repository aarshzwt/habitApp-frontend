import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react"; // icons

export function Participants({ challengeId }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const getParticipants = async () => {
      const res = await axiosInstance.get(`/challenges/${challengeId}/participants`);
      setParticipants(res.participants);
    };
    getParticipants();
  }, [challengeId]);

  if (participants.length === 0) {
    return <p className="text-gray-500 italic">No participants yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 mb-2">Participants</h3>

      {participants.map((p) => (
        <div
          key={p.user_id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
                {p.username[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{p.username}</h4>
                <p className="text-xs text-gray-500 capitalize">
                  Status: {p.status}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">
                Current Streak 🔥: <span className="font-medium text-indigo-600">{p.streak}</span>
              </p>
              <p className="text-xs text-gray-400">
                Max Streak: <span className="font-medium">{p.maxStreak}</span>
              </p>
              <div className="w-32 bg-gray-100 rounded-full h-2 mt-1">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${(p.streak / p.maxStreak) * 100}%`
                  }}
                ></div>
              </div>

            </div>
          </div>

          {/* Logs */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {p.logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${log.status === "completed"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : log.status === "remaining" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-red-50 border-red-200 text-red-700"
                    }`}
                >
                  {log.status === "completed" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
