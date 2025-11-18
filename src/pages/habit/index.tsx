'use client'

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import AddHabitModal from "@/components/Models/AddHabitModal";
import { Pagination } from "@/components/pagination";
import { paginationDataType } from "@/components/types";

interface Habit {
    id: number;
    title: string;
    description: string;
    frequency_type: string;
    frequency_value: number;
}

export default function AllHabits() {
    const router = useRouter();

    const [habits, setHabits] = useState<Habit[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [habitId, setHabitId] = useState<number>();
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    });

    const fetchHabits = async (page = 1, limit = 5) => {
        try {
            const res = await axiosInstance.get("/habit/user", {
                params: { page, limit },
            });

            setHabits(res.habits || []);

            setPaginationData(res.pagination);
        } catch (err) {
            console.error("Failed to fetch habits:", err);
        }
    };

    useEffect(() => {
        fetchHabits(currentPage, paginationData.itemsPerPage);
    }, [isDeleted, currentPage, paginationData.itemsPerPage]);

    const handleDeleteHabit = async (habitId: number) => {
        try {
            await axiosInstance.post(`/habit/${habitId}`, { mode: "delete" });
            setIsDeleted((prev) => !prev);
        } catch (err) {
            console.error("Failed to delete habit:", err);
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📋 All Habits</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Habit
                </button>
            </div>

            {habits.length === 0 ? (
                <p className="text-gray-500">No habits found. Start by adding one.</p>
            ) : (
                <div className="space-y-2">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="p-4 bg-gray-50 rounded border border-gray-200 flex justify-between cursor-pointer"
                            onClick={() => router.push(`/habit/${habit.id}`)}
                        >
                            <div>
                                <h3 className="font-semibold">{habit.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {habit.frequency_type === "daily"
                                        ? "Daily"
                                        : habit.frequency_type === "every_x_days"
                                            ? `Every ${habit.frequency_value} days`
                                            : `${habit.frequency_value}x / week`}
                                </p>
                                {habit.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {habit.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <button
                                    className="font-semibold text-blue-600 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHabitId(habit.id);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="font-semibold text-red-600 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteHabit(habit.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {paginationData.total > 0 && (
                <Pagination
                    paginationData={paginationData}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPaginationData((prev) => ({ ...prev, itemsPerPage: size }))
                        setCurrentPage(1)
                    }}
                    contentType="Habit"
                />
            )}

            <AddHabitModal
                isOpen={isModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setIsEditModalOpen(false)
                }}
                onHabitCreated={fetchHabits}
                habitId={isEditModalOpen ? habitId : undefined}
            />
        </div>
    );
}
