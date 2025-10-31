'use client'
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
    remaining: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    missed: 'bg-red-100 text-red-800'
};

const STATUS_CYCLE: Record<string, string> = {
    remaining: 'completed',
    completed: 'missed',
    missed: 'remaining'
};

type DueItem = {
    id: number;
    log_id: number;
    title: string;
    description: string;
    status: keyof typeof STATUS_COLORS;
};

export default function DueToday() {
    const router = useRouter();

    const [habits, setHabits] = useState<DueItem[]>([]);
    const [challenges, setChallenges] = useState<DueItem[]>([]);

    const fetchDueToday = async () => {
        try {
            const habitRes = await axiosInstance.get('/habitLog/today');
            setHabits(habitRes.habit || []);

            const challengeRes = await axiosInstance.get('/challengeLogs/user/today');
            setChallenges(challengeRes.challenge || []);

        } catch (error) {
            toast.error("Couldn't load today's due items");
            console.error(error);
        }
    };

    const updateStatus = async (
        type: "habit" | "challenge",
        logId: number,
        currentStatus: keyof typeof STATUS_CYCLE
    ) => {
        const nextStatus = STATUS_CYCLE[currentStatus];

        try {
            const endpoint =
                type === "habit"
                    ? `/habitLog/${logId}`
                    : `/challengeLogs/${logId}`;

            await axiosInstance.patch(endpoint, { status: nextStatus });

            const stateUpdater = type === "habit" ? setHabits : setChallenges;

            stateUpdater((prev: DueItem[]) =>
                prev.map(item =>
                    item.log_id === logId
                        ? { ...item, status: nextStatus as DueItem['status'] }
                        : item
                )
            );

        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDueToday();
    }, []);

    const renderSection = (
        title: string,
        list: DueItem[],
        type: "habit" | "challenge"
    ) => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <button
                    onClick={() => router.push(`/${type === "habit" ? "habit" : "myChallenges"}`)}
                    className="text-blue-600 font-medium hover:underline"
                >
                    View My {type === "habit" ? "Habits" : "Challenges"} →
                </button>
            </div>
            <div className="space-y-4">
                {list.length === 0 && (
                    <p>No {type === "habit" ? "Habits" : "Challenges"} due today! Rest up.</p>
                )}
                {type === "challenge" && (
                    <button
                        onClick={() => router.push("/challenge")}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Explore More →
                    </button>)}
                {list.map(item => (
                    <div
                        key={item.log_id}
                        className="flex justify-between items-center p-4 bg-white rounded shadow-sm border cursor-pointer"
                        onClick={() => router.push(`/${type}/${item.id}`)}
                    >
                        <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>

                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                await updateStatus(type, item.log_id, item.status);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${STATUS_COLORS[item.status]}`}
                        >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {renderSection("🗓️ Today's Habits", habits, "habit")}
            {renderSection("🏆 Today's Challenges", challenges, "challenge")}
        </div>
    );
}
