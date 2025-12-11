'use client'

import { useEffect, useRef, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { Pagination } from "@/components/pagination"
import { ChallengeCard } from "@/components/challenges/challengeCard"
import { Loader2, Search } from "lucide-react"
import { paginationDataType } from "@/components/types"
import { Challenge, challengeApiResponse } from "../../types/types"
import CreateChallengeModal from "@/components/Models/CreateChallengeModal"
import SelectField from "@/components/SelectField"
import { useCategories } from "@/hooks/categoryHooks"
import { JoinChallengeModal } from "@/components/Models/JoinChallengeModal"
import { LeaveChallengeModal } from "@/components/Models/LeaveChallengeModal"
import { showSuccessToast } from "@/components/toast"

export default function ChallengesPage() {

    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 6,
        total: 0,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [challengeCount, setChallengeCount] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [isFilterAction, setIsFilterAction] = useState(false);

    const initialFilters = {
        search: "",
        category_id: "",
        min_duration_value: "",
        max_duration_value: "",
    }

    const [filters, setFilters] = useState(initialFilters)
    const [debouncedFilters, setDebouncedFilters] = useState(initialFilters)
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [challengeData, setChallengeData] = useState<{ challengeId: number, duration?: number } | null>(null);
    const [reload, setReload] = useState(false);

    const { options: categories, isLoading: categoriesLoading } = useCategories(); // hook to fetch categories

    const buildFilterParams = (filters: typeof initialFilters) => {
        const clean: any = {
            ...(filters.search && { search: filters.search }),
            ...(filters.category_id && { category_id: filters.category_id }),
        }

        if (filters.min_duration_value) clean.min_duration_value = filters.min_duration_value
        if (filters.max_duration_value) clean.max_duration_value = filters.max_duration_value

        return clean
    }

    // async function getCategories() {
    //     try {
    //         const res = await axiosInstance.get("/category");
    //         const categories = res.categories?.map((c: CategoryType) => ({
    //             value: c.id,
    //             label: c.name,
    //         }));

    //         setCategories(categories || []);
    //     } catch (err) {
    //         console.error("Error fetching categories:", err);
    //     }
    // }

    const handleJoin = async (startDate: string) => {
        if (!challengeData) return;
        try {
            await axiosInstance.post(`/challenges/join/${challengeData.challengeId}`, {
                duration: challengeData.duration,
                start_date: startDate,
            });

            setActiveModal(null);
            showSuccessToast('Joined challenge 🎉')
            setReload(prev => !prev);
        } catch { }
    };

    const handleLeave = async () => {
        if (!challengeData) return;
        try {
            await axiosInstance.delete(`/challenges/leave/${challengeData.challengeId}`);

            setActiveModal(null);
            showSuccessToast('Left challenge 👋')
            setReload(prev => !prev);
        } catch { }
    };

    const fetchChallenges = async (page = 1, limit = 6, filters: any = null) => {
        try {
            const res = await axiosInstance.get<challengeApiResponse>("/challenges", {
                params: {
                    page,
                    limit,
                    ...(filters && filters)
                },
            })

            setChallengeCount(res.pagination.total)
            return res
        } catch {
        }
    }
    // useEffect(() => {
    //     getCategories();
    // }, []);

    useEffect(() => {
        async function loadList() {
            try {
                if (!hasLoaded || !isFilterAction) setLoading(true);
                const res = await fetchChallenges(
                    currentPage,
                    paginationData.itemsPerPage,
                    buildFilterParams(debouncedFilters)
                );

                if (!res) return; // bail out if fetch failed or returned null
                if (isFilterAction) return;  // DON’T LOAD LIST ON FILTER TYPING

                setChallenges(res.challenges);
                setPaginationData(res.pagination);
                setHasLoaded(true);
            } catch {

            } finally {
                setLoading(false);
            }
        }

        loadList();
    }, [currentPage, paginationData.itemsPerPage, debouncedFilters, isFilterAction, reload]);


    // Single debounce storage for all fields
    const debounceTimers = useRef<{ [key: string]: any }>({});

    const handleDebouncedFilterChange = (field: string, value: string, delay = 400) => {
        // update UI immediately
        console.log("going to call")
        setFilters(prev => ({ ...prev, [field]: value }));
        setIsFilterAction(true);

        // Clear previous timer for THIS field
        if (debounceTimers.current[field]) {
            clearTimeout(debounceTimers.current[field]);
        }

        // Start new timer
        debounceTimers.current[field] = setTimeout(() => {
            setDebouncedFilters(prev => ({ ...prev, [field]: value }));
        }, delay);
    };

    return (
        <div className="container p-6 max-w-6xl mx-auto">

            {/* Title + Create Button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Challenges
                </h1>
                <div className="flex items-center gap-4">
                    <button className="px-5 py-2 border border-gray-200 
                           rounded-xl shadow hover:bg-white hover:shadow-md transition
                           text-sm font-medium" onClick={() => setIsCreateOpen(true)}>
                        Create Challenge
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

            {/* Filters Panel */}
            {showFilters && (
                <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow mb-10">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Search */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Search</label>
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                className="border px-4 py-2.5 rounded-lg w-full bg-white/70"
                                value={filters.search}
                                onChange={(e) => handleDebouncedFilterChange("search", e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Category</label>

                            <div className="[&>*]:!bg-white/70 [&>*]:!border-gray-300 [&>*]:backdrop-blur">
                                <SelectField
                                    options={categories}
                                    value={
                                        categories.find((opt: any) => opt.value === filters.category_id) ||
                                        null
                                    }
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

                        {/* Min Duration */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Min Duration</label>
                            <input
                                name="min_duration_value"
                                type="number"
                                className="border px-4 py-2.5 rounded-lg w-full bg-white/70"
                                value={filters.min_duration_value}
                                onChange={(e) => handleDebouncedFilterChange("min_duration_value", e.target.value)}
                                placeholder="Min days"
                            />
                        </div>

                        {/* Max Duration */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Max Duration</label>
                            <input
                                name="max_duration_value"
                                type="number"
                                className="border px-4 py-2.5 rounded-lg w-full bg-white/70"
                                value={filters.max_duration_value}
                                onChange={(e) => handleDebouncedFilterChange("max_duration_value", e.target.value)}
                                placeholder="Max days"
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <p className="px-4 py-2 rounded-lg">Total Challenges: {challengeCount}</p>

                        <div className="flex gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200/80 rounded-lg hover:bg-gray-300"
                                onClick={() => {
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
                                onClick={() => {
                                    setDebouncedFilters(filters);   // Apply immediately (no debounce)
                                    setIsFilterAction(false);
                                    setCurrentPage(1);
                                }}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-16 text-gray-500">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" />
                    <span>Loading challenges...</span>
                </div>
            )}

            {/* Empty */}
            {!loading && challenges.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No challenges found.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting filters.</p>
                </div>
            )}

            {/* Cards Grid */}
            {!loading && challenges.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {challenges.map((ch) => (
                            <ChallengeCard
                                key={ch.id}
                                challenge={ch}
                                joined={ch.joined!}
                                openJoinModal={(data: { challengeId: number, duration: number }) => { setActiveModal("join"); setChallengeData(data); }}
                                openLeaveModal={(data: { challengeId: number }) => { setActiveModal("leave"); setChallengeData(data); }}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center">
                        <Pagination
                            paginationData={paginationData}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPaginationData((prev) => ({ ...prev, itemsPerPage: size }))
                                setCurrentPage(1)
                            }}
                            contentType="Challenges"
                        />
                    </div>
                </>
            )}
            {activeModal === "join" && challengeData?.duration && (
                <JoinChallengeModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    duration={challengeData.duration}
                    onConfirm={handleJoin}
                />
            )}

            {activeModal === "leave" && (
                <LeaveChallengeModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleLeave}
                />
            )}
            {isCreateOpen && (
                <CreateChallengeModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={() => setHasLoaded(false)}
                />
            )}
        </div>
    )
}
