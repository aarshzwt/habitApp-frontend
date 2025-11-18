import { memo, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AddCategoryModal from "./AddCategoryModal";
import { Modal } from "../modal";
import { Button } from "../button";
import { CategoryType, HabitFormType, HabitModalPropsType } from "./types";
import { showSuccessToast } from "../toast";

const weekDays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const habitSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  frequency_type: yup
    .string()
    .oneOf(["daily", "x_times_per_week", "every_x_days"])
    .required("Frequency type is required"),
  frequency_value: yup
    .number()
    .when('frequency_type', (val, schema) => {
      if (val[0] === 'every_x_days' || val[0] === 'x_times_per_week') {
        return schema.required('This field is required for selected frequency').min(2, "atleast 2 days required");
      }
      return schema.notRequired();
    }),
  frequency_days: yup
    .array()
    .of(yup.string())
    .nullable()
    .when(['frequency_type', 'frequency_value'], ([type, value], schema) => {
      if (type === 'x_times_per_week' && typeof value === 'number' && value > 0) {
        return schema.test(
          'exact-length-or-null',
          `Select exactly ${value} day(s) or leave it empty`,
          function (val) {
            // Allow null or exact number of selected days
            return (Array.isArray(val) && (val.length === 0 || val.length === value));
          }
        );
      }
      return schema.notRequired();
    }),
  category_id: yup.number().nullable(),
  start_date: yup
    .string()
    .required("Start date is required")
    .test("not-in-past", "Start date cannot be in the past", (val) => {
      if (!val) return false;
      return new Date(val) >= new Date(new Date().toDateString());
    }),
  end_date: yup.string().nullable(),
});

function AddHabitModal({
  isOpen,
  onClose,
  onHabitCreated,
  templateId,
  habitId,
}: HabitModalPropsType) {
  const isEditMode = Boolean(habitId);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [initialValues, setInitialValues] = useState<HabitFormType>({
    title: "",
    description: "",
    frequency_type: "daily",
    frequency_value: 2,
    frequency_days: [],
    category_id: null,
    start_date: "",
    end_date: null,
    template: false,
    showDayPicker: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (habitId) fetchHabit(habitId);
    else if (templateId) fetchTemplate(templateId);
  }, [isOpen]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const res = await axiosInstance.get("/category");
      setCategories(res.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchTemplate(id: number) {
    try {
      const res = await axiosInstance.get(`/templates/${id}`);
      const data = res.template;
      setInitialValues({
        title: data.title || "",
        description: data.description || "",
        frequency_type: data.frequency_type || "daily",
        frequency_value: data.frequency_value || 2,
        frequency_days: data.frequency_days || [],
        category_id: data.category_id || null,
        start_date: data.start_date || "",
        end_date: data.end_date || null,
        template: false,
        showDayPicker: false
      });
    } catch (err) {
      console.error("Error fetching template:", err);
    }
  }

  async function fetchHabit(id: number) {
    try {
      const res = await axiosInstance.get(`/habit/${id}`);
      const data = res.habit;
      setInitialValues({
        title: data.title || "",
        description: data.description || "",
        frequency_type: data.frequency_type || "daily",
        frequency_value: data.frequency_value || null,
        frequency_days: data.frequency_days || [],
        category_id: data.category_id || null,
        start_date: data.start_date || "",
        end_date: data.end_date || null,
        template: data.template || false,
        showDayPicker: false,
      });
    } catch (err) {
      console.error("Error fetching habit:", err);
    }
  }

  const handleCategoryAdded = async (newCategory: CategoryType) => {
    await getCategories();
    setInitialValues((prev) => ({ ...prev, category_id: newCategory.id }));
    setShowModal(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Habit" : "Add New Habit"}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={habitSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            if (habitId)
              await axiosInstance.post(`/habit/${habitId}`, values);
            else await axiosInstance.post("/habit/", values);

            showSuccessToast(
              `Habit ${isEditMode ? "Updated" : "Created"} successfully!`
            );
            if (onHabitCreated) onHabitCreated();
            resetForm();
            onClose();
          } catch (err) {
            console.error("Error submitting:", err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            {/* Title */}
            <Field
              name="title"
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="title"
              component="p"
              className="text-red-500 text-sm"
            />

            {/* Description */}
            <Field
              as="textarea"
              name="description"
              placeholder="Description (optional)"
              className="w-full p-2 border border-gray-300 rounded"
            />

            {/* Frequency Type */}
            <div>
              <select
                name="frequency_type"
                value={values.frequency_type}
                onChange={(e) => {
                  const val = e.target.value;
                  setFieldValue("frequency_type", val);
                  if (val !== "x_times_per_week") {
                    setFieldValue("showDayPicker", false);
                    setFieldValue("frequency_days", []);
                  }
                }}
                disabled={isEditMode}
                className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="daily">Daily</option>
                <option value="x_times_per_week">X times per week</option>
                <option value="every_x_days">Every X days</option>
              </select>
              {errors.frequency_type && touched.frequency_type && (
                <p className="text-red-500 text-sm">{errors.frequency_type}</p>
              )}
            </div>

            {/* x_times_per_week section */}
            {values.frequency_type === "x_times_per_week" && (
              <>
                <div className="flex gap-8 mt-2">
                  <div>
                    <input
                      type="number"
                      name="frequency_value"
                      min={1}
                      value={values.frequency_value || 2}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFieldValue("frequency_value", val);
                        // Reset selected days if too many
                        if ((values.frequency_days?.length || 0) > val) {
                          setFieldValue("frequency_days", []);
                        }
                      }}
                      className="p-2 border border-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="How many times per week?"
                      disabled={isEditMode}
                    />
                    {errors.frequency_value && touched.frequency_value && (
                      <p className="text-red-500 text-sm">{errors.frequency_value}</p>
                    )}
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={values.showDayPicker || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("showDayPicker", checked);
                        if (!checked) {
                          setFieldValue("frequency_days", []);
                        }
                      }}
                      disabled={
                        isEditMode && values.frequency_type !== "x_times_per_week"
                      }
                    />
                    Any specific days in mind?
                  </label>
                </div>

                {/* Day picker */}
                {values.showDayPicker && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">
                      Choose up to {values.frequency_value || 2} day(s):
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weekDays.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            const current = values.frequency_days || [];
                            if (current.includes(day.value)) {
                              setFieldValue(
                                "frequency_days",
                                current.filter((d) => d !== day.value)
                              );
                            } else if (current.length < (values.frequency_value || 2)) {
                              setFieldValue("frequency_days", [...current, day.value]);
                            }
                          }}
                          className={`px-3 py-1 border rounded ${values.frequency_days?.includes(day.value)
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                            }`}
                          disabled={
                            isEditMode &&
                            values.frequency_type !== "x_times_per_week"
                          }
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {errors.frequency_days && touched.frequency_days && (
                      <p className="text-red-500 text-sm">{errors.frequency_days}</p>
                    )}
                  </>
                )}
              </>
            )}

            {/* every_x_days section */}
            {values.frequency_type === "every_x_days" && (
              <>
                <input
                  type="number"
                  name="frequency_value"
                  min={1}
                  max={30}
                  value={values.frequency_value || 2}
                  onChange={(e) =>
                    setFieldValue("frequency_value", Number(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  placeholder="Every how many days?"
                />
                {errors.frequency_value && touched.frequency_value && (
                  <p className="text-red-500 text-sm">{errors.frequency_value}</p>
                )}
              </>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                type="date"
                name="start_date"
                className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-500"
                disabled={isEditMode}
              />
              <Field
                type="date"
                name="end_date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <ErrorMessage
              name="start_date"
              component="p"
              className="text-red-500 text-sm"
            />

            {/* Category */}
            <Field
              as="select"
              name="category_id"
              onChange={(e: any) => {
                const value = Number(e.target.value);
                if (value === 0) setShowModal(true);
                else setFieldValue("category_id", value);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="0">➕ Add a category</option>
            </Field>

            {/* Template checkbox */}
            {!templateId && (
              <label className="flex items-center gap-2 mt-2">
                <Field type="checkbox" name="template" />
                Make it a Public Template?
              </label>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditMode ? "Edit" : "Create"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onCategoryCreated={handleCategoryAdded}
        />
      )}
    </Modal>
  );
}

export default memo(AddHabitModal);
