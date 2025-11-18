'use client'

import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { Modal } from "../modal"
import { Button } from "../button"
import { CategoryType, ChallengeFormType } from "./types"
import AddCategoryModal from "./AddCategoryModal"
import { showErrorToast, showSuccessToast } from "../toast"

interface Props {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function CreateChallengeModal({ isOpen, onClose, onSuccess }: Props) {
    const [form, setForm] = useState<ChallengeFormType>({
        title: "",
        description: "",
        duration_days: "",
        category_id: null
    })
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        try {
            const res = await axiosInstance.get("/category");
            setCategories(res.categories || [])
        } catch (err) {
            console.error("Error fetching categories:", err)
        }
    }
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        if (value === 0) {
            // Reset select and open modal
            setForm(prev => ({ ...prev, category_id: "" }));
            setIsCategoryModalOpen(true);
        } else {
            setForm(prev => ({ ...prev, category_id: value }));
        }
    };


    const handleCategoryAdded = async (newCategory: CategoryType) => {
        await getCategories();
        // setCategories(prev => [...prev, newCategory]);
        setForm(prev => ({ ...prev, category_id: newCategory.id }));
        setIsCategoryModalOpen(false);
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await axiosInstance.post("/challenges/create", {
                title: form.title,
                description: form.description,
                duration_days: form.duration_days,
                category_id: form.category_id || undefined
            })

            showSuccessToast("Challenge created successfully")
            onClose()
            onSuccess?.()
        } catch {
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Challenge"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </>
            }
        >
            <div className="space-y-5">

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter challenge title"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Describe the challenge (optional)"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
                    <input
                        type="number"
                        name="duration_days"
                        value={form.duration_days}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g., 21"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Category ID (optional)</label>
                    <select
                        name="category_id"
                        value={form.category_id || ""}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">No Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="0">➕ Add a category</option>
                    </select>
                </div>

            </div>
            {isCategoryModalOpen && (
                <AddCategoryModal
                    onClose={() => setIsCategoryModalOpen(false)}
                    onCategoryCreated={handleCategoryAdded}
                />
            )}
        </Modal>

    )
}
