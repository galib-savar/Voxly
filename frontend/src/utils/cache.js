export const saveCache = (key, data, duration = 5 * 60 * 1000) => {
  const cache = {
    data,
    expiry: Date.now() + duration,
  };

  localStorage.setItem(key, JSON.stringify(cache));
};

export const getCache = (key) => {
  const cache = localStorage.getItem(key);

  if (!cache) return null;

  const parsed = JSON.parse(cache);

  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
};

export const clearCache = (key) => {
  localStorage.removeItem(key);
};