import { Link } from "react-router";

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">
      404
    </h1>
    <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
      Page not found
    </p>
    <Link
      to="/"
      className="text-indigo-600 dark:text-indigo-400 hover:underline"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
