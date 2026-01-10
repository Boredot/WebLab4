const STORAGE_KEY = 'weatherAppData';

export function saveState(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to localStorage:", e);
    }
}

export function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Error loading from localStorage:", e);
        return null;
    }
}