export const BOARD_STYLES = [
  { value: "classic", label: "Classic", desc: "White background, black lines" },
  { value: "wood", label: "Wood", desc: "Warm wooden texture feel" },
  { value: "dark", label: "Dark", desc: "Dark background, light lines" },
];

export const MARKERS = ["X", "O", "△", "□", "☆", "♦"];

export const AI_LEVELS = [
  {
    value: "easy",
    label: "Easy",
    desc: "Random moves, beginner friendly",
    colorClass: "text-success",
  },
  {
    value: "medium",
    label: "Medium",
    desc: "Basic strategy, moderate challenge",
    colorClass: "text-warning",
  },
  {
    value: "hard",
    label: "Hard",
    desc: "Advanced AI, very challenging",
    colorClass: "text-destructive",
  },
];