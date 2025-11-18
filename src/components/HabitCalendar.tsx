import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { HabitCalendarProps, Log } from "./types";

export default function HabitCalendar({ allLogs, startDate, endDate, onChange, type, clickable = true }: HabitCalendarProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);

    useEffect(() => {
        const max = endDate ? new Date(endDate) : null;
        const min = startDate ? new Date(startDate) : null;

        // If current date is outside the allowed range, reset it
        if (max && date > max) setDate(max);
        else if (min && date < min) setDate(min);
    }, [startDate, endDate]);

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

            if (!log) return `bg-gray-50 text-gray-800 ${!clickable ? "pointer-events-none opacity-75" : ""}`;
            if (log.status === "completed") return `bg-green-100 text-green-800 ${!clickable ? "pointer-events-none opacity-75" : ""}`;
            if (log.status === "missed") return `bg-red-100 text-red-800 ${!clickable ? "pointer-events-none opacity-75" : ""}`;
            if (log.status === "remaining") return `bg-yellow-100 text-yellow-800 ${!clickable ? "pointer-events-none opacity-75" : ""}`;
            return `${!clickable ? "pointer-events-none opacity-75" : ""}`;
        },
        [monthLogs]
    );

    // Memoized day click handler
    const dayClicked = useCallback(
        (selectedDate: Date) => {
            if (!clickable) return;
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
                await axiosInstance.patch(`/${type}Log/${logId}`, { status });
                onChange();
                setOpenIndex(null)

            } catch (error) {
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
            <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100 max-w-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                    📅 <span>Logs Calendar</span>
                </h2>
                <div className="flex justify-center">
                    <Calendar
                        onClickDay={dayClicked}
                        value={date}
                        onActiveStartDateChange={({ activeStartDate }) =>
                            setDate(activeStartDate ?? new Date())
                        }
                        tileClassName={getTileClass}
                        minDate={new Date(startDate)}
                        maxDate={endDate ? new Date(endDate) : undefined}
                        next2Label={null}
                        prev2Label={null}
                        calendarType="gregory"
                        formatShortWeekday={(locale, date) =>
                            date
                                .toLocaleDateString(locale, { weekday: "short" })
                                .toUpperCase()
                        }
                        className={`react-calendar`}
                    />
                </div>
            </div>

            {openIndex !== null && selectedLog && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setOpenIndex(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md transition-all border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            Log Details
                        </h2>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Date:</strong> {selectedLog.date}</p>
                            <p><strong>Status:</strong> <span className={` ${selectedLog.status === "completed"
                                ? "text-green-500"
                                : selectedLog.status === "missed"
                                    ? "text-red-500"
                                    : "text-yellow-400"
                                }`}> {selectedLog.status} </span> </p>
                        </div>

                        {isEditable && (
                            <div className="mt-5 flex justify-end">
                                <button
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all
            ${selectedLog.status === "completed"
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : selectedLog.status === "missed"
                                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                                : "bg-green-400 text-gray-900 hover:bg-green-500"
                                        }`}
                                    onClick={() => {
                                        const nextStatus =
                                            selectedLog.status === "remaining"
                                                ? "completed"
                                                : selectedLog.status === "completed"
                                                    ? "missed"
                                                    : "remaining";
                                        updateHabitStatus(selectedLog.id, nextStatus);
                                    }}
                                >
                                    {selectedLog.status === "completed"
                                        ? "❌ Mark Missed"
                                        : selectedLog.status === "missed"
                                            ? "⏳ Reset to Remaining"
                                            : "💪 Mark Completed"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            )}
        </>
    );
}
