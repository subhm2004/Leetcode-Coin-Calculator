"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";

import CoinIcon from "./CoinIcon";
import TiltCard from "./TiltCard";
import { cn } from "../lib/utils";

const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const item = {
    hidden: { opacity: 0, y: 34, scale: 0.94, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
};

const RewardGrid = ({ rewards, selectedRewardId, onSelect, currentCoins = 0 }) => {
    return (
        <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="perspective-1000 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
        >
            {rewards.map((reward) => {
                const selected = reward.id === selectedRewardId;
                const progress = Math.max(0, Math.min(100, (currentCoins / reward.coins) * 100));
                const owned = progress >= 100;

                return (
                    <motion.div key={reward.id} variants={item}>
                        <TiltCard max={9} scale={1.04} className="h-full">
                            <div
                                role="button"
                                tabIndex={0}
                                aria-pressed={selected}
                                aria-label={`Select ${reward.name}, ${reward.coins} coins`}
                                onClick={() => onSelect(reward.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelect(reward.id);
                                    }
                                }}
                                data-active={selected ? "true" : "false"}
                                className={cn(
                                    "conic-border spotlight group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl glass transition-shadow duration-500",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    selected
                                        ? "shadow-[0_0_50px_-12px_hsl(var(--gold)/0.75)]"
                                        : "hover:shadow-[0_0_44px_-16px_hsl(var(--violet)/0.6)]"
                                )}
                            >
                                {/* Artwork */}
                                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[hsl(240_14%_9%)]">
                                    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,hsl(var(--gold)/0.16),transparent_70%)]" />
                                    <Image
                                        src={reward.image}
                                        alt={reward.name}
                                        fill
                                        sizes="(min-width: 1280px) 260px, (min-width: 640px) 40vw, 90vw"
                                        className="object-contain p-4 drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
                                    />

                                    {/* Glare sweep on hover */}
                                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,hsl(0_0%_100%/0.14),transparent)] transition-transform duration-1000 ease-out group-hover:translate-x-full" />

                                    <AnimatePresence>
                                        {selected ? (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                                                className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--gold))] text-[hsl(240_25%_6%)] shadow-[0_0_20px_hsl(var(--gold)/0.9)]"
                                            >
                                                <Check className="h-4 w-4" strokeWidth={3} />
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>

                                    {owned ? (
                                        <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--emerald)/0.16)] px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--emerald))] ring-1 ring-[hsl(var(--emerald)/0.35)]">
                                            <Sparkles className="h-2.5 w-2.5" />
                                            Affordable
                                        </div>
                                    ) : null}
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col gap-3 p-4">
                                    <div>
                                        <div className="text-sm font-semibold leading-snug">{reward.name}</div>
                                        <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                            {reward.subtitle}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-2">
                                        {/* Affordability meter */}
                                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                                className={cn(
                                                    "h-full rounded-full",
                                                    owned
                                                        ? "bg-[linear-gradient(90deg,hsl(var(--emerald)),hsl(var(--cyan)))]"
                                                        : "bg-[linear-gradient(90deg,hsl(var(--amber)),hsl(var(--gold)))]"
                                                )}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {owned ? null : <Lock className="h-2.5 w-2.5" />}
                                                {owned ? "Unlocked" : "Price"}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--gold)/0.12)] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--gold))] ring-1 ring-[hsl(var(--gold)/0.25)]">
                                                {reward.coins.toLocaleString()}
                                                <CoinIcon size={13} id={`c-${reward.id}`} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default RewardGrid;
