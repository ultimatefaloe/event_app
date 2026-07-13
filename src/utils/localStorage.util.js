const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("localStorage setItem failed:", err);
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("localStorage removeItem failed:", err);
  }
};

export { getItem, setItem, removeItem };
