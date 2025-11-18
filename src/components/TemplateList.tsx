import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import AddHabitModal from "./Models/AddHabitModal";
import { TemplatesType } from "./types";
import { generateShapesSVG } from "@/utils";

export default function TemplateList() {

    const [templates, setTemplates] = useState<TemplatesType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [habitModalOpen, setHabitModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>();
    const limit = 6;

    const fetchTemplates = async () => {
        try {
            const res = await axiosInstance.get(`/templates`, {
                params: { limit, offset }
            });
            if (res.total < limit) setHasMore(false);
            setTemplates(res.templates);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchTemplates();
    }, [offset]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Habit Templates</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setOffset((prev) => prev + limit)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Show More
                    </button>
                </div>
            )}
            {habitModalOpen &&
                <AddHabitModal
                    isOpen={habitModalOpen}
                    onClose={() => setHabitModalOpen(false)}
                    templateId={selectedTemplateId}
                // onHabitCreated={fetchHabits}
                />}
        </div>
    );
}
