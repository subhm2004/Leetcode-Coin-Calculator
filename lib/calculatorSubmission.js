import { calculateDetails } from "../utils/calculator.util";

const parseNumber = (value) => {
    return Number(String(value ?? "").trim());
};

export const getSubmissionOutcome = ({ values, selectedReward }) => {
    if (!selectedReward) {
        return {
            affordable: false,
            needed: null,
            results: { premium: null, contest: null, daily: null, checkIn: null },
        };
    }

    const coinsValue = parseNumber(values?.coins);
    const streakValue = parseNumber(values?.streak);
    const streakClamped = Math.min(new Date().getDate(), streakValue);
    const needed = Math.max(0, Number(selectedReward.coins) - coinsValue);

    if (needed === 0) {
        return {
            affordable: true,
            needed,
            results: { premium: null, contest: null, daily: null, checkIn: null },
        };
    }

    const contest = calculateDetails(needed, streakClamped, "contest");
    const daily = calculateDetails(needed, streakClamped, "daily");
    const checkIn = calculateDetails(needed, streakClamped, "checkIn");
    const premium = values?.accountType === "premium"
        ? calculateDetails(needed, streakClamped, "contest", "premium")
        : null;

    return {
        affordable: false,
        needed,
        results: { premium, contest, daily, checkIn },
    };
};
