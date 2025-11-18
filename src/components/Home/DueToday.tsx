'use client'
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { showSuccessToast } from '../toast';
import AddHabitModal from '../Models/AddHabitModal';

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

export default function DueToday({ onChange }: { onChange: () => void }) {
    const router = useRouter();

    const [habits, setHabits] = useState<DueItem[]>([]);
    const [challenges, setChallenges] = useState<DueItem[]>([]);
    const [refetch, setRefetch] = useState<"habit" | "challenge" | null>(null);
    const [habitModalOpen, setHabitModalOpen] = useState(false);

    useEffect(() => {
        fetchDueHabitsToday();
        fetchDueChallengesToday();
    }, []);

    const fetchDueHabitsToday = async () => {
        try {
            const habitRes = await axiosInstance.get('/habitLog/today');
            setHabits(habitRes.habit || []);

        } catch (error) {
            // toast.error("Couldn't load today's due items");
            // console.error(error);
        }
    };
    const fetchDueChallengesToday = async () => {
        try {
            const challengeRes = await axiosInstance.get('/challengeLog/user/today');
            setChallenges(challengeRes.challenge || []);

        } catch (error) {
            // toast.error("Couldn't load today's due items");
            // console.error(error);
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
                    : `/challengeLog/${logId}`;

            const res = await axiosInstance.patch(endpoint, { status: nextStatus });
            showSuccessToast(res.message)
            setRefetch(type)
            onChange();

        } catch (error) {
            // toast.error('Failed to update status');
            // console.error(error);
        }
    };

    useEffect(() => {
        if (refetch === "habit") {
            fetchDueHabitsToday()
            setRefetch(null);
        } else if (refetch === "challenge") {
            fetchDueChallengesToday()
            setRefetch(null);
        }
    }, [refetch]);

    const renderSection = (
        title: string,
        list: DueItem[],
        type: "habit" | "challenge"
    ) => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div className='flex gap-4'>
                    {type === "habit" && (
                        <button
                            onClick={() => setHabitModalOpen(true)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            + Add Habit
                        </button>)}
                    <button
                        onClick={() => router.push(`/${type === "habit" ? "habit" : "myChallenges"}`)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        View My {type === "habit" ? "Habits" : "Challenges"} →
                    </button>

                </div>
            </div>
            <div className="space-y-4">
                {list.length === 0 && (
                    <p>No {type === "habit" ? "Habits" : "Challenges"} due today! Rest up.</p>
                )}
                {list.length === 0 && type === "challenge" && (
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
        <>
            <div>
                {renderSection("🗓️ Today's Habits", habits, "habit")}
                {renderSection("🏆 Today's Challenges", challenges, "challenge")}
            </div>
            <AddHabitModal
                isOpen={habitModalOpen}
                onClose={() => {
                    setHabitModalOpen(false)
                }}
                onHabitCreated={fetchDueHabitsToday}
            />
        </>
    );
}
