"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const pad = (n) => String(n).padStart(2, "0");

const remainingTo = (target) => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
};

// Live ticker down to the fastest redeem date.
const Countdown = ({ endDate, label = "until you can redeem" }) => {
    const [left, setLeft] = useState(null);

    useEffect(() => {
        const target = new Date(endDate);
        if (Number.isNaN(target.getTime())) return;

        const tick = () => setLeft(remainingTo(target));
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, [endDate]);

    if (!left) return null;

    const cells = [
        { value: left.days.toLocaleString(), unit: left.days === 1 ? "day" : "days" },
        { value: pad(left.hours), unit: "hrs" },
        { value: pad(left.minutes), unit: "min" },
        { value: pad(left.seconds), unit: "sec" },
    ];

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-stretch gap-2 sm:gap-3">
                {cells.map((cell, i) => (
                    <motion.div
                        key={cell.unit}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="min-w-[68px] rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-center sm:min-w-[84px]"
                    >
                        <div className="font-display text-2xl font-bold tabular-nums text-gradient-gold sm:text-3xl">
                            {cell.value}
                        </div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{cell.unit}</div>
                    </motion.div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
};

export default Countdown;
