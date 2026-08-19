"use client";

import { motion } from "framer-motion";
import { Check, Minus, Rocket, CalendarCheck } from "lucide-react";

import CountUp from "./CountUp";
import { cn } from "../lib/utils";

const ACCENTS = {
    violet: { text: "text-[hsl(var(--violet))]", ring: "ring-[hsl(var(--violet)/0.3)]", glow: "hsl(var(--violet))", bar: "from-[hsl(var(--violet))] to-[hsl(var(--cyan))]" },
    emerald: { text: "text-[hsl(var(--emerald))]", ring: "ring-[hsl(var(--emerald)/0.3)]", glow: "hsl(var(--emerald))", bar: "from-[hsl(var(--emerald))] to-[hsl(var(--cyan))]" },
    gold: { text: "text-[hsl(var(--gold))]", ring: "ring-[hsl(var(--gold)/0.3)]", glow: "hsl(var(--gold))", bar: "from-[hsl(var(--amber))] to-[hsl(var(--gold))]" },
    rose: { text: "text-[hsl(var(--rose))]", ring: "ring-[hsl(var(--rose)/0.3)]", glow: "hsl(var(--rose))", bar: "from-[hsl(var(--rose))] to-[hsl(var(--gold))]" },
};

const LABELS = {
    dailyCheckin: "Daily Check-in",
    dailyChallenge: "Daily Challenge",
    weeklyContest: "Weekly Contest",
    biweeklyContest: "Biweekly Contest",
    premiumWeekly: "Premium Weekly Set",
};

const Result = ({ title, subtitle, endDate, days, config, accent = "gold", maxDays, isFastest = false, delay = 0 }) => {
    const tone = ACCENTS[accent] ?? ACCENTS.gold;
    const share = maxDays && maxDays > 0 ? Math.max(6, (days / maxDays) * 100) : 100;
    const months = typeof days === "number" ? days / 30.44 : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 34, rotateX: -8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="perspective-1000 h-full"
        >
            <div
                className={cn(
                    "spotlight relative flex h-full flex-col overflow-hidden rounded-xl glass p-5 ring-1 transition-shadow duration-500",
                    tone.ring
                )}
                style={{ boxShadow: isFastest ? `0 0 46px -14px ${tone.glow}` : undefined }}
                onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
            >
                {isFastest ? (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: delay + 0.4, type: "spring", stiffness: 380, damping: 18 }}
                        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--gold)/0.14)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--gold))] ring-1 ring-[hsl(var(--gold)/0.35)]"
                    >
                        <Rocket className="h-3 w-3" />
                        Fastest
                    </motion.div>
                ) : null}

                <div className="mb-4">
                    <h3 className={cn("font-display text-sm font-semibold uppercase tracking-[0.14em]", tone.text)}>{title}</h3>
                    {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
                </div>

                {/* Headline number */}
                <div className="mb-4 flex items-baseline gap-2">
                    <span className={cn("font-display text-5xl font-extrabold tabular-nums leading-none", tone.text)}>
                        <CountUp value={days} delay={delay + 0.15} />
                    </span>
                    <span className="text-sm text-muted-foreground">{days === 1 ? "day" : "days"}</span>
                </div>

                {/* Relative-length bar */}
                <div className="mb-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${share}%` }}
                            transition={{ duration: 1.1, delay: delay + 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className={cn("h-full rounded-full bg-gradient-to-r", tone.bar)}
                        />
                    </div>
                    {months !== null ? (
                        <div className="mt-1.5 text-[11px] text-muted-foreground">
                            ≈ {months < 1 ? "under a month" : `${months.toFixed(1)} months`}
                        </div>
                    ) : null}
                </div>

                {/* Target date */}
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <CalendarCheck className={cn("h-4 w-4 shrink-0", tone.text)} />
                    <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Redeem on</div>
                        <div className="truncate text-sm font-semibold">{endDate}</div>
                    </div>
                </div>

                {/* What's included */}
                <ul className="mt-auto space-y-1.5 text-xs">
                    {Object.entries(LABELS).map(([key, label], i) => {
                        const enabled = Boolean(config?.[key]);
                        return (
                            <motion.li
                                key={key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: delay + 0.4 + i * 0.06, duration: 0.4 }}
                                className={cn("flex items-center gap-2", enabled ? "text-foreground/85" : "text-muted-foreground/45")}
                            >
                                <span
                                    className={cn(
                                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                        enabled ? "bg-[hsl(var(--emerald)/0.16)] text-[hsl(var(--emerald))]" : "bg-white/[0.05] text-muted-foreground/50"
                                    )}
                                >
                                    {enabled ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : <Minus className="h-2.5 w-2.5" strokeWidth={3} />}
                                </span>
                                {label}
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </motion.div>
    );
};

export default Result;
