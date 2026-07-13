// src/components/EventForm.jsx
import { useState } from "react";

const CATEGORIES = ["conference", "workshop", "meetup", "webinar", "other"];
const STATUSES = ["upcoming", "completed"];

const EMPTY_FORM = {
  title: "",
  date: "",
  location: "",
  description: "",
  category: "conference",
  status: "upcoming",
};

const validate = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.date) errors.date = "Date is required";
  if (!data.location.trim()) errors.location = "Location is required";
  if (!data.description.trim()) errors.description = "Description is required";
  return errors;
};

const inputClass =
  "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const EventForm = ({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitLabel = "Save Event",
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
          placeholder="Event title"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
          placeholder="City or venue"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder="Describe the event"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default EventForm;
