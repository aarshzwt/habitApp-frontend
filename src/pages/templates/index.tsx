import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { generateShapesSVG } from "@/utils";
import { paginationDataType, TemplatesType } from "@/components/types";
import AddHabitModal from "@/components/Models/AddHabitModal";
import { Pagination } from "@/components/pagination";
import SelectField from "@/components/SelectField";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/categoryHooks";

export default function TemplateList() {
    const [templates, setTemplates] = useState<TemplatesType[]>([]);
    const [habitModalOpen, setHabitModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1)
    const [templateCount, setTemplateCount] = useState(0);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isFilterAction, setIsFilterAction] = useState(false);
    const [loading, setLoading] = useState(false)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 16,
        total: 0,
    });
    const { options: categories, isLoading: categoriesLoading } = useCategories(); // SWR hook to fetch categories

    const initialFilters = {
        category_id: "",
        frequency_type: "",
        search: "",
        min_frequency_value: 0,
        max_frequency_value: 3,
    };
    const [filters, setFilters] = useState(initialFilters);
    const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);

    const buildFilterParams = (filters: typeof initialFilters) => {
        const clean: any = {
            ...(filters.category_id) && { category_id: filters.category_id },
            ...(filters.frequency_type) && { frequency_type: filters.frequency_type },
            ...(filters.search) && { search: filters.search },
        };

        if (["every_x_days", "x_times_per_week"].includes(filters.frequency_type)) {
            clean.min_frequency_value = filters.min_frequency_value;
            clean.max_frequency_value = filters.max_frequency_value;
        }

        return clean;
    };

    const fetchTemplates = async (page: number = 1, limit: number = 16, filters: any = null) => {
        try {
            const res = await axiosInstance.get(`/templates`, {
                params: {
                    page,
                    limit,
                    ...(filters && filters),
                },
            });

            setTemplateCount(res.pagination.total || 0);
            return res;

        } catch { }
    };

    useEffect(() => {
        async function loadList() {
            try {
                if (!hasLoaded || !isFilterAction) setLoading(true);
                const res = await fetchTemplates(
                    currentPage,
                    paginationData.itemsPerPage,
                    buildFilterParams(debouncedFilters)
                );

                if (isFilterAction || !res) return;  // DON’T LOAD LIST ON FILTER TYPING

                setTemplates(res.templates);
                setPaginationData(res.pagination);
                setHasLoaded(true);
            } catch {

            } finally {
                setLoading(false);
            }
        }

        loadList();
    }, [currentPage, paginationData.itemsPerPage, debouncedFilters, isFilterAction]);

    // Single debounce storage for all fields
    const debounceTimers = useRef<{ [key: string]: any }>({});

    const handleDebouncedFilterChange = (field: string, value: string, delay = 400) => {
        // update UI immediately
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

            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Habit Templates
                </h1>

                <button
                    onClick={() => setShowFilters(prev => !prev)}
                    className="px-5 py-2 bg-white/70 backdrop-blur border border-gray-200 
                           rounded-xl shadow hover:bg-white hover:shadow-md transition duration-500
                           text-sm font-medium"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* Filters Panel */}
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
                        <p className="px-4 py-2 rounded-lg">Template Count: {templateCount}</p>
                        <button
                            className="px-4 py-2 bg-gray-200/80 backdrop-blur rounded-lg 
                                   hover:bg-gray-300 shadow"
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

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-16 text-gray-500">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" />
                    <span>Loading challenges...</span>
                </div>
            )}

            {/* Empty */}
            {!loading && templates.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No challenges found.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting filters.</p>
                </div>
            )}

            {!loading && templates.length > 0 && (
                <>
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {templates.map((t) => {
                            const imgSrc =
                                t.categoryImage && t.categoryImage !== "/placeholder.jpg"
                                    ? t.categoryImage
                                    : generateShapesSVG(300, t.id);

                            const frequencyLabel =
                                t.frequency_type === "daily"
                                    ? "Daily"
                                    : t.frequency_type === "every_x_days"
                                        ? `Every ${t.frequency_value} days`
                                        : t.frequency_days
                                            ? `On: ${t.frequency_days.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}`
                                            : `${t.frequency_value} times/week`;

                            return (
                                <div
                                    key={t.id}
                                    className="rounded-2xl shadow-lg overflow-hidden group 
                                   bg-white/70 backdrop-blur border border-white/30
                                   hover:shadow-xl hover:scale-[1.02] transition"
                                >
                                    <div className="relative">
                                        <img src={imgSrc} className="w-full h-44 object-cover" />
                                        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                            {t.categoryName || "Uncategorized"}
                                        </span>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        <h2 className="font-semibold text-lg text-gray-900">{t.title}</h2>
                                        <p className="text-sm text-gray-600 line-clamp-3">{t.description}</p>

                                        <p className="text-sm text-indigo-700 font-medium">{frequencyLabel}</p>

                                        <button
                                            className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg 
                                           shadow hover:bg-blue-700 transition opacity-0 
                                           group-hover:opacity-100"
                                            onClick={() => {
                                                setSelectedTemplateId(t.id);
                                                setHabitModalOpen(true);
                                            }}
                                        >
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {paginationData.total > 0 && (
                        <div className="mt-10">
                            <Pagination
                                paginationData={paginationData}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={(size) => {
                                    setPaginationData((prev) => ({ ...prev, itemsPerPage: size }));
                                    setCurrentPage(1);
                                }}
                                contentType="Habit"
                            />
                        </div>
                    )}
                </>
            )}

            {habitModalOpen && (
                <AddHabitModal
                    isOpen={habitModalOpen}
                    onClose={() => setHabitModalOpen(false)}
                    templateId={selectedTemplateId}
                />
            )}
        </div>
    );
}
