export const validateNonNegativeNumber = (value) => {
    const trimmed = String(value ?? "").trim();
    if (trimmed.length === 0) return "Required";
    const numberValue = Number(trimmed);
    if (!Number.isFinite(numberValue)) return "Must be a number";
    if (numberValue < 0) return "Must be at least 0";
    return true;
};
