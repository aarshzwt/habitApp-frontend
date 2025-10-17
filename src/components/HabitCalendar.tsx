import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";

type Log = {
    id: number;
    date: string;
    status: "completed" | "missed" | "remaining";
};

interface HabitCalendarProps {
    allLogs: Log[];
    startDate: string | Date;
    endDate: string | Date | null;
    onChange: () => void;
}

export default function HabitCalendar({ allLogs, startDate, endDate, onChange }: HabitCalendarProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);

    // Memoize month logs so we only recalc when date or allLogs changes
    const monthLogs = useMemo(() => {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        return allLogs.filter((log: Log) => {
            const logDate = new Date(log.date);
            return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });
    }, [date, allLogs]);

    // Memoized tile class function
    const getTileClass = useCallback(
        ({ date: tileDate, view }: { date: Date; view: string }) => {
            if (view !== "month") return "";

            const log = monthLogs.find(
                (log) => new Date(log.date).toDateString() === tileDate.toDateString()
            );

            if (!log) return "bg-gray-50 text-gray-800";
            if (log.status === "completed") return "bg-green-100 text-green-800";
            if (log.status === "missed") return "bg-red-100 text-red-800";
            if (log.status === "remaining") return "bg-yellow-100 text-yellow-800";
            return "";
        },
        [monthLogs]
    );

    // Memoized day click handler
    const dayClicked = useCallback(
        (selectedDate: Date) => {
            const log = monthLogs.find(
                (log) => new Date(log.date).toDateString() === selectedDate.toDateString()
            );
            if (log) {
                setSelectedLog(log);
                setOpenIndex(log.id);
            }
        },
        [monthLogs]
    );

    const updateHabitStatus = useCallback(
        async (logId: number, status: "completed" | "missed" | "remaining") => {
            try {
                await axiosInstance.patch(`/habitLog/${logId}`, { status });
                onChange();
            } catch (error) {
                toast.error('Failed to update status');
                console.error(error);
            }
        },
        [onChange]
    );

    // Memoized filtered logs for button eligibility
    const isEditable = useMemo(
        () =>
            selectedLog
                ? new Date().setDate(new Date().getDate() - 7) <= new Date(selectedLog.date) &&
                new Date(selectedLog.date) <= new Date()
                : false,
        [selectedLog]
    );

    return (
        <>
            <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-200 w-1/2">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    📅 <span>Logs Calendar</span>
                </h2>

                <div className="flex justify-center">
                    <Calendar
                        onClickDay={dayClicked}
                        value={date}
                        onActiveStartDateChange={({ activeStartDate }) => setDate(activeStartDate ?? new Date())}
                        tileClassName={getTileClass}
                        minDate={new Date(startDate)}
                        maxDate={endDate ? new Date(endDate) : undefined}
                        next2Label={null}
                        prev2Label={null}
                        calendarType="gregory"
                        formatShortWeekday={(locale, date) =>
                            date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
                        }
                        className="rounded-2xl shadow-lg p-4"
                    />
                </div>
            </div>

            {openIndex !== null && selectedLog && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setOpenIndex(null)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Log Details</h2>
                        <div>
                            <p><strong>Date:</strong> {selectedLog.date}</p>
                            <p><strong>Status:</strong> {selectedLog.status}</p>
                        </div>

                        {isEditable && (
                            <div className="mt-4">
                                <button
                                    className={`px-4 py-2 rounded-lg font-semibold transition
                                        ${selectedLog.status === "completed"
                                            ? "bg-green-500 text-white"
                                            : selectedLog.status === "missed"
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-300 text-black"
                                        }`}
                                    onClick={() => {
                                        const nextStatus: "completed" | "missed" | "remaining" =
                                            selectedLog.status === "remaining"
                                                ? "completed"
                                                : selectedLog.status === "completed"
                                                    ? "missed"
                                                    : "remaining";

                                        updateHabitStatus(selectedLog.id, nextStatus);
                                    }}
                                >
                                    {selectedLog.status === "completed"
                                        ? "✅ Completed"
                                        : selectedLog.status === "missed"
                                            ? "⏭️ Missed"
                                            : "⏳ Remaining"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
