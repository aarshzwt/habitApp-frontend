import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export function ChallengeLogs({ challengeId }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const getLogs = async () => {
            const res = await axiosInstance.get(`/challengeLogs/${challengeId}`)
            setLogs(res.logs)
        }
        getLogs();
    }, [challengeId]);

    const markLog = (status: "completed" | "missed" | "remaining") => {
        axiosInstance.post(`/challengeLogs/challenge/${challengeId}`, { status, date: new Date() })
            .then(() => axiosInstance.get(`/challengeLogs/${challengeId}`))
            .then(res => setLogs(res.logs));
    };

    if (logs.length < 1) {
        return null
    }

    return (
        <>
            <h3 className="font-semibold text-gray-700 mb-2">Your Progress</h3>
            <div className="bg-gray-50 p-3 rounded-lg">

                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => markLog("remaining")}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
                    >
                        ⭕ Mark Remaining
                    </button>
                    <button
                        onClick={() => markLog("completed")}
                        className="bg-green-400 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                    >
                        ✅ Mark Completed
                    </button>
                    <button
                        onClick={() => markLog("missed")}
                        className="bg-red-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
                    >
                        ❌ Mark Missed
                    </button>
                </div>

                <ul className="text-sm space-y-1">
                    {logs.map(l => (
                        <li key={l.id} className="flex justify-between">
                            <span>{l.date}</span>
                            <span
                                className={`${l.status === "completed"
                                    ? "text-green-600"
                                    : l.status === "missed"
                                        ? "text-red-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {l.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
