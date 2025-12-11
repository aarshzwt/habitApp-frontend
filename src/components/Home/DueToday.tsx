'use client'
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import AddHabitModal from '../Models/AddHabitModal';
import CreateChallengeModal from '../Models/CreateChallengeModal';

const STATUS_COLORS: Record<string, string> = {
    remaining: "bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm",
    completed: "bg-green-100 text-green-800 border border-green-300 shadow-sm",
    missed: "bg-red-100 text-red-800 border border-red-300 shadow-sm",
};

const STATUS_CYCLE: Record<string, string> = {
    remaining: 'completed',
    completed: 'missed',
    missed: 'remaining'
};

type DueItem = { id: number; log_id: number; title: string; description: string; status: keyof typeof STATUS_COLORS };

export default function DueTodayB({ onChange }: { onChange: () => void }) {
    const router = useRouter();

    const [habits, setHabits] = useState<DueItem[]>([]);
    const [challenges, setChallenges] = useState<DueItem[]>([]);
    const [refetch, setRefetch] = useState<"habit" | "challenge" | null>(null);
    const [habitModalOpen, setHabitModalOpen] = useState(false);
    const [challengeModalOpen, setChallengeModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetchDueHabits();
        fetchDueChallenges();
    }, []);

    const fetchDueHabits = async () => {
        try {
            const r = await axiosInstance.get('/habitLog/today');
            setHabits(r.habit || []);
        }
        catch { }
    }
    const fetchDueChallenges = async () => {
        try {
            const r = await axiosInstance.get('/challengeLog/user/today');
            setChallenges(r.challenge || []);
        } catch { }
    }

    const updateStatus = async (type: "habit" | "challenge", logId: number, currentStatus: keyof typeof STATUS_CYCLE) => {
        const next = STATUS_CYCLE[currentStatus];
        try {
            const endpoint = type === "habit" ? `/habitLog/${logId}` : `/challengeLog/${logId}`;
            await axiosInstance.patch(endpoint, { status: next });
            setRefetch(type);
            setTimeout(() => onChange(), 200);
        } catch { }
    }

    useEffect(() => {
        if (refetch === "habit") {
            fetchDueHabits();
            setRefetch(null);
        }
    }, [refetch]);
    useEffect(() => {
        if (refetch === "challenge") {
            fetchDueChallenges();
            setRefetch(null);
        }
    }, [refetch]);

    // shared card renderer
    const renderList = (list: DueItem[], type: "habit" | "challenge") => (
        <div className="space-y-3">
            {list.map(item => (
                <div key={item.log_id}
                    onClick={() => router.push(`/${type === "habit" ? "habit" : "myChallenges"}/${item.id}`)}
                    className="group flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-xl 
                    hover:shadow-xl shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer
                    hover:-translate-y-0.5 hover:bg-white">

                    <div className="min-w-0">
                        <div className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition">
                            {item.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                            {item.description}
                        </div>
                    </div>

                    <button
                        onClick={async (e) => { e.stopPropagation(); await updateStatus(type, item.log_id, item.status); }}
                        className={`ml-4 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm 
                        ${STATUS_COLORS[item.status]} transition`}
                    >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-1 gap-8">
                {/* Modern Top Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-pink-100 
                border border-white/40 shadow-xl backdrop-blur-md">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm shadow">
                                    Today
                                </span>
                                Your Tasks
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Quick overview of today's habits & challenges.
                            </p>
                        </div>

                        <div className="relative">
                            <button
                                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition flex items-center gap-2"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                Quick Actions <span>▾</span>
                            </button>

                            {menuOpen && (
                                <div
                                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/40 
                                    bg-white/60 backdrop-blur-xl shadow-xl p-2 z-20
                                    animate-fadeIn"
                                >
                                    <button
                                        onClick={() => setHabitModalOpen(true)}
                                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-indigo-50/70 
                                        transition font-medium text-gray-700"
                                    >
                                        + Add Habit
                                    </button>

                                    <button
                                        onClick={() => router.push('/habit')}
                                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-indigo-50/70 
                                        transition font-medium text-gray-700"
                                    >
                                        View Habits
                                    </button>

                                    <hr className="my-2 border-gray-200/60" />

                                    <button
                                        onClick={() => setChallengeModalOpen(true)}
                                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-pink-50/70 
                                        transition font-medium text-gray-700"
                                    >
                                        + Add Challenge
                                    </button>

                                    <button
                                        onClick={() => router.push('/myChallenges')}
                                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-pink-50/70 
                                        transition font-medium text-gray-700"
                                    >
                                        View Challenges
                                    </button>
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Habits */}
                        <div className="p-6 rounded-2xl bg-white/70 shadow-md border border-gray-100 backdrop-blur flex flex-col min-h-[260px]">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <span className="text-indigo-600 text-xl">🗓️</span> Habits Due Today
                            </h3>

                            {habits.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-90">
                                    <svg width="100" height="100" viewBox="0 0 24 24" className="mb-3">
                                        <path
                                            fill="#D1D5DB"
                                            d="M21 8l-9-5l-9 5l9 5l9-5zm-9 7l-9-5v6l9 5l9-5v-6l-9 5z"
                                        />
                                    </svg>

                                    <h3 className="font-semibold text-center text-gray-700">
                                        Nothing due Today, Champ! ✨
                                    </h3>

                                    <p className="text-gray-500 text-sm max-w-sm text-center">
                                        Enjoy your free time — you’ve earned it!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex-1">{renderList(habits, "habit")}</div>
                            )}
                        </div>

                        {/* Challenges */}
                        <div className="p-6 rounded-2xl bg-white/70 shadow-md border border-gray-100 backdrop-blur flex flex-col min-h-[260px]">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <span className="text-pink-600 text-xl">🏆</span> Challenges Today
                            </h3>

                            {challenges.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-90">
                                    <svg width="100" height="100" viewBox="0 0 24 24" className="mb-3">
                                        <path
                                            fill="#D1D5DB"
                                            d="M21 8l-9-5l-9 5l9 5l9-5zm-9 7l-9-5v6l9 5l9-5v-6l-9 5z"
                                        />
                                    </svg>

                                    <h3 className="font-semibold text-center text-gray-700">
                                        Nothing due Today, Champ! 🎯
                                    </h3>

                                    <p className="text-gray-500 text-sm max-w-sm text-center">
                                        Rest up, Check back Tomorrow!!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex-1">{renderList(challenges, "challenge")}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddHabitModal
                isOpen={habitModalOpen}
                onClose={() => setHabitModalOpen(false)}
                onHabitCreated={() => setRefetch("habit")}
            />

            <CreateChallengeModal
                isOpen={challengeModalOpen}
                onClose={() => setChallengeModalOpen(false)}
                onSuccess={() => setRefetch("challenge")}
            />

            {/* <CreateChallengeModal
                isOpen= */}
        </>
    );
}
