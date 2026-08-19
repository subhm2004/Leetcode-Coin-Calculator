"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CoinIcon from "./CoinIcon";
import { cn } from "../lib/utils";

const NAV = [
    { href: "#calculator", label: "Calculator" },
    { href: "#rewards", label: "Rewards" },
    { href: "#how", label: "How it works" },
];

const SiteHeader = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
        >
            <div
                className={cn(
                    "flex w-full max-w-5xl items-center justify-between gap-6 rounded-full px-5 py-2.5 transition-all duration-500",
                    scrolled ? "glass shadow-2xl shadow-black/40" : "border border-transparent bg-transparent backdrop-blur-0"
                )}
            >
                <a href="#top" className="group flex items-center gap-2.5">
                    <span className="relative inline-flex">
                        <CoinIcon size={24} className="animate-bob" id="brand" />
                        <span className="absolute inset-0 rounded-full bg-[hsl(var(--gold)/0.5)] blur-lg opacity-60 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="font-display text-sm font-semibold tracking-tight sm:text-base">
                        LeetCode&nbsp;Coin
                        <span className="hidden text-[hsl(var(--gold))] sm:inline">&nbsp;Calculator</span>
                    </span>
                </a>

                <nav className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                    {NAV.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <a
                    href="#calculator"
                    className="text-sm text-muted-foreground transition-colors hover:text-[hsl(var(--gold))] sm:hidden"
                >
                    Calculator
                </a>
            </div>
        </motion.header>
    );
};

export default SiteHeader;
