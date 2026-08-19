"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, CalendarDays, Coins, Flame, Zap } from "lucide-react";

import CoinIcon from "./CoinIcon";
import CountUp from "./CountUp";
import { rewards } from "../utils/rewards.util";

const headline = ["Turn", "your", "streak", "into", "swag."];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const word = {
    hidden: { opacity: 0, y: 34, rotateX: -60, filter: "blur(10px)" },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
};

const stats = [
    { icon: Coins, value: 11, suffix: "/day", label: "Coins from dailies" },
    { icon: Zap, value: 45, suffix: "/wk", label: "With contests" },
    { icon: Flame, value: 50, suffix: " bonus", label: "Perfect month" },
    { icon: CalendarDays, value: rewards.length, suffix: "", label: "Rewards tracked" },
];

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 600], [0, 120]);
    const opacity = useTransform(scrollY, [0, 420], [1, 0]);

    return (
        <section id="top" className="relative flex min-h-[92vh] items-center justify-center px-5 pt-28">
            <motion.div style={{ y, opacity }} className="container relative flex flex-col items-center text-center">
                {/* Spinning coin medallion */}
                <motion.div
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 animate-pulse-glow rounded-full bg-[hsl(var(--gold)/0.55)] blur-3xl" />
                    <div className="relative animate-coin-flip preserve-3d">
                        <CoinIcon size={92} id="hero" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--emerald))] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--emerald))]" />
                    </span>
                    Live simulation · runs entirely in your browser
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="font-display max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                    style={{ perspective: 900 }}
                >
                    {headline.map((w, i) => (
                        <motion.span
                            key={w}
                            variants={word}
                            className={`mr-[0.28em] inline-block ${i === 4 ? "text-gradient-gold glow-text-gold" : ""}`}
                        >
                            {w}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
                >
                    A day-by-day LeetCoin simulator. Feed in your coins, streak and plan — get the exact
                    date you can walk away with the hoodie.
                </motion.p>

                {/* Stat strip */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
                >
                    {stats.map(({ icon: Icon, value, suffix, label }, i) => (
                        <motion.div
                            key={label}
                            whileHover={{ y: -6, scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="glass spotlight relative overflow-hidden rounded-xl p-4 text-left"
                            onMouseMove={(e) => {
                                const r = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                                e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                            }}
                        >
                            <Icon className="mb-2 h-4 w-4 text-[hsl(var(--gold))]" />
                            <div className="font-display text-2xl font-bold tabular-nums">
                                <CountUp value={value} delay={1.1 + i * 0.12} />
                                <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
                            </div>
                            <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll cue */}
                <motion.a
                    href="#calculator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                    className="mt-14 inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                    Start calculating
                    <motion.span
                        animate={{ y: [0, 7, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04]"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </motion.span>
                </motion.a>
            </motion.div>
        </section>
    );
};

export default Hero;
