import axiosInstance from "@/utils/axiosInstance";
import React, { useState } from "react";

interface AddCategoryModalPropTypes {
    onCategoryCreated: (category: categoryType) => void;
    onClose: () => void;
}
interface categoryType {
    id: number;
    name: string;
}
export default function AddCategoryModal({ onClose, onCategoryCreated }: AddCategoryModalPropTypes) {
    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target;
        if (name === "categoryImg") {
            setFormData((prev) => ({ ...prev, image: files[0] || null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Prepare form data for file upload
            const data = new FormData();
            data.append("name", formData.name);
            if (formData.image) {
                data.append("categoryImg", formData.image);
            }

            const res = await axiosInstance.post("/category", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(res)

            onCategoryCreated(res.category); // send to parent
            onClose();
        } catch (err) {
            console.error("Error creating category:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Category Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />

                    <input
                        name="categoryImg"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
