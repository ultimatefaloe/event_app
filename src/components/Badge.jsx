// src/components/Badge.jsx
const variantClasses = {
  upcoming:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  conference:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  workshop:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  meetup:
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  webinar:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  other:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const Badge = ({ label }) => {
  const classes = variantClasses[label] ?? variantClasses.other;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${classes}`}
    >
      {label}
    </span>
  );
};

export default Badge;
