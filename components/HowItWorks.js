"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, CalendarRange, Crown, Gift, Repeat, Swords, Trophy } from "lucide-react";

import CoinIcon from "./CoinIcon";
import Reveal from "./Reveal";

// Mirrors the reward rules in utils/calculator.util.js.
const SOURCES = [
    { icon: CalendarCheck2, amount: 1, unit: "per day", title: "Daily check-in", note: "Just open the site and claim.", tone: "hsl(var(--cyan))" },
    { icon: Swords, amount: 10, unit: "per day", title: "Daily challenge", note: "Solve the problem of the day.", tone: "hsl(var(--gold))" },
    { icon: Trophy, amount: 5, unit: "per contest", title: "Weekly contest", note: "Every Sunday.", tone: "hsl(var(--emerald))" },
    { icon: CalendarRange, amount: 5, unit: "per contest", title: "Biweekly contest", note: "Every other Saturday.", tone: "hsl(var(--violet))" },
    { icon: Repeat, amount: 35, unit: "bonus", title: "Double-contest weekend", note: "When both contests land back to back.", tone: "hsl(var(--rose))" },
    { icon: Gift, amount: 25, unit: "bonus", title: "25-day streak", note: "25 dailies inside one month.", tone: "hsl(var(--amber))" },
    { icon: Trophy, amount: 50, unit: "bonus", title: "Perfect month", note: "Every single daily, start to finish.", tone: "hsl(var(--gold))" },
    { icon: Crown, amount: 10, unit: "per week", title: "Premium weekly set", note: "Premium accounts only.", tone: "hsl(var(--violet))" },
];

const HowItWorks = () => {
    return (
        <section id="how" className="scroll-mt-28">
            <Reveal className="mb-10 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <CoinIcon size={12} id="how-badge" />
                    The maths
                </span>
                <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Every coin the simulator <span className="text-gradient-gold">counts</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                    The estimate walks forward one real calendar day at a time, so weekends, contest cadence
                    and month-end bonuses all land where they actually would.
                </p>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SOURCES.map(({ icon: Icon, amount, unit, title, note, tone }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -8 }}
                        className="spotlight group relative overflow-hidden rounded-xl glass p-5"
                        onMouseMove={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                            e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                        }}
                    >
                        <div
                            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{ background: `color-mix(in srgb, ${tone} 14%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone} 32%, transparent)` }}
                        >
                            <Icon className="h-5 w-5" style={{ color: tone }} />
                        </div>

                        <div className="flex items-baseline gap-1.5">
                            <span className="font-display text-3xl font-extrabold tabular-nums" style={{ color: tone }}>
                                +{amount}
                            </span>
                            <CoinIcon size={14} id={`hw-${i}`} />
                            <span className="ml-1 text-[11px] text-muted-foreground">{unit}</span>
                        </div>

                        <div className="mt-3 text-sm font-semibold">{title}</div>
                        <div className="mt-1 text-xs leading-snug text-muted-foreground">{note}</div>

                        <div
                            className="pointer-events-none absolute -bottom-14 -right-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                            style={{ background: tone }}
                        />
                    </motion.div>
                ))}
            </div>

            <Reveal delay={0.2} className="mt-6">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center text-xs text-muted-foreground">
                    Estimates assume you never miss a day. Miss one, and the month-end bonuses reset — which is
                    exactly why the <span className="text-[hsl(var(--gold))]">check-in only</span> column looks so bleak.
                </div>
            </Reveal>
        </section>
    );
};

export default HowItWorks;
