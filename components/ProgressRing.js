"use client";

import { motion } from "framer-motion";

import CountUp from "./CountUp";

// Circular progress meter with a gradient stroke that draws itself in.
const ProgressRing = ({ value = 0, size = 168, stroke = 12, label = "of goal" }) => {
    const clamped = Math.max(0, Math.min(100, value));
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <defs>
                    <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--amber))" />
                        <stop offset="55%" stopColor="hsl(var(--gold))" />
                        <stop offset="100%" stopColor="hsl(var(--violet))" />
                    </linearGradient>
                </defs>

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(0 0% 100% / 0.07)"
                    strokeWidth={stroke}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#ring-grad)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ filter: "drop-shadow(0 0 10px hsl(var(--gold) / 0.55))" }}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-3xl font-bold tabular-nums text-gradient-gold">
                    <CountUp value={clamped} format={(n) => `${Math.round(n)}%`} />
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
            </div>
        </div>
    );
};

export default ProgressRing;
