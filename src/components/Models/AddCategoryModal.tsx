import axiosInstance from "@/utils/axiosInstance";
import React, { useState } from "react";
import { AddCategoryModalPropTypes } from "./types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
    name: Yup.string()
        .required("Category name is required")
        .max(50, "Max 50 characters"),

    image: Yup.mixed()
        .nullable()
        .test("fileSize", "Image must be less than 2MB", (value: any) => {
            if (!value) return true;
            return value.size <= 2 * 1024 * 1024;
        })
        .test("fileType", "Only JPG/PNG allowed", (value: any) => {
            if (!value) return true;
            return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
        }),
});


export default function AddCategoryModal({ onClose, onCategoryCreated }: AddCategoryModalPropTypes) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFiles = (files: FileList | null, setFieldValue: any) => {

        if (files && files[0]) {
            const file = files[0];
            setPreview(URL.createObjectURL(file));
            setFieldValue('image', file)
        } else {
            setPreview(null);
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Category</h2>

                <Formik
                    initialValues={{ name: "", image: null }}
                    validationSchema={schema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const data = new FormData();
                            data.append("name", values.name);
                            if (values.image) data.append("categoryImg", values.image);

                            const res = await axiosInstance.post("/category", data, {
                                headers: { "Content-Type": "multipart/form-data" },
                            });

                            onCategoryCreated(res.category);
                            onClose();
                        } catch (err) {
                            console.error("Error creating category:", err);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <Field
                                    name="name"
                                    placeholder="Category Name"
                                    className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => handleFiles(e.target.files, setFieldValue)}
                                // onChange={(e) => {

                                // }}
                                />
                                <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-1" />

                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-3 w-20 h-20 object-cover rounded-lg border"
                                    />
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
