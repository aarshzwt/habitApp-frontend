import { Flame } from "lucide-react";
import { ParticipantCardPropsType } from "../types";

const statusColors: Record<string, string> = {
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    scheduled: "bg-yellow-100 text-yellow-700",
};
const colors = [
    "bg-red-100 text-red-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
];

export function ParticipantCard({
    participant,
    onClick,
    expanded = false,
}: ParticipantCardPropsType) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const colorClass = statusColors[participant.status] || "bg-gray-100 text-gray-700";

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer ${expanded ? "col-span-full" : ""}`}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 ${randomColor} rounded-full flex items-center justify-center font-bold`}>
                        {participant.username[0].toUpperCase()}
                    </div>
                    <h4 className="font-semibold text-gray-800 truncate">{participant.username}</h4>
                </div>

                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full self-start ${colorClass}`}
                >
                    {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                </span>
                {participant.status === "active" && (
                    <div className="flex items-center text-sm text-gray-600 gap-1">
                        Streak <Flame className="text-orange-500 w-4 h-4" />{" "}
                        {participant.streak}/{participant.maxStreak}
                    </div>
                )}
            </div>

            {expanded && (
                <div className="mt-3 text-sm text-gray-600">
                    {participant.status === "active" && (
                        <p>
                            <strong>Streak:</strong> {participant.streak}
                        </p>
                    )}
                    <p>Max Streak: {participant.maxStreak}</p>
                    <p>Start Date: {new Date(participant.start_date).toLocaleDateString()}</p>
                </div>
            )}
        </div >
    );
}
