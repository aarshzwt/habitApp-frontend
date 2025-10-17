import Area from "@/components/charts/Area";
import Bar from "@/components/charts/Bar";
import Donut from "@/components/charts/Donut";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import HabitCalendar from "@/components/HabitCalendar";

type Habit = {
    id: number;
    title: string;
    description: string;
    frequency_type: string;
    frequency_value: number;
    frequency_days: number[] | null;
    start_date: string;
    end_date?: string | null;
};

type Log = {
    id: number;
    date: string;
    status: "completed" | "missed" | "remaining";
};

type Stats = {
    total_logs: number;
    completed: number;
    missed: number;
    remaining: number;
    completion_rate: number;
    streak: number;
    maxStreak: number;
};
export default function HabitDetail() {

    const router = useRouter();
    const { id } = router.query;

    const [habit, setHabit] = useState<Habit | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const weekDays = [
        { label: "Sun", value: 0 },
        { label: "Mon", value: 1 },
        { label: "Tue", value: 2 },
        { label: "Wed", value: 3 },
        { label: "Thu", value: 4 },
        { label: "Fri", value: 5 },
        { label: "Sat", value: 6 },
    ];

    useEffect(() => {
        if (!id) return;
        getDetails();
    }, [id]);

    async function getDetails() {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/habit/${id}`);
            console.log(res);
            setHabit(res.habit);
            setLogs(res.logs);
            setStats(res.stats);
        } catch (err) {
            console.error("Error fetching habit details:", err);
            setError("Failed to load habit details. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500 text-lg">Loading habit details...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 text-lg">{error}</div>
        );
    }

    if (!habit || !stats) {
        return (
            <div className="text-center py-10 text-gray-500 text-lg">No data found.</div>
        );
    }

    return (
        <div className="w-full bg-gray-200">
            <div className="max-w-7xl mx-auto p-6 space-y-8 ">
                {/* Header */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-800">{habit.title}</h1>
                    <p className="text-gray-600 mt-2">{habit.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            Frequency: {habit.frequency_type === "daily" ? "Daily" : habit.frequency_type === "every_x_days" ? `every ${habit.frequency_value} days` : `${habit.frequency_value}x / week`}
                        </span>
                        {habit.frequency_days && (
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                Repeat Days:{" "}
                                {habit.frequency_days
                                    .map(fd => weekDays.find(day => day.value === fd)?.label)
                                    .join(", ")}
                            </span>
                        )}

                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                            Start: {habit.start_date}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                            End: {habit.end_date || "Ongoing"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* Logs */}
                    {logs && habit && (
                        <HabitCalendar allLogs={logs} startDate={habit.start_date} endDate={habit.end_date ?? null} onChange={getDetails} />
                    )}

                    {/* Stats */}
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 w-1/2">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">📈 Statistics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard label="Total Logs" value={stats.total_logs ?? 0} />
                            <StatCard label="Completed" value={stats.completed ?? 0} />
                            <StatCard label="Missed" value={stats.missed ?? 0} />
                            <StatCard label="Remaining" value={stats.remaining ?? 0} />
                            <StatCard label="Completion Rate" value={`${stats.completion_rate ?? 0}%`} />
                            <StatCard label="Streak🔥" value={`${stats.streak} Day(s)`} />
                            <StatCard label="Max Streak" value={`${stats.maxStreak} Day(s)`} />

                        </div>
                    </div>
                </div>


                {/* Charts */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 space-y-10">
                    <h2 className="text-xl font-semibold text-gray-800">📊 Visual Insights</h2>
                    <div className=" flex">
                        {/* Donut Chart */}
                        <div className="w-1/2">
                            <h3 className="text-md font-medium mb-2 text-gray-700">Status Breakdown</h3>
                            <Donut
                                series={[stats.completed, stats.missed, stats.remaining]}
                                labels={["Completed", "Missed", "Remaining"]}
                                tooltipFormatter={(val) => `${val} logs`}
                            />
                        </div>
                        {/* Bar Chart */}
                        <div className="w-1/2">
                            <h3 className="text-md font-medium mb-2 text-gray-700">Log Status Count</h3>
                            <Bar
                                categories={["Completed", "Missed", "Remaining"]}
                                series={[{
                                    name: "Logs",
                                    data: [stats.completed, stats.missed, stats.remaining]
                                }]}
                            />
                        </div>
                    </div>

                    {/* Area Chart */}
                    <div>
                        <h3 className="text-md font-medium mb-2 text-gray-700">Log Status Over Time</h3>
                        <Area
                            seriesName="Status Score"
                            data={logs.map(log => {
                                const map = { completed: 1, missed: -1, remaining: 0 };
                                return map[log.status];
                            })}
                            categories={logs.map(log => new Date(log.date).toLocaleDateString())}
                            yAxisLabel="Status"
                            xAxisLabel="Date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

function StatCard({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow transition">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600 mt-1">{label}</div>
        </div>
    );
}

