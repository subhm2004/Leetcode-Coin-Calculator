"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import CoinIcon from "./CoinIcon";
import { calculateDetails } from "../utils/calculator.util";
import { cn } from "../lib/utils";

/**
 * Every reward laid out on one journey: what you can claim now, and how many
 * days each remaining item is away at your current pace.
 */
const UnlockTimeline = ({ rewards, currentCoins = 0, streak = 0, accountType = "default", planLabel }) => {
    const rows = useMemo(() => {
        const clampedStreak = Math.min(new Date().getDate(), Number(streak) || 0);

        return [...rewards]
            .sort((a, b) => a.coins - b.coins)
            .map((reward) => {
                const needed = Math.max(0, reward.coins - currentCoins);
                if (needed === 0) return { reward, needed, days: 0, endDate: null, unlocked: true };

                const result = calculateDetails(needed, clampedStreak, "contest", accountType);
                return { reward, needed, days: result?.days ?? null, endDate: result?.endDate ?? null, unlocked: false };
            });
    }, [rewards, currentCoins, streak, accountType]);

    const slowest = rows.reduce((max, r) => Math.max(max, r.days ?? 0), 0);

    return (
        <div className="rounded-2xl glass p-5 sm:p-6">
            <div className="mb-6">
                <h3 className="font-display text-base font-semibold">Your unlock order</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    Every reward at your current pace{planLabel ? ` (${planLabel})` : ""} — cheapest first.
                </p>
            </div>

            <ol className="relative space-y-1">
                {/* Spine */}
                <span
                    aria-hidden
                    className="absolute left-[27px] top-2 bottom-2 w-px bg-[linear-gradient(hsl(var(--emerald)/0.6),hsl(var(--gold)/0.5),hsl(var(--rose)/0.35))]"
                />

                {rows.map((row, i) => (
                    <motion.li
                        key={row.reward.id}
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-white/[0.03]"
                    >
                        {/* Node */}
                        <span
                            className={cn(
                                "relative z-10 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ring-4 ring-[hsl(240_16%_7%)] transition-transform group-hover:scale-110",
                                row.unlocked
                                    ? "bg-[hsl(var(--emerald))] text-[hsl(240_25%_6%)]"
                                    : "border border-white/15 bg-[hsl(240_14%_11%)]"
                            )}
                        >
                            {row.unlocked ? <Check className="h-3 w-3" strokeWidth={3.5} /> : null}
                        </span>

                        {/* Thumb */}
                        <span className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[hsl(240_14%_10%)] sm:block">
                            <Image
                                src={row.reward.image}
                                alt=""
                                fill
                                sizes="44px"
                                className="object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                            />
                        </span>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium">{row.reward.name}</span>
                                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                                    {row.reward.coins.toLocaleString()}
                                    <CoinIcon size={10} id={`ut-${row.reward.id}`} />
                                </span>
                            </div>

                            {/* Distance bar */}
                            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: row.unlocked ? "100%" : `${Math.max(3, ((slowest - (row.days ?? 0)) / (slowest || 1)) * 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                    className={cn(
                                        "h-full rounded-full",
                                        row.unlocked
                                            ? "bg-[linear-gradient(90deg,hsl(var(--emerald)),hsl(var(--cyan)))]"
                                            : "bg-[linear-gradient(90deg,hsl(var(--amber)),hsl(var(--gold)))]"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Timing */}
                        <div className="shrink-0 text-right">
                            {row.unlocked ? (
                                <span className="text-xs font-semibold text-[hsl(var(--emerald))]">Claim now</span>
                            ) : (
                                <>
                                    <div className="font-display text-sm font-bold tabular-nums text-[hsl(var(--gold))]">
                                        {row.days?.toLocaleString()}d
                                    </div>
                                    <div className="hidden text-[10px] text-muted-foreground sm:block">{row.endDate}</div>
                                </>
                            )}
                        </div>
                    </motion.li>
                ))}
            </ol>
        </div>
    );
};

export default UnlockTimeline;
