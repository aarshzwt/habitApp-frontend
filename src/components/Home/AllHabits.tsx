import { useEffect, useState } from "react";
import AddHabitModal from "../Models/AddHabitModal";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
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
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const fetchHabits = async () => {
    try {
      const res = await axiosInstance.get("/habit/user", {
        params: {
          page: 1,
          limit: 5,
        }
      });
      setHabits(res.habits);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [isDeleted]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📋 All Habits</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Habit
        </button>
      </div>

      {habits && habits.length === 0 ? (
        <p className="text-gray-500">No habits found. Start by adding one.</p>
      ) : (
        <div className="space-y-2">
          {habits && habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 bg-gray-50 rounded border border-gray-200 flex justify-between"
              onClick={() => router.push(`/habit/${habit.id}`)}
            >
              <div>
                <h3 className="font-semibold">{habit.title}</h3>
                <p className="text-sm text-gray-500">{habit.frequency_type === "daily" ? "Daily" : habit.frequency_type === "every_x_days" ? `every ${habit.frequency_value} days` : `${habit.frequency_value}x / week`}</p>
                {habit.description && (
                  <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                )}
              </div>
              <div className="flex flex-col">
                <button className="font-semibold" onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setHabitId(habit.id)
                  setIsEditModalOpen(true);
                }}>edit</button>
                <button className="font-semibold" onClick={async (e) => {
                  e.stopPropagation();
                  setHabitId(habit.id);
                  await axiosInstance.post(`/habit/${habitId}`, { mode: "delete" })
                  setIsDeleted(prev => prev = !prev)
                }}>delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitCreated={fetchHabits}
      />
      <AddHabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onHabitCreated={fetchHabits}
        habitId={habitId}
      />
    </div>
  );
}
