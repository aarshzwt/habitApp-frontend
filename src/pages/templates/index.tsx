import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { generateShapesSVG } from "@/utils";
import { paginationDataType, TemplatesType } from "@/components/types";
import AddHabitModal from "@/components/Models/AddHabitModal";
import { Pagination } from "@/components/pagination";
import { CategoryType } from "@/components/Models/types";
import SelectField from "@/components/SelectField";

export default function TemplateList() {
    const [templates, setTemplates] = useState<TemplatesType[]>([]);
    const [habitModalOpen, setHabitModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>();
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    });

    const initialFilters = {
        category_id: "",
        frequency_type: "",
        search: "",
        min_frequency_value: 0,
        max_frequency_value: 3,
    };

    const buildFilterParams = (filters: typeof initialFilters) => {
        const clean: any = {
            category_id: filters.category_id,
            frequency_type: filters.frequency_type,
            search: filters.search,
        };

        if (["every_x_days", "x_times_per_week"].includes(filters.frequency_type)) {
            clean.min_frequency_value = filters.min_frequency_value;
            clean.max_frequency_value = filters.max_frequency_value;
        }

        return clean;
    };

    const [filters, setFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    async function getCategories() {
        try {
            const res = await axiosInstance.get("/category");
            const categories = res.categories?.map((c: CategoryType) => ({
                value: c.id,
                label: c.name,
            }));

            setCategories(categories || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    }

    const fetchTemplates = async (page: number = 1, limit: number = 5, filters: any = null) => {
        console.log(filters)
        try {
            const res = await axiosInstance.get(`/templates`, {
                params: {
                    page,
                    limit,
                    ...(filters && filters),
                },
            });

            setTemplates(res.templates);
            setPaginationData(res.pagination);

        } catch (err) { }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        fetchTemplates(currentPage, paginationData.itemsPerPage);
    }, [currentPage, paginationData.itemsPerPage]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">

            {/* Header */}
            <div className="flex justify-between mb-8 items-center">
                <h1 className="text-4xl font-bold tracking-tight">Habit Templates</h1>

                <button
                    onClick={() => setShowFilters(prev => !prev)}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl shadow hover:bg-gray-700 transition"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="p-6 border rounded-2xl shadow bg-white mb-10 space-y-5">

                    {/* SEARCH */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Search</label>
                        <input
                            type="text"
                            placeholder="Search habits..."
                            className="border px-4 py-2.5 rounded-lg w-full focus:ring-2 focus:ring-black/20 focus:outline-none"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                search: e.target.value
                            }))}
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Category</label>
                        <SelectField
                            // className="border px-4 py-2.5 rounded-lg w-full focus:ring-2 focus:ring-black/20"
                            options={categories}
                            value={categories.find((opt: any) => opt.value === filters.category_id) || null}
                            onChange={(selected) => {
                                setFilters(prev => ({
                                    ...prev,
                                    category_id: selected?.value || ""
                                }));
                            }}
                            placeholder="Select category"
                        />
                    </div>

                    {/* FREQUENCY TYPE */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Frequency Type</label>
                        <select
                            className="border px-4 py-2.5 rounded-lg w-full focus:ring-2 focus:ring-black/20"
                            value={filters.frequency_type}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                frequency_type: e.target.value,
                            }))}
                        >
                            <option value="">Any Frequency</option>
                            <option value="daily">Daily</option>
                            <option value="every_x_days">Every X Days</option>
                            <option value="x_times_per_week">X Times Per Week</option>
                        </select>
                    </div>

                    {/* RANGE SLIDERS */}
                    {["every_x_days", "x_times_per_week"].includes(filters.frequency_type) && (
                        <div className="p-4 rounded-xl border bg-gray-50 space-y-3">
                            <label className="text-sm font-semibold">Frequency Range</label>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="6"
                                        value={filters.min_frequency_value}
                                        className="w-32"
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                min_frequency_value: Number(e.target.value),
                                            }))
                                        }
                                    />
                                    <span className="font-medium">{filters.min_frequency_value}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="6"
                                        value={filters.max_frequency_value}
                                        className="w-32"
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                max_frequency_value: Number(e.target.value),
                                            }))
                                        }
                                    />
                                    <span className="font-medium">{filters.max_frequency_value}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            className="px-4 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            onClick={() => {
                                setFilters(initialFilters);
                                setCurrentPage(1);
                                fetchTemplates(1, paginationData.itemsPerPage, buildFilterParams(initialFilters));
                            }}
                            disabled={JSON.stringify(filters) === JSON.stringify(initialFilters)}
                        >
                            Reset
                        </button>

                        <button
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            onClick={() => {
                                fetchTemplates(1, paginationData.itemsPerPage, buildFilterParams(filters));
                                setCurrentPage(1);
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Template Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {templates.map((t) => {
                    const categoryName = t.categoryName || "Uncategorized";

                    const imgSrc =
                        t.categoryImage && t.categoryImage !== "/placeholder.jpg"
                            ? t.categoryImage
                            : generateShapesSVG(300, t.id);

                    // Convert frequency_days → Weekday names
                    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    const frequencyDaysLabel = Array.isArray(t.frequency_days)
                        ? t.frequency_days.map((d) => dayNames[d]).join(", ")
                        : null;

                    // Build frequency label
                    let frequencyLabel = "";
                    if (t.frequency_type === "daily") {
                        frequencyLabel = "Daily";
                    }
                    else if (t.frequency_type === "x_times_per_week") {
                        if (frequencyDaysLabel) {
                            frequencyLabel = `On: ${frequencyDaysLabel}`;
                        } else {
                            frequencyLabel = `${t.frequency_value} times / week`;
                        }
                    }
                    else if (t.frequency_type === "every_x_days") {
                        frequencyLabel = `Every ${t.frequency_value} days`;
                    }

                    return (
                        <div
                            key={t.id}
                            className="bg-white rounded-2xl overflow-hidden shadow group hover:shadow-xl transition duration-300 hover:scale-[1.02] cursor-pointer"
                        >
                            <div className="relative">
                                <img
                                    src={imgSrc}
                                    alt={categoryName}
                                    className="w-full h-44 object-cover"
                                />

                                <span
                                    className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-lg ${t.categoryName ? "bg-black/70" : "bg-gray-400/70"
                                        }`}
                                >
                                    {categoryName}
                                </span>
                            </div>

                            <div className="p-4 space-y-2">
                                <h2 className="font-semibold text-lg leading-tight">{t.title}</h2>

                                <p className="text-sm text-gray-800 line-clamp-3">
                                    {t.description || "No description available."}
                                </p>

                                {/* Frequency */}
                                <p className="text-sm text-gray-600 mt-1">{frequencyLabel}</p>

                                <button
                                    className="w-full mt-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
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
                            setPaginationData((prev) => ({ ...prev, itemsPerPage: size }))
                            setCurrentPage(1)
                        }}
                        contentType="Habit"
                    />
                </div>
            )}

            {/* Modal */}
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
