export const createEmptyBoard = (size = 10) => Array(size).fill(null).map(() => Array(size).fill(null));

export const boardThemes = {
  classic: {
    background: "#ffffff",
    border: "2px solid #e2e8f0",
  },
  dark: {
    background: "#1e1e2e",
    border: "2px solid rgba(255,255,255,0.1)",
  },
  wood: {
    background: "#fef9c3",
    border: "2px solid #d97706",
  },
};

export const cellThemes = {
    classic: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        color: "#1e293b",
    },
    dark: {
        background: "#2a2a3e",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#a5b4fc",
    },
    wood: {
        background: "#fffbeb",
        border: "1px solid #d97706",
        color: "#92400e",
    },
};