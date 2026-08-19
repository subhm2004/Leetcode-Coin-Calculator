
const oneDayInMs = 1000 * 60 * 60 * 24;

const isLastDayOfMonth = (date) => {
    return new Date(date.getTime() + oneDayInMs).getDate() === 1;
}

/**
 * Coins earned on a single day of the walk.
 *
 * Mutates `state.streak` / `state.lastBiWeekly`, so callers must step the date
 * forward themselves. This is the one place the reward rules live — both the
 * "when do I hit my target" simulation and the growth series run through it.
 */
const earnForDay = (date, state, type, accountType) => {
    let earned = 0;

    if (date.getDate() == 1) {
        state.streak = 1;
    }
    // 25 coin bonus for solving 25 daily challenges in a month
    if (date.getDate() == 25 && state.streak == 25) {
        earned += 25;
    }
    // 50 coin bonus for solving all daily challenges in a month
    else if (isLastDayOfMonth(date) && state.streak == date.getDate()) {
        earned += 50;
    }

    // Additional reward for premium weekly challenges (separate from contest participation)
    if (accountType === "premium" && date.getDay() == 0) {
        earned += 10;
    }

    if (type === "contest") {
        if (date.getDay() == 0) {
            // Weekly contest on Sundays
            earned += 5;

            // Check if there was also a biweekly contest yesterday (Saturday)
            const yesterday = new Date(date.getTime() - oneDayInMs);
            if (yesterday.getDay() == 6 && state.lastBiWeekly != null) {
                if (Math.abs((state.lastBiWeekly.getTime() - yesterday.getTime()) / oneDayInMs) < 1) {
                    earned += 35;
                }
            }
        }
        else if (date.getDay() == 6) {
            // Biweekly contest on Saturdays
            if (state.lastBiWeekly == null) {
                state.lastBiWeekly = new Date(date);
                earned += 5;
            }
            else if (Math.abs((state.lastBiWeekly.getTime() - date.getTime()) / oneDayInMs) >= 14) {
                state.lastBiWeekly = new Date(date);
                earned += 5;
            }
        }
    }

    earned += 11; // daily challenge(10) + daily check-in(1)
    state.streak++;

    return earned;
};

const simulate = (coinsNeeded, streak, type, accountType = "default") => {
    if (coinsNeeded < 0 || streak < 0 || !type) return null;

    let endDate = new Date();
    let days = 0;

    let remaining = Number(coinsNeeded) || 0;

    if (type === "checkIn") {
        days = Math.max(0, remaining);
        endDate.setDate(endDate.getDate() + days);
        return { endDate: endDate.toDateString(), days };
    }

    const state = { streak: Number(streak) || 0, lastBiWeekly: null };

    while (remaining > 0) {
        remaining -= earnForDay(endDate, state, type, accountType);
        endDate.setDate(endDate.getDate() + 1);
        days++;
    }

    return { endDate: endDate.toDateString(), days };
};

/**
 * Running coin total for the next `totalDays` days, down-sampled to at most
 * `maxPoints` entries so a multi-year window stays cheap to render.
 */
const simulateSeries = (totalDays, streak, type, accountType = "default", maxPoints = 80) => {
    const horizon = Math.max(0, Math.floor(totalDays));
    if (!type || horizon === 0) return [];

    const date = new Date();
    const state = { streak: Number(streak) || 0, lastBiWeekly: null };
    const step = Math.max(1, Math.ceil(horizon / maxPoints));

    let coins = 0;
    const points = [{ day: 0, coins: 0 }];

    for (let day = 1; day <= horizon; day++) {
        // Check-in only is a flat 1 coin/day — it skips the challenge and contests.
        coins += type === "checkIn" ? 1 : earnForDay(date, state, type, accountType);
        date.setDate(date.getDate() + 1);

        if (day % step === 0 || day === horizon) {
            points.push({ day, coins });
        }
    }

    return points;
};

const calculate = (coinsNeeded, streak, type, accountType = "default") => {
    const result = simulate(coinsNeeded, streak, type, accountType);
    return result ? result.endDate : null;
};

const calculateDetails = (coinsNeeded, streak, type, accountType = "default") => {
    return simulate(coinsNeeded, streak, type, accountType);
};

module.exports = { calculate, calculateDetails, simulateSeries };
