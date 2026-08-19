"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowUp } from "lucide-react";

import CoinIcon from "./CoinIcon";

// ---------------------------------------------------------------
// YOUR LINKS — the only block you need to edit.
// ---------------------------------------------------------------
const OWNER = "Shubham Malik";

const CONNECT = [
    { href: "https://github.com/subhm2004", label: "GitHub" },
    { href: "https://www.linkedin.com/in/shubham04012003", label: "LinkedIn" },
    { href: "https://leetcode.com/u/subhm2003", label: "LeetCode" },
    { href: "https://shubhammalik1.vercel.app", label: "Portfolio" },
];
// ---------------------------------------------------------------

const NAVIGATE = [
    { href: "#calculator", label: "Calculator" },
    { href: "#rewards", label: "Rewards" },
    { href: "#how", label: "How it works" },
];

const FooterLink = ({ href, label, external = false }) => (
    <li>
        <a
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
            <span className="relative">
                {label}
                {/* Underline wipes in from the left on hover */}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[hsl(var(--gold))] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            {external ? (
                <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            ) : null}
        </a>
    </li>
);

const ColumnLabel = ({ children }) => (
    <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/60">{children}</h3>
);

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-16 overflow-hidden">
            {/* Hairline + halo */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--gold)/0.5),transparent)]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[46rem] -translate-x-1/2 rounded-full bg-[hsl(var(--gold)/0.10)] blur-[120px]" />

            {/* Oversized ghost wordmark */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-10 select-none text-center font-display text-[13vw] font-extrabold leading-none tracking-tighter text-white/[0.012] sm:-bottom-14"
            >
                LEETCODE COIN
            </div>

            <div className="container relative pb-10 pt-14">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4"
                >
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <CoinIcon size={26} className="animate-bob" id="footer-coin" />
                            <span className="font-display text-lg font-semibold tracking-tight">
                                LeetCode Coin <span className="text-gradient-gold">Calculator</span>
                            </span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Know the exact day you can claim your reward — simulated coin by coin, right in your browser.
                        </p>
                    </div>

                    <nav>
                        <ColumnLabel>Navigate</ColumnLabel>
                        <ul className="space-y-2.5">
                            {NAVIGATE.map((item) => (
                                <FooterLink key={item.href} {...item} />
                            ))}
                        </ul>
                    </nav>

                    <nav>
                        <ColumnLabel>Connect</ColumnLabel>
                        <ul className="space-y-2.5">
                            {CONNECT.map((item) => (
                                <FooterLink key={item.href} {...item} external />
                            ))}
                        </ul>
                    </nav>
                </motion.div>

                {/* Base line */}
                <div className="mt-14 flex flex-col-reverse items-center gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-between">
                    <p className="text-center text-xs text-muted-foreground/70 sm:text-left">
                        &copy; {year} &middot; Built by {OWNER}. Not affiliated with LeetCode &mdash; estimates only.
                    </p>

                    <a
                        href="#top"
                        className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Back to top
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[hsl(var(--gold)/0.45)]">
                            <ArrowUp className="h-3 w-3" />
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
