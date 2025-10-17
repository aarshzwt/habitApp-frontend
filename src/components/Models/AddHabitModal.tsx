import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import * as yup from 'yup';
import AddCategoryModal from "./AddCategoryModal";

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

  end_date: yup
    .string()
    .nullable()
  // .nullable()
  // .required("End date is required")
  // .test("valid-date", "Invalid end date", (val) => {
  //   if (!val) return false;
  //   return !isNaN(Date.parse(val));
  // }),
});

const habitUpdateSchema = yup.object().shape({
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
    .when(['showDayPicker', 'frequency_type', 'frequency_value'],
      ([showDayPicker, type, value], schema) => {
        if (type === 'x_times_per_week' && showDayPicker === true && typeof value === 'number' && value > 0) {
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
    .required("Start date is required"),

  end_date: yup
    .string()
    .nullable()
  // .nullable()
  // .required("End date is required")
  // .test("valid-date", "Invalid end date", (val) => {
  //   if (!val) return false;
  //   return !isNaN(Date.parse(val));
  // }),
});

const weekDays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

interface ModalPropsType {
  isOpen: boolean,
  onClose: () => void,
  onHabitCreated?: () => void,
  prefillId?: number; // optional: template id to fetch
  habitId?: number;
}

type FormType = {
  title: string;
  description: string;
  frequency_type: "daily" | "x_times_per_week" | "every_x_days";
  frequency_days: number[] | null;
  frequency_value: number | null;
  category_id: number | null | string;
  start_date: string;
  end_date: string | null;
  template: boolean;
  showDatePicker: boolean;
};

type ErrorsType = {
  [key: string]: string | undefined;
  title?: string;
  description?: string;
  frequency_type?: string;
  frequency_days?: string;
  frequency_value?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
};

interface CategoryType {
  id: number;
  name: string;
}
export default function AddHabitModal({ isOpen, onClose, onHabitCreated, prefillId, habitId }: ModalPropsType) {

  const [errors, setErrors] = useState<ErrorsType>({});
  const [flexibleCount, setFlexibleCount] = useState<number>(2);
  const [everyXDays, setEveryXDays] = useState<number>(2);
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
  const [template, setTemplate] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
    frequency_type: "daily",
    frequency_days: null,
    frequency_value: null,
    category_id: null,
    start_date: "",
    end_date: null,
    template: false,
    showDatePicker: false,
  });

  useEffect(() => {
    if (prefillId && isOpen) {
      fetchTemplate(prefillId);
    }
    else if (habitId && isOpen) {
      fetchHabit(habitId)
    }
    // else if (prefillData && isOpen) {
    //   setForm(prev => ({ ...prev, ...prefillData }));
    // }
  }, [prefillId, isOpen, habitId]);


  async function fetchTemplate(id: number) {
    try {
      const res = await axiosInstance.get(`/templates/${id}`);
      console.log(res)
      const data = res.template;
      setFlexibleCount(data.frequency_value);
      if (data.frequency_days) {
        setShowDayPicker(true);
        setWeeklyDays(data.frequency_days);
      }
      setForm(prev => ({
        ...prev,
        title: data.title || "",
        description: data.description || "",
        frequency_type: data.frequency_type || "daily",
        frequency_days: data.frequency_days || null,
        frequency_value: data.frequency_value || null,
        category_id: data.category_id || null,
        start_date: data.start_date || "",
        end_date: data.end_date || null,
        template: false
      }));
    } catch (err) {
      console.error("Error fetching template:", err);
    }
  }
  async function fetchHabit(id: number) {
    try {
      const res = await axiosInstance.get(`/habit/${id}`);
      const data = res.habit;
      console.log(data)
      setFlexibleCount(data.frequency_value)
      if (data.frequency_days) {
        setShowDayPicker(true);
        setWeeklyDays(data.frequency_days)
      }
      setForm(prev => ({
        ...prev,
        title: data.title || "",
        description: data.description || "",
        frequency_type: data.frequency_type || "daily",
        category_id: data.category_id || null,
        start_date: data.start_date || "",
        end_date: data.end_date || null,
        template: data.template || false
      }));
    } catch (err) {
      console.error("Error fetching template:", err);
    }
  }

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
      setShowModal(true);
    } else {
      setForm(prev => ({ ...prev, category_id: value }));
    }
  };

  const handleCategoryAdded = async (newCategory: CategoryType) => {
    console.log(newCategory)
    await getCategories();
    // setCategories(prev => [...prev, newCategory]);
    setForm(prev => ({ ...prev, category_id: newCategory.id }));
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleDay = (dayValue: number) => {
    setWeeklyDays((prev) => {
      if (prev.includes(dayValue)) {
        return prev.filter((d) => d !== dayValue);
      } else if (prev.length < flexibleCount) {
        return [...prev, dayValue];
      }
      return prev; // don't allow more than count
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let frequency_value = null;
    let frequency_days = null;

    if (form.frequency_type === "x_times_per_week") {
      frequency_value = flexibleCount;
      frequency_days = showDayPicker ? weeklyDays : null;
    } else if (form.frequency_type === "every_x_days") {
      frequency_value = everyXDays;
      frequency_days = null;
    }

    const payload = {
      ...form,
      frequency_value,
      frequency_days,
      ...(habitId && { mode: "edit" })
    };

    try {
      if (habitId) {
        await habitUpdateSchema.validate(payload, { abortEarly: false });
        setErrors({});
        await axiosInstance.post(`/habit/${habitId}`, payload);
      }
      else {
        await habitSchema.validate(payload, { abortEarly: false });
        setErrors({});
        await axiosInstance.post("/habit/", payload);
      }
      // console.log(payload)
      // if (habitId) {
      //   await axiosInstance.post(`/habit/update/${habitId}`);
      // } else {
      //   await axiosInstance.post("/habit/create", payload);
      // }
      toast.success("Habit created!");
      // onHabitCreated();
      if (onHabitCreated) {
        onHabitCreated();
      }
      resetForm();
      onClose();
    } catch (err: any) {
      console.log(err)
      if (err.name === "ValidationError") {
        const formattedErrors: any = {};
        err.inner.forEach((e: any) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to create habit.");
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      frequency_type: "daily",
      frequency_days: null,
      frequency_value: null,
      category_id: null,
      start_date: "",
      end_date: null,
      template: false,
      showDatePicker: false
    });
    setFlexibleCount(2);
    setWeeklyDays([]);
    setEveryXDays(2);
    setShowDayPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50"
      onClick={() => {
        resetForm();
        setErrors({});
        onClose();
      }}>
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add New Habit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}


          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />

          <select
            name="frequency_type"
            value={form.frequency_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="daily">Daily</option>
            <option value="x_times_per_week">X times per week</option>
            <option value="every_x_days">Every X days</option>
          </select>
          {errors.frequency_type && <p className="text-red-500 text-sm">{errors.frequency_type}</p>}

          {/* x_times_per_week section */}
          {form.frequency_type === "x_times_per_week" && (
            <>
              <div className="flex gap-8">
                <div>
                  <input
                    type="number"
                    value={flexibleCount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFlexibleCount(val);
                      if (weeklyDays.length > val) {
                        setWeeklyDays([]); // reset if limit exceeded
                      }
                    }}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="How many times per week?"
                  />
                  {errors.frequency_value && <p className="text-red-500 text-sm">{errors.frequency_value}</p>}
                </div>

                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={showDayPicker}
                    onChange={(e) => {
                      setShowDayPicker(e.target.checked);
                      if (!e.target.checked) setWeeklyDays([]);
                    }}
                  />
                  Any specific days in mind?
                </label>
              </div>

              {showDayPicker && (
                <>
                  <p className="text-sm text-gray-600">
                    Choose up to {flexibleCount} day(s):
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-3 py-1 border rounded ${weeklyDays.includes(day.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                          }`}
                      >
                        {day.label}
                      </button>
                    ))}
                    {errors.frequency_days && <p className="text-red-500 text-sm">{errors.frequency_days}</p>}

                  </div>
                </>
              )}
            </>
          )}

          {/* every_x_days */}
          {form.frequency_type === "every_x_days" && (
            <>
              <input
                type="number"
                min={1}
                max={30}
                value={everyXDays}
                onChange={(e) => setEveryXDays(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Every how many days?"
              />
              {errors.frequency_value && <p className="text-red-500 text-sm">{errors.frequency_value}</p>}

            </>

          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}

          </div>

          <select
            name="category_id"
            value={form.category_id || null}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">No Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="0" style={{ fontWeight: "bold" }}>
              ➕ Add a category
            </option>
          </select>

          {/* {showModal && (
            <AddCategoryModal
              onClose={() => setShowModal(false)}
              onCategoryCreated={handleCategoryAdded}
            />
          )} */}
          {!prefillId && <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="template"
              checked={template}
              value={form.template ? "true" : "false"}
              onChange={(e) => {
                console.log(e.target.checked)
                setTemplate(e.target.checked);
                form.template = e.target.checked;
              }}
            />
            Make it a Public Template?
          </label>}


          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setErrors({});
                onClose();
              }}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
        {showModal && (
          <AddCategoryModal
            onClose={() => setShowModal(false)}
            onCategoryCreated={handleCategoryAdded}
          />
        )}
      </div>
    </div>
  );
}
