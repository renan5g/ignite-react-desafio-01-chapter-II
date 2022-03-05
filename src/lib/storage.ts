export const StorageAPI = {
  getItem<T>(key: string, defaultValue: T): T {
    const storaged = localStorage.getItem(key);

    if (!storaged) {
      return defaultValue;
    }

    return JSON.parse(storaged);
  },

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
