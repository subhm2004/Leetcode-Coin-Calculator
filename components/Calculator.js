"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { Check, Copy, Crown, Flame, Link2, Loader2, PartyPopper, RotateCcw, Sparkles, Target, TrendingUp } from "lucide-react";

import { rewards } from "../utils/rewards.util";
import RewardGrid from "./RewardGrid";
import Result from "./Result";
import CoinChart from "./CoinChart";
import CoinIcon from "./CoinIcon";
import Countdown from "./Countdown";
import CountUp from "./CountUp";
import ProgressRing from "./ProgressRing";
import Reveal from "./Reveal";
import UnlockTimeline from "./UnlockTimeline";
import useWindowSize from "../lib/useWindowSize";
import { validateNonNegativeNumber } from "../lib/validation";
import { getSubmissionOutcome } from "../lib/calculatorSubmission";
import { buildShareUrl, buildSummary, readShareParams } from "../lib/shareState";
import { simulateSeries } from "../utils/calculator.util";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const STORAGE_KEY = "leetcoin-calculator:v3";
const EMPTY_RESULTS = { premium: null, contest: null, daily: null, checkIn: null };

const CONFETTI_COLORS = ["#FFC24B", "#FFE9A8", "#E8860F", "#A78BFA", "#22D3EE", "#34D399"];

const QUICK_COINS = [100, 500, 1000, 2500];

const STRATEGIES = [
    {
        key: "premium",
        title: "Premium",
        subtitle: "Everything, plus the premium weekly set",
        accent: "violet",
        // Chart steps are re-stepped into the dark-mode lightness band and
        // validated as a set (see README) — they are not the card accents.
        chart: "#985cff",
        config: { dailyCheckin: true, dailyChallenge: true, weeklyContest: true, biweeklyContest: true, premiumWeekly: true },
    },
    {
        key: "contest",
        title: "All events",
        subtitle: "Dailies plus every contest you can enter",
        accent: "emerald",
        chart: "#02ac6d",
        config: { dailyCheckin: true, dailyChallenge: true, weeklyContest: true, biweeklyContest: true, premiumWeekly: false },
    },
    {
        key: "daily",
        title: "Daily only",
        subtitle: "Check-in and the daily challenge, nothing else",
        accent: "gold",
        chart: "#c28100",
        config: { dailyCheckin: true, dailyChallenge: true, weeklyContest: false, biweeklyContest: false, premiumWeekly: false },
    },
    {
        key: "checkIn",
        title: "Check-in only",
        subtitle: "One coin a day — the scenic route",
        accent: "rose",
        chart: "#ff2d9b",
        config: { dailyCheckin: true, dailyChallenge: false, weeklyContest: false, biweeklyContest: false, premiumWeekly: false },
    },
];

const Calculator = () => {
    const [selectedRewardId, setSelectedRewardId] = useState(null);
    const [isAffordable, setIsAffordable] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationResults, setCalculationResults] = useState(EMPTY_RESULTS);
    const [copied, setCopied] = useState(null);

    const resultsRef = useRef(null);
    const timers = useRef([]);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: { coins: "0", streak: "0", accountType: "default" },
        mode: "onChange",
    });

    const coinsInput = watch("coins");
    const streakInput = watch("streak");
    const accountType = watch("accountType");

    // Restore inputs: a shared link wins over the last local session.
    useEffect(() => {
        const rewardIds = rewards.map((r) => r.id);
        const shared = readShareParams(window.location.search, rewardIds);

        // setValue rather than reset: on mount reset writes straight to the
        // uncontrolled inputs, which the Controller-backed Select never sees.
        const restore = ({ coins, streak, accountType: type, selectedRewardId: rewardId }) => {
            setValue("coins", coins, { shouldValidate: true });
            setValue("streak", streak, { shouldValidate: true });
            setValue("accountType", type);
            if (rewardId) setSelectedRewardId(rewardId);
        };

        if (shared) {
            restore({
                coins: shared.coins ?? "0",
                streak: shared.streak ?? "0",
                accountType: shared.accountType ?? "default",
                selectedRewardId: shared.selectedRewardId,
            });
            return;
        }

        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            const parsed = JSON.parse(saved);
            restore({
                coins: String(parsed.coins ?? "0"),
                streak: String(parsed.streak ?? "0"),
                accountType: parsed.accountType === "premium" ? "premium" : "default",
                selectedRewardId: rewards.some((r) => r.id === parsed.selectedRewardId) ? parsed.selectedRewardId : null,
            });
        } catch {
            /* corrupted or unavailable storage — start fresh */
        }
    }, [setValue]);

    useEffect(() => {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ coins: coinsInput, streak: streakInput, accountType, selectedRewardId })
            );
        } catch {
            /* storage full or blocked — persistence is a nicety, not required */
        }
    }, [coinsInput, streakInput, accountType, selectedRewardId]);

    useEffect(() => {
        const pending = timers.current;
        return () => pending.forEach((id) => window.clearTimeout(id));
    }, []);

    const selectedReward = useMemo(
        () => rewards.find((r) => r.id === selectedRewardId) ?? null,
        [selectedRewardId]
    );

    const currentCoins = useMemo(() => {
        const value = Number(String(coinsInput ?? "").trim());
        return Number.isFinite(value) && value > 0 ? value : 0;
    }, [coinsInput]);

    // Clear stale results whenever the target changes.
    useEffect(() => {
        setIsAffordable(false);
        setShowConfetti(false);
        setCalculationResults(EMPTY_RESULTS);
    }, [selectedRewardId]);

    const coinsNeeded = useMemo(() => {
        if (!selectedReward) return null;
        return Math.max(0, Number(selectedReward.coins) - currentCoins);
    }, [selectedReward, currentCoins]);

    const progress = useMemo(() => {
        if (!selectedReward) return 0;
        return Math.min(100, (currentCoins / Number(selectedReward.coins)) * 100);
    }, [selectedReward, currentCoins]);

    const { width, height } = useWindowSize();

    const activeResults = useMemo(
        () => STRATEGIES.filter((s) => calculationResults[s.key]).map((s) => ({ ...s, data: calculationResults[s.key] })),
        [calculationResults]
    );

    const maxDays = useMemo(
        () => activeResults.reduce((max, r) => Math.max(max, r.data.days), 0),
        [activeResults]
    );

    const fastest = useMemo(() => {
        if (activeResults.length === 0) return null;
        return activeResults.reduce((best, r) => (r.data.days < best.data.days ? r : best), activeResults[0]);
    }, [activeResults]);

    const fastestKey = fastest?.key ?? null;

    // Chart window: long enough that the quickest plan clearly crosses the goal.
    const horizon = useMemo(() => {
        if (!fastest) return 0;
        return Math.min(3650, Math.max(30, Math.ceil(fastest.data.days * 1.15)));
    }, [fastest]);

    const chartSeries = useMemo(() => {
        if (!horizon || activeResults.length === 0) return [];
        const streakValue = Math.min(new Date().getDate(), Number(String(streakInput ?? "").trim()) || 0);

        return activeResults.map((strategy) => ({
            key: strategy.key,
            label: strategy.title,
            color: strategy.chart,
            points: simulateSeries(
                horizon,
                streakValue,
                strategy.key === "premium" ? "contest" : strategy.key === "checkIn" ? "checkIn" : strategy.key === "daily" ? "daily" : "contest",
                strategy.key === "premium" ? "premium" : "default",
                80
            ),
        }));
    }, [activeResults, horizon, streakInput]);

    const copyToClipboard = async (kind, text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(kind);
            scheduleTimer(() => setCopied(null), 2000);
        } catch {
            /* clipboard blocked (insecure origin or denied permission) — no fallback worth forcing */
        }
    };

    const handleCopyLink = () => {
        const url = buildShareUrl({
            origin: window.location.origin,
            pathname: window.location.pathname,
            coins: currentCoins,
            streak: Number(String(streakInput ?? "").trim()) || 0,
            accountType,
            selectedRewardId,
        });
        copyToClipboard("link", url);
    };

    const handleCopySummary = () => {
        if (!selectedReward) return;
        const url = buildShareUrl({
            origin: window.location.origin,
            pathname: window.location.pathname,
            coins: currentCoins,
            streak: Number(String(streakInput ?? "").trim()) || 0,
            accountType,
            selectedRewardId,
        });
        copyToClipboard(
            "summary",
            buildSummary({
                rewardName: selectedReward.name,
                coins: currentCoins,
                needed: coinsNeeded ?? 0,
                fastest: fastest ? { label: fastest.title, days: fastest.data.days, endDate: fastest.data.endDate } : null,
                url,
            })
        );
    };

    const scheduleTimer = useCallback((fn, ms) => {
        const id = window.setTimeout(fn, ms);
        timers.current.push(id);
    }, []);

    const onSubmit = (values) => {
        if (!selectedReward || isCalculating) return;

        setIsCalculating(true);

        // Brief pause so the simulation reads as a deliberate step, not a flash.
        scheduleTimer(() => {
            const outcome = getSubmissionOutcome({ values, selectedReward });

            setIsCalculating(false);
            setIsAffordable(outcome.affordable);
            setCalculationResults(outcome.results);

            if (outcome.affordable) {
                setShowConfetti(true);
                scheduleTimer(() => setShowConfetti(false), 6000);
            }

            scheduleTimer(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }, 620);
    };

    const handleReset = () => {
        setValue("coins", "0", { shouldValidate: true });
        setValue("streak", "0", { shouldValidate: true });
        setValue("accountType", "default");
        setSelectedRewardId(null);
        setCalculationResults(EMPTY_RESULTS);
        setIsAffordable(false);
        setShowConfetti(false);
    };

    const bumpCoins = (amount) => {
        setValue("coins", String(currentCoins + amount), { shouldValidate: true });
    };

    const hasResults = activeResults.length > 0;

    return (
        <div className="space-y-24">
            {showConfetti ? (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={340}
                    recycle={false}
                    gravity={0.2}
                    colors={CONFETTI_COLORS}
                    style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }}
                />
            ) : null}

            {/* ---------------- Calculator ---------------- */}
            <section id="calculator" className="scroll-mt-28">
                <Reveal className="mb-10 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <Target className="h-3 w-3 text-[hsl(var(--gold))]" />
                        Step 01
                    </span>
                    <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Tell us where you <span className="text-gradient-gold">stand</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                        Your coin balance, your current streak, and whether you are on Premium. That is the whole input.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
                    {/* --- Input panel --- */}
                    <Reveal direction="right" className="lg:sticky lg:top-24 lg:self-start">
                        <div className="conic-border spotlight relative overflow-hidden rounded-2xl glass p-6"
                            onMouseMove={(e) => {
                                const r = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                                e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                            }}
                        >
                            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                                {/* Coins */}
                                <div className="grid gap-2">
                                    <Label htmlFor="coins" className="flex items-center gap-2 text-muted-foreground">
                                        <CoinIcon size={15} id="lbl-coins" />
                                        Current LeetCoins
                                    </Label>
                                    <Input id="coins" type="text" inputMode="numeric" placeholder="0"
                                        className="font-display text-lg font-semibold tabular-nums"
                                        {...register("coins", { validate: validateNonNegativeNumber })} />
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_COINS.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => bumpCoins(amount)}
                                                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--gold)/0.4)] hover:text-[hsl(var(--gold))]"
                                            >
                                                +{amount.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                    <AnimatePresence>
                                        {errors.coins ? (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                className="text-xs text-[hsl(var(--rose))]">
                                                {errors.coins.message}
                                            </motion.p>
                                        ) : null}
                                    </AnimatePresence>
                                </div>

                                {/* Streak */}
                                <div className="grid gap-2">
                                    <Label htmlFor="streak" className="flex items-center gap-2 text-muted-foreground">
                                        <Flame className="h-3.5 w-3.5 text-[hsl(var(--rose))]" />
                                        Current streak
                                    </Label>
                                    <Input id="streak" type="text" inputMode="numeric" placeholder="0"
                                        className="font-display text-lg font-semibold tabular-nums"
                                        {...register("streak", { validate: validateNonNegativeNumber })} />
                                    <AnimatePresence>
                                        {errors.streak ? (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                className="text-xs text-[hsl(var(--rose))]">
                                                {errors.streak.message}
                                            </motion.p>
                                        ) : null}
                                    </AnimatePresence>
                                    <p className="text-[11px] leading-snug text-muted-foreground">
                                        Clamped to today&rsquo;s day-of-month, since monthly bonuses reset with the calendar.
                                    </p>
                                </div>

                                {/* Account type */}
                                <div className="grid gap-2">
                                    <Label htmlFor="accountType" className="flex items-center gap-2 text-muted-foreground">
                                        <Crown className="h-3.5 w-3.5 text-[hsl(var(--violet))]" />
                                        Account type
                                    </Label>
                                    <Controller
                                        name="accountType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                // Radix's hidden native select has no <option> for a value
                                                // set while the dropdown is closed, so it echoes back "".
                                                // Neither real choice is empty, so drop those.
                                                onValueChange={(value) => {
                                                    if (value) field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger id="accountType">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="default">Default</SelectItem>
                                                        <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* Live target readout */}
                                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                                    <AnimatePresence mode="wait">
                                        {selectedReward ? (
                                            <motion.div key={selectedReward.id}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.35 }}
                                                className="flex items-center gap-4">
                                                <ProgressRing value={progress} size={104} stroke={9} label="collected" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Target</div>
                                                    <div className="truncate text-sm font-semibold">{selectedReward.name}</div>
                                                    <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">Still needed</div>
                                                    <div className="font-display inline-flex items-center gap-1.5 text-xl font-bold tabular-nums text-[hsl(var(--gold))]">
                                                        <CountUp value={coinsNeeded ?? 0} duration={0.7} />
                                                        <CoinIcon size={15} id="need" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="empty"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <Sparkles className="h-4 w-4 shrink-0 text-[hsl(var(--gold))]" />
                                                Pick a reward from the grid to set your target.
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" variant="custom" size="lg" disabled={!selectedReward || isCalculating} className="flex-1">
                                        {isCalculating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Simulating&hellip;
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="h-4 w-4" />
                                                Calculate
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" size="lg" onClick={handleReset} aria-label="Reset form" className="px-4">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Reveal>

                    {/* --- Reward grid --- */}
                    <div id="rewards" className="scroll-mt-28">
                        <Reveal className="mb-4 flex items-baseline justify-between gap-4">
                            <div>
                                <h3 className="font-display text-lg font-semibold">Choose your prize</h3>
                                <p className="text-xs text-muted-foreground">The bar under each item shows how close you already are.</p>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">{rewards.length} items</span>
                        </Reveal>
                        <RewardGrid
                            rewards={rewards}
                            selectedRewardId={selectedRewardId}
                            onSelect={setSelectedRewardId}
                            currentCoins={currentCoins}
                        />
                    </div>
                </div>
            </section>

            {/* ---------------- Results ---------------- */}
            <section id="results" ref={resultsRef} className="scroll-mt-28">
                <AnimatePresence mode="wait">
                    {isAffordable && selectedReward ? (
                        <motion.div key="affordable"
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="conic-border relative overflow-hidden rounded-2xl glass p-10 text-center"
                            data-active="true">
                            <motion.div
                                animate={{ rotate: [0, -12, 12, -8, 0], scale: [1, 1.15, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.6 }}
                                className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--gold)/0.14)] ring-1 ring-[hsl(var(--gold)/0.4)]">
                                <PartyPopper className="h-8 w-8 text-[hsl(var(--gold))]" />
                            </motion.div>
                            <h3 className="font-display text-3xl font-bold sm:text-4xl">
                                Go <span className="text-gradient-gold">claim it</span>.
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                                You already have enough coins for the{" "}
                                <span className="font-semibold text-foreground">{selectedReward.name}</span>. Zero days of waiting.
                            </p>
                            <a href="https://leetcode.com/store/" target="_blank" rel="noreferrer"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(110deg,hsl(var(--amber)),hsl(var(--gold)))] px-6 py-2.5 text-sm font-semibold text-[hsl(240_25%_6%)] shadow-[0_10px_40px_-12px_hsl(var(--gold)/0.9)] transition-transform hover:scale-105">
                                Open the LeetCode Store
                                <CoinIcon size={16} id="store" />
                            </a>
                        </motion.div>
                    ) : hasResults ? (
                        <motion.div key="results"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-8">
                            <div className="text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                    <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
                                    Step 02
                                </span>
                                <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                    Your <span className="text-gradient-gold">roadmap</span>
                                </h2>
                                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                                    Four grind styles, simulated day by day — monthly bonuses and contest cadence included.
                                </p>
                            </div>

                            <div className="perspective-1000 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {activeResults.map((strategy, i) => (
                                    <Result
                                        key={strategy.key}
                                        title={strategy.title}
                                        subtitle={strategy.subtitle}
                                        accent={strategy.accent}
                                        config={strategy.config}
                                        days={strategy.data.days}
                                        endDate={strategy.data.endDate}
                                        maxDays={maxDays}
                                        isFastest={strategy.key === fastestKey}
                                        delay={i * 0.12}
                                    />
                                ))}
                            </div>

                            {/* Live ticker + share */}
                            {fastest ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="conic-border relative overflow-hidden rounded-2xl glass p-6 text-center"
                                >
                                    <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        Fastest route &middot; {fastest.title}
                                    </div>
                                    <Countdown endDate={fastest.data.endDate} label={`until you can redeem the ${selectedReward?.name ?? "reward"}`} />

                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
                                            {copied === "link" ? <Check className="h-3.5 w-3.5 text-[hsl(var(--emerald))]" /> : <Link2 className="h-3.5 w-3.5" />}
                                            <span className="ml-2">{copied === "link" ? "Link copied" : "Copy link"}</span>
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={handleCopySummary}>
                                            {copied === "summary" ? <Check className="h-3.5 w-3.5 text-[hsl(var(--emerald))]" /> : <Copy className="h-3.5 w-3.5" />}
                                            <span className="ml-2">{copied === "summary" ? "Summary copied" : "Copy summary"}</span>
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : null}

                            {/* Growth chart */}
                            {chartSeries.length > 0 && selectedReward ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <CoinChart
                                        series={chartSeries}
                                        target={selectedReward.coins - currentCoins}
                                        targetLabel={`${selectedReward.name} \u00b7 ${(selectedReward.coins - currentCoins).toLocaleString()} to go`}
                                        horizon={horizon}
                                    />
                                </motion.div>
                            ) : null}

                            {/* Everything else you could unlock */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <UnlockTimeline
                                    rewards={rewards}
                                    currentCoins={currentCoins}
                                    streak={Number(String(streakInput ?? "").trim()) || 0}
                                    accountType={accountType}
                                    planLabel={accountType === "premium" ? "all events + premium" : "all events"}
                                />
                            </motion.div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Calculator;
