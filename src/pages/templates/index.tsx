import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { generateShapesSVG } from "@/utils";
import { paginationDataType, TemplatesType } from "@/components/types";
import AddHabitModal from "@/components/Models/AddHabitModal";
import { Pagination } from "@/components/pagination";

export default function TemplateList() {
    const [templates, setTemplates] = useState<TemplatesType[]>([]);
    const [habitModalOpen, setHabitModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>();

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
        fetchTemplates(currentPage, paginationData.itemsPerPage);
    }, [currentPage, paginationData.itemsPerPage]);

    return (
        <div className="container">
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex justify-between mb-6 items-center">
                    <h1 className="text-3xl font-bold">Habit Templates</h1>

                    <button
                        onClick={() => setShowFilters(prev => !prev)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700"
                    >
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="p-5 border rounded-lg shadow bg-white mb-6 space-y-4">

                        {/* SEARCH */}
                        <input
                            type="text"
                            placeholder="Search habits..."
                            className="border px-3 py-2 rounded w-full"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                search: e.target.value
                            }))}
                        />

                        {/* CATEGORY */}
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={filters.category_id}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                category_id: e.target.value
                            }))}
                        >
                            <option value="">All Categories</option>
                            <option value="1">Health</option>
                            <option value="2">Work</option>
                            <option value="3">Study</option>
                        </select>

                        {/* FREQUENCY TYPE */}
                        <select
                            className="border px-3 py-2 rounded w-full"
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

                        {/* RANGE SLIDERS */}
                        {["every_x_days", "x_times_per_week"].includes(filters.frequency_type) && (
                            <div className="flex flex-col gap-2 p-3 border rounded shadow-sm bg-gray-50">
                                <label className="text-sm font-semibold">Set Frequency Range</label>

                                <div className="flex items-center gap-4">
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
                                    <span>{filters.min_frequency_value}</span>

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
                                    <span>{filters.max_frequency_value}</span>
                                </div>
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => {
                                    setFilters(initialFilters);
                                    setCurrentPage(1);
                                    const filterParams = buildFilterParams(initialFilters);
                                    fetchTemplates(1, paginationData.itemsPerPage, filterParams);
                                }}

                                disabled={JSON.stringify(filters) === JSON.stringify(initialFilters)}
                            >
                                Reset
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
                                onClick={() => {
                                    const filterParams = buildFilterParams(filters);
                                    fetchTemplates(1, paginationData.itemsPerPage, filterParams);
                                    setCurrentPage(1);
                                    // setShowFilters(false);
                                }}

                            >
                                Search
                            </button>
                        </div>
                    </div>
                )}

                <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {templates.map((t) => {
                        const imgSrc =
                            t.categoryImage && t.categoryImage !== "/placeholder.jpg"
                                ? t.categoryImage
                                : generateShapesSVG(300, t.id);

                        return (
                            <div
                                key={t.id}
                                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                                onClick={() => { setSelectedTemplateId(t.id); setHabitModalOpen(true) }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={t.categoryName}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="font-semibold text-lg">{t.title}</h2>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {t.categoryName || "Uncategorized"}
                                    </p>
                                    <p className="text-gray-700 text-sm line-clamp-3">
                                        {t.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

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
                {habitModalOpen &&
                    <AddHabitModal
                        isOpen={habitModalOpen}
                        onClose={() => setHabitModalOpen(false)}
                        templateId={selectedTemplateId}
                    />}
            </div>
        </div>
    );
}
