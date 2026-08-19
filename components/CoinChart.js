"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Table2, LineChart as LineChartIcon } from "lucide-react";

import { cn } from "../lib/utils";

const M = { top: 20, right: 104, bottom: 36, left: 60 };
const HEIGHT = 330;
const LABEL_ROOM = 560; // below this width there is no space for end labels

// Round axis maximum up to a readable step.
const niceTicks = (max, count = 4) => {
    if (!Number.isFinite(max) || max <= 0) return [0, 1];
    const raw = max / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const top = Math.ceil(max / step) * step;

    const ticks = [];
    for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v));
    return ticks;
};

const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(Math.round(n)));

const CoinChart = ({ series = [], target = 0, targetLabel = "Goal", horizon = 1 }) => {
    const wrapRef = useRef(null);
    const [width, setWidth] = useState(760);
    const [hover, setHover] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const node = wrapRef.current;
        if (!node) return;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(node);
        setWidth(node.getBoundingClientRect().width);
        return () => ro.disconnect();
    }, []);

    const days = useMemo(() => series[0]?.points.map((p) => p.day) ?? [], [series]);

    const { ticks, yMax } = useMemo(() => {
        const peak = Math.max(target, ...series.flatMap((s) => s.points.map((p) => p.coins)), 1);
        const t = niceTicks(peak);
        return { ticks: t, yMax: t[t.length - 1] };
    }, [series, target]);

    const showEndLabels = width >= LABEL_ROOM;
    const right = showEndLabels ? M.right : 18;
    const plotW = Math.max(10, width - M.left - right);
    const plotH = HEIGHT - M.top - M.bottom;

    const x = (day) => M.left + (horizon ? day / horizon : 0) * plotW;
    const y = (coins) => M.top + plotH - (coins / yMax) * plotH;

    // Stagger the end labels so they never sit on top of each other.
    const endLabels = useMemo(() => {
        if (!showEndLabels) return [];
        // Mapped inline rather than via `y`, which is rebuilt on every render.
        const toY = (coins) => M.top + plotH - (coins / yMax) * plotH;

        const placed = series
            .map((s) => {
                const last = s.points[s.points.length - 1];
                return { key: s.key, label: s.label, coins: last?.coins ?? 0, y: toY(last?.coins ?? 0) };
            })
            .sort((a, b) => a.y - b.y);

        for (let i = 1; i < placed.length; i++) {
            if (placed[i].y - placed[i - 1].y < 15) placed[i].y = placed[i - 1].y + 15;
        }
        return placed;
    }, [series, showEndLabels, yMax, plotH]);

    const handleMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const ratio = (px - M.left) / plotW;
        const day = Math.max(0, Math.min(horizon, ratio * horizon));

        let nearest = 0;
        let best = Infinity;
        days.forEach((d, i) => {
            const dist = Math.abs(d - day);
            if (dist < best) { best = dist; nearest = i; }
        });
        setHover(nearest);
    };

    if (series.length === 0 || days.length === 0) return null;

    const hoveredDay = hover !== null ? days[hover] : null;
    const tooltipLeft = hover !== null ? x(hoveredDay) : 0;
    const flipTooltip = tooltipLeft > M.left + plotW * 0.6;

    return (
        <div className="rounded-2xl glass p-5 sm:p-6">
            {/* Header + view toggle */}
            <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-display text-base font-semibold">Coins over time</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Running balance for each plan. The dashed line is your goal — where a plan crosses it, you can redeem.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowTable((v) => !v)}
                    aria-pressed={showTable}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
                >
                    {showTable ? <LineChartIcon className="h-3 w-3" /> : <Table2 className="h-3 w-3" />}
                    {showTable ? "Chart view" : "Table view"}
                </button>
            </div>

            {/* Legend — identity is never colour alone */}
            <ul className="mb-3 mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {series.map((s) => (
                    <li key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} />
                        {s.label}
                    </li>
                ))}
            </ul>

            {showTable ? (
                <div className="max-h-[330px] overflow-auto rounded-lg border border-white/[0.07]">
                    <table className="w-full text-left text-xs">
                        <caption className="sr-only">Coin balance by day for each earning plan</caption>
                        <thead className="sticky top-0 bg-[hsl(240_16%_9%)] text-muted-foreground">
                            <tr>
                                <th scope="col" className="px-3 py-2 font-medium">Day</th>
                                {series.map((s) => (
                                    <th key={s.key} scope="col" className="px-3 py-2 text-right font-medium">{s.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="tabular-nums">
                            {days.map((d, i) => (
                                <tr key={d} className="border-t border-white/[0.05]">
                                    <th scope="row" className="px-3 py-1.5 font-normal text-muted-foreground">{d}</th>
                                    {series.map((s) => (
                                        <td key={s.key} className="px-3 py-1.5 text-right">
                                            {(s.points[i]?.coins ?? 0).toLocaleString()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div ref={wrapRef} className="relative w-full">
                    <svg
                        width={width}
                        height={HEIGHT}
                        role="img"
                        aria-label={`Coin balance over the next ${horizon} days for ${series.length} earning plans, against a goal of ${target} coins.`}
                        onMouseMove={handleMove}
                        onMouseLeave={() => setHover(null)}
                        className="touch-none"
                    >
                        {/* Recessive grid + y labels */}
                        {ticks.map((t) => (
                            <g key={t}>
                                <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke="hsl(0 0% 100% / 0.06)" strokeWidth="1" />
                                <text x={M.left - 10} y={y(t) + 4} textAnchor="end" className="fill-[hsl(240_8%_62%)] text-[10px] tabular-nums">
                                    {compact(t)}
                                </text>
                            </g>
                        ))}

                        {/* X axis */}
                        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                            const d = Math.round(horizon * f);
                            return (
                                <text key={f} x={x(d)} y={HEIGHT - 12} textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"}
                                    className="fill-[hsl(240_8%_62%)] text-[10px] tabular-nums">
                                    {d === 0 ? "today" : `${d}d`}
                                </text>
                            );
                        })}

                        {/* Goal rule */}
                        {target > 0 && target <= yMax ? (
                            <g>
                                <line x1={M.left} x2={M.left + plotW} y1={y(target)} y2={y(target)}
                                    stroke="hsl(0 0% 100% / 0.42)" strokeWidth="1.5" strokeDasharray="5 4" />
                                <text x={M.left + 4} y={y(target) - 7} className="fill-[hsl(240_20%_88%)] text-[10px] font-medium">
                                    {targetLabel}
                                </text>
                            </g>
                        ) : null}

                        {/* Series */}
                        {series.map((s, i) => {
                            const d = s.points.map((p, idx) => `${idx ? "L" : "M"}${x(p.day)},${y(p.coins)}`).join(" ");
                            return (
                                <motion.path
                                    key={s.key}
                                    d={d}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.3, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                />
                            );
                        })}

                        {/* Crosshair */}
                        {hover !== null ? (
                            <g>
                                <line x1={x(hoveredDay)} x2={x(hoveredDay)} y1={M.top} y2={M.top + plotH}
                                    stroke="hsl(0 0% 100% / 0.28)" strokeWidth="1" />
                                {series.map((s) => (
                                    <circle key={s.key} cx={x(hoveredDay)} cy={y(s.points[hover]?.coins ?? 0)} r="4.5"
                                        fill={s.color} stroke="hsl(240 16% 7%)" strokeWidth="2" />
                                ))}
                            </g>
                        ) : null}

                        {/* Direct labels */}
                        {endLabels.map((l) => (
                            <text key={l.key} x={M.left + plotW + 8} y={l.y + 3} className="fill-[hsl(240_20%_88%)] text-[10px]">
                                {l.label}
                            </text>
                        ))}
                    </svg>

                    {/* Tooltip */}
                    {hover !== null ? (
                        <div
                            className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-white/10 bg-[hsl(240_18%_8%)]/95 p-2.5 shadow-2xl backdrop-blur"
                            style={{
                                left: flipTooltip ? undefined : tooltipLeft + 14,
                                right: flipTooltip ? width - tooltipLeft + 14 : undefined,
                                top: M.top,
                            }}
                        >
                            <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                {hoveredDay === 0 ? "Today" : `Day ${hoveredDay}`}
                            </div>
                            <ul className="space-y-1">
                                {series.map((s) => (
                                    <li key={s.key} className="flex items-center justify-between gap-3 text-[11px]">
                                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                            <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                                            {s.label}
                                        </span>
                                        <span className="font-medium tabular-nums">
                                            {(s.points[hover]?.coins ?? 0).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CoinChart;
