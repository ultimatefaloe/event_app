// src/components/layouts/NavBar.jsx
import { NavLink, Link } from "react-router";
import { Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="font-bold text-xl text-indigo-600 dark:text-indigo-400"
      >
        EventApp
      </Link>

      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 dark:text-indigo-400 font-medium"
              : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 dark:text-indigo-400 font-medium"
              : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          }
        >
          Events
        </NavLink>

        <Link
          to="/events/new"
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          New Event
        </Link>

        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
