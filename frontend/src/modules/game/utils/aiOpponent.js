export const AI_OPPONENTS = {
  easy: {
    name: "AI-Rookie",
    avatar: "🙂",
    avatarClass: "aiAvatarEasy",
  },
  medium: {
    name: "AI-Tactician",
    avatar: "🤖",
    avatarClass: "aiAvatarMedium",
  },
  hard: {
    name: "AI-Mastermind",
    avatar: "🧠",
    avatarClass: "aiAvatarHard",
  },
};

export function getAiOpponent(difficulty = "medium") {
  return AI_OPPONENTS[difficulty] || AI_OPPONENTS.medium;
}
