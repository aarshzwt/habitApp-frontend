import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import AddHabitModal from "./Models/AddHabitModal";
import { TemplatesType } from "./types";
import { generateShapesSVG } from "@/utils";
import { useRouter } from "next/router";

export default function TemplateList() {
    const [templates, setTemplates] = useState<TemplatesType[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [habitModalOpen, setHabitModalOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>();
    const [limit, setLimit] = useState(1);

    const router = useRouter();

    const fetchTemplates = async () => {
        try {
            const res = await axiosInstance.get(`/templates`, {
                params: { limit, offset }
            });
            if (res.pagination.total <= limit) setHasMore(false);
            setTemplates(res.templates);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchTemplates(); }, [offset]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Habit Templates
                </h1>
                <button
                    onClick={() => router.push("/templates")}
                    className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition"
                >
                    Explore More →
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {templates.map((t) => {
                    const imgSrc = t.categoryImage && t.categoryImage !== "/placeholder.jpg"
                        ? t.categoryImage
                        : generateShapesSVG(300, t.id);

                    const frequencyDaysLabel = Array.isArray(t.frequency_days)
                        ? t.frequency_days.map((d) => dayNames[d]).join(", ")
                        : null;

                    let frequencyLabel = "";
                    if (t.frequency_type === "daily") frequencyLabel = "Daily";
                    else if (t.frequency_type === "x_times_per_week")
                        frequencyLabel = frequencyDaysLabel
                            ? `On: ${frequencyDaysLabel}`
                            : `${t.frequency_value} times/week`;
                    else if (t.frequency_type === "every_x_days")
                        frequencyLabel = `Every ${t.frequency_value} days`;

                    return (
                        <div
                            key={t.id}
                            className="rounded-2xl shadow-lg overflow-hidden group 
                                       bg-white/80 backdrop-blur border border-white/30
                                       hover:shadow-xl hover:scale-[1.02] transition duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={imgSrc}
                                    className="w-full h-44 object-cover"
                                />

                                <span className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs 
                                                 bg-black/60 text-white">
                                    {t.categoryName || "Uncategorized"}
                                </span>
                            </div>

                            <div className="p-4 space-y-2">
                                <h2 className="font-semibold text-lg text-gray-900 leading-snug">
                                    {t.title}
                                </h2>

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {t.description || "No description available."}
                                </p>

                                <p className="text-sm text-indigo-700 font-medium">
                                    {frequencyLabel}
                                </p>

                                <button
                                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg 
                                               shadow hover:bg-blue-700 cursor-pointer transition 
                                               opacity-0 group-hover:opacity-100"
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

            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setOffset(prev => prev + limit);
                            setLimit(prev => prev + limit);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                                   text-white rounded-lg shadow hover:opacity-90 transition"
                    >
                        Show More
                    </button>
                </div>
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
