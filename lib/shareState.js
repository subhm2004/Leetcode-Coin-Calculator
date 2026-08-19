// Round-trips the calculator inputs through the URL so a result can be linked.

const parseCount = (raw) => {
    const value = Number(String(raw ?? "").trim());
    return Number.isFinite(value) && value >= 0 ? String(Math.floor(value)) : null;
};

export const readShareParams = (search, rewardIds = []) => {
    const params = new URLSearchParams(search ?? "");

    const coins = parseCount(params.get("coins"));
    const streak = parseCount(params.get("streak"));
    const type = params.get("type") === "premium" ? "premium" : params.get("type") === "default" ? "default" : null;
    const rewardParam = params.get("reward");
    const reward = rewardIds.includes(rewardParam) ? rewardParam : null;

    if (coins === null && streak === null && type === null && reward === null) return null;

    return { coins, streak, accountType: type, selectedRewardId: reward };
};

export const buildShareUrl = ({ origin, pathname, coins, streak, accountType, selectedRewardId }) => {
    const params = new URLSearchParams();
    params.set("coins", String(coins ?? 0));
    params.set("streak", String(streak ?? 0));
    params.set("type", accountType === "premium" ? "premium" : "default");
    if (selectedRewardId) params.set("reward", selectedRewardId);

    return `${origin}${pathname}?${params.toString()}`;
};

export const buildSummary = ({ rewardName, coins, needed, fastest, url }) => {
    const lines = [`LeetCoin Calculator — ${rewardName}`, `Balance: ${Number(coins).toLocaleString()} coins`];

    if (needed > 0) {
        lines.push(`Still needed: ${needed.toLocaleString()} coins`);
        if (fastest) lines.push(`Fastest plan: ${fastest.label} — ${fastest.days.toLocaleString()} days (${fastest.endDate})`);
    } else {
        lines.push("Already affordable — go claim it.");
    }

    if (url) lines.push(url);
    return lines.join("\n");
};
