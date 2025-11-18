// components/TodayHabits.js
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/router';

const STATUS_COLORS = {
    remaining: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    missed: 'bg-red-100 text-red-800'
};

const STATUS_CYCLE = {
    remaining: 'completed',
    completed: 'missed',
    missed: 'remaining'
};

type Habit = {
    id: number;
    log_id: number;
    title: string;
    description: string;
    status: keyof typeof STATUS_COLORS;
};
interface TodayHabitsProps {
    onStatusUpdated: () => void
}
export default function TodayHabits({ onStatusUpdated }: TodayHabitsProps) {
    const router = useRouter();
    const [habits, setHabits] = useState<Habit[]>([]);

    const fetchTodayHabits = async (): Promise<void> => {
        try {
            const res = await axiosInstance.get('/habitLog/today');
            setHabits(res.habit);
        } catch (error) {
        }
    };

    const updateHabitStatus = async (logId: number, currentStatus: keyof typeof STATUS_CYCLE): Promise<void> => {
        const nextStatus = STATUS_CYCLE[currentStatus];
        try {
            await axiosInstance.patch(`/habitLog/${logId}`, { status: nextStatus });
            setHabits(prev =>
                prev.map(habit =>
                    habit.log_id === logId ? { ...habit, status: nextStatus as Habit['status'] } : habit
                )
            );
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchTodayHabits();
    }, []);

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🗓️ Today’s Habits</h2>
            <div className="space-y-4">
                {habits.length === 0 && (
                    <p> No Habits due today!! Rest Up.</p>
                )}
                {habits.map((habit) => (
                    <div
                        key={habit.log_id}
                        className="flex justify-between items-center p-4 bg-white rounded shadow-sm border"
                        onClick={() => router.push(`/habit/${habit.id}`)}
                    >
                        <div>
                            <h3 className="font-medium">{habit.title}</h3>
                            <p className="text-sm text-gray-500">{habit.description}</p>
                        </div>

                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                await updateHabitStatus(habit.log_id, habit.status)
                                onStatusUpdated();
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${STATUS_COLORS[habit.status]}`}
                        >
                            {habit.status.charAt(0).toUpperCase() + habit.status.slice(1)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
