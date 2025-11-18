import { CheckCircle, Clock, X } from "lucide-react";
import { Participant } from "../types";
import HabitCalendar from "@/components/HabitCalendar";

export function ParticipantModal({
    participant,
    onClose,
}: {
    participant: Participant;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {participant.username}'s Progress
                </h2>

                <div className="text-sm text-gray-600 mb-4">
                    <p>
                        <strong>Streak:</strong> {participant.streak}/{participant.maxStreak}
                    </p>
                    <p>Status: {participant.status}</p>
                </div>

                <HabitCalendar
                    clickable={false}
                    type="challenge"
                    allLogs={participant.logs}
                    startDate={participant.start_date}
                    endDate={participant.end_date ?? null}
                    onChange={() => { }}
                />

                {/* <div className="mt-4 max-h-[250px] overflow-y-auto grid grid-cols-2 gap-2">
                    {participant.logs.map((log) => (
                        <div
                            key={log.id}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${log.status === "completed"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : log.status === "remaining"
                                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                        : "bg-red-50 border-red-200 text-red-700"
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
                </div> */}
            </div>
        </div>
    );
}
