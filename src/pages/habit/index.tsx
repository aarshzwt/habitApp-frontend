'use client'

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import AddHabitModal from "@/components/Models/AddHabitModal";
import { Pagination } from "@/components/pagination";
import { paginationDataType } from "@/components/types";
import SelectField from "@/components/SelectField";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/categoryHooks";

interface Habit {
    id: number;
    title: string;
    categoryName: string | null,
    description?: string;
    frequency_type: string;
    frequency_value: number;
}

export default function AllHabits() {
    const router = useRouter();

    const [habits, setHabits] = useState<Habit[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [habitId, setHabitId] = useState<number | undefined>(undefined);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isFilterAction, setIsFilterAction] = useState(false);

    const [currentPage, setCurrentPage] = useState(1)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    });

    // filters
    const initialFilters = {
        category_id: "",
        frequency_type: "",
        search: "",
        min_frequency_value: 1,
        max_frequency_value: 7,
    };

    const [filters, setFilters] = useState(initialFilters);
    const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
    const [habitsCount, setHabitsCount] = useState(0);

    const { options: categories, isLoading: categoriesLoading } = useCategories(); // hook to fetch categories

    // helper to build API params from filters
    const buildFilterParams = (f: typeof initialFilters) => {
        const clean: any = {
            ...(f.category_id) && { category_id: f.category_id },
            ...(f.frequency_type) && { frequency_type: f.frequency_type },
            ...(f.search) && { search: f.search },
        };

        if (["every_x_days", "x_times_per_week"].includes(f.frequency_type)) {
            clean.min_frequency_value = f.min_frequency_value;
            clean.max_frequency_value = f.max_frequency_value;
        }

        return clean;
    };

    // fetch habits using filters & pagination
    const fetchHabits = async (page = 1, limit = 5, filtersParam: any = null) => {
        try {
            const res = await axiosInstance.get("/habit/user", {
                params: {
                    page,
                    limit,
                    ...(filtersParam && filtersParam),
                },
            });
            setHabitsCount(res.pagination?.total || 0);
            return res;
        } catch (err) {
            console.error("Failed to fetch habits:", err);
        }
    };

    useEffect(() => {
        async function loadList() {
            try {
                if (!hasLoaded || !isFilterAction) setLoading(true);

                const res = await fetchHabits(
                    currentPage,
                    paginationData.itemsPerPage,
                    buildFilterParams(debouncedFilters)
                );

                if (isFilterAction || !res) return;

                setHabits(res.habits || []);
                setPaginationData(res.pagination || paginationData);
                setHasLoaded(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadList();
    }, [currentPage, paginationData.itemsPerPage, debouncedFilters, isFilterAction, isDeleted]);

    // Single debounce storage for all fields (persist across renders)
    const debounceTimers = useRef<{ [key: string]: any }>({});

    const handleDebouncedFilterChange = (field: string, value: any, delay = 400) => {
        // update UI immediately
        setFilters(prev => ({ ...prev, [field]: value }));
        setIsFilterAction(true);

        // clear previous timer
        if (debounceTimers.current[field]) {
            clearTimeout(debounceTimers.current[field]);
        }

        // start new timer for this field
        debounceTimers.current[field] = setTimeout(() => {
            setDebouncedFilters(prev => ({ ...prev, [field]: value }));
            // once debounced value is applied, allow list loader to run again
            setIsFilterAction(false);
        }, delay);
    };

    const handleDeleteHabit = async (id: number) => {
        try {
            await axiosInstance.post(`/habit/${id}`, { mode: "delete" });
            setIsDeleted((prev) => !prev);
        } catch (err) {
            console.error("Failed to delete habit:", err);
        }
    };

    return (
        <div className="container p-6 max-w-6xl mx-auto">

            {/* HEADER */}
            {/* Title + Create Button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Habits
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        className="px-5 py-2 border border-gray-200 rounded-xl shadow hover:bg-white hover:shadow-md transition text-sm font-medium"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Habit
                    </button>
                    <button
                        onClick={() => setShowFilters(prev => !prev)}
                        className="px-5 py-2 bg-white/70 backdrop-blur border border-gray-200 
                           rounded-xl shadow hover:bg-white hover:shadow-md transition 
                           text-sm font-medium"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>
            </div>

            {/* FILTERS PANEL */}
            {showFilters && (
                <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Filters
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Search */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Search</label>
                            <input
                                name="search"
                                type="text"
                                placeholder="Search habits..."
                                className="border px-4 py-2.5 rounded-lg w-full
                                                   bg-white/70 backdrop-blur focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={filters.search}
                                onChange={(e) => handleDebouncedFilterChange("search", e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Category</label>

                            <div className="[&>*]:!bg-white/70 [&>*]:!border-gray-300 [&>*]:backdrop-blur z-100">
                                <SelectField
                                    options={categories}
                                    value={
                                        categories.find((opt: any) => opt.value === filters.category_id) ||
                                        null
                                    }
                                    className="z-1000"
                                    onChange={(selected) => {
                                        setFilters(prev => ({
                                            ...prev,
                                            category_id: selected?.value || "",
                                        }))
                                        setDebouncedFilters(prev => ({
                                            ...prev,
                                            category_id: selected?.value || "",
                                        }))
                                        setIsFilterAction(true);
                                    }}
                                    placeholder="Select category"
                                />
                            </div>
                        </div>

                        {/* Frequency Type */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Frequency Type</label>
                            <select
                                className="border px-4 py-2.5 rounded-lg w-full bg-white/70 
                                                   backdrop-blur focus:ring-2 focus:ring-blue-300"
                                value={filters.frequency_type}
                                onChange={(e) => {
                                    setFilters(prev => ({
                                        ...prev,
                                        frequency_type: e.target.value,
                                    }))
                                    setDebouncedFilters(prev => ({
                                        ...prev,
                                        frequency_type: e.target.value || "",
                                    }))
                                    setIsFilterAction(true);

                                }}
                            >
                                <option value="">Any Frequency</option>
                                <option value="daily">Daily</option>
                                <option value="every_x_days">Every X Days</option>
                                <option value="x_times_per_week">X Times Per Week</option>
                            </select>
                        </div>
                    </div>

                    {/* Range Section */}
                    {["every_x_days", "x_times_per_week"].includes(filters.frequency_type) && (
                        <div className="mt-6 p-5 bg-white/60 rounded-xl border shadow space-y-4">
                            <label className="font-medium text-gray-700">Frequency Range</label>

                            <div className="flex gap-8">
                                <div className="flex items-center gap-3">
                                    <input
                                        name="min_frequency_value"
                                        type="range"
                                        min="1"
                                        max="6"
                                        className="w-32"
                                        value={filters.min_frequency_value}
                                        onChange={(e) => handleDebouncedFilterChange("min_frequency_value", e.target.value)}
                                    />
                                    <span className="text-gray-700 font-medium">
                                        {filters.min_frequency_value}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="6"
                                        className="w-32"
                                        value={filters.max_frequency_value}
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                max_frequency_value: Number(e.target.value),
                                            }))
                                        }
                                    />
                                    <span className="text-gray-700 font-medium">
                                        {filters.max_frequency_value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <p className="px-4 py-2 rounded-lg">Habit Count: {habitsCount}</p>
                        <button
                            className="px-4 py-2 bg-gray-200/80 backdrop-blur rounded-lg hover:bg-gray-300 shadow"
                            onClick={async () => {
                                setFilters(initialFilters);     // keeps full structure
                                setIsFilterAction(false);
                                setDebouncedFilters(initialFilters); // immediate apply
                                setCurrentPage(1);
                            }}
                            disabled={JSON.stringify(filters) === JSON.stringify(initialFilters)}
                        >
                            Reset
                        </button>

                        <button
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                                               text-white rounded-lg shadow hover:opacity-90 transition"
                            onClick={async () => {
                                setDebouncedFilters(filters);   // Apply immediately (no debounce)
                                setIsFilterAction(false);
                                setCurrentPage(1);
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="flex justify-center items-center py-10 text-gray-600">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" />
                    Loading habits...
                </div>
            )}

            {/* EMPTY */}
            {!loading && habits.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No habits found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters</p>
                </div>
            )}

            {/* LIST */}
            {!loading && habits.length > 0 && (
                <div className="space-y-3">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="relative p-5 bg-white rounded-2xl border shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[1px] transition-all flex justify-between"
                            onClick={() => router.push(`/habit/${habit.id}`)}
                        >
                            {habit.categoryName && (
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-600 to-blue-500
                                text-white text-[10px] px-2 py-0.5 rounded-md shadow"
                                >
                                    {habit.categoryName}
                                </div>)
                            }
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{habit.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {habit.frequency_type === "daily"
                                        ? "Daily"
                                        : habit.frequency_type === "every_x_days"
                                            ? `Every ${habit.frequency_value} days`
                                            : `${habit.frequency_value}× / week`}
                                </p>

                                {habit.description && (
                                    <p className="text-sm text-gray-500 mt-2">{habit.description}</p>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2 text-sm">
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHabitId(habit.id);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:underline"
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

            {/* PAGINATION */}
            {paginationData.total > 0 && (
                <div className="mt-8">
                    <Pagination
                        paginationData={paginationData}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => {
                            setPaginationData(prev => ({ ...prev, itemsPerPage: size }));
                            setCurrentPage(1);
                        }}
                        contentType="Habit"
                    />
                </div>
            )}

            <AddHabitModal
                isOpen={isModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                }}
                habitId={isEditModalOpen ? habitId : undefined}
                onHabitCreated={() => {
                    fetchHabits(currentPage, paginationData.itemsPerPage, buildFilterParams(debouncedFilters))
                        .then((res) => {
                            if (res) {
                                setHabits(res.habits);
                                setPaginationData(res.pagination);
                            }
                        });
                }}
            />
        </div>
    );
}
