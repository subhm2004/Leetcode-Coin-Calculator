"use client";

import CoinIcon from "./CoinIcon";

// Deterministic so server and client markup match — no Math.random() here.
const FLOATERS = [
    { left: "6%", top: "18%", size: 26, delay: "0s", duration: "9s", opacity: 0.22 },
    { left: "18%", top: "62%", size: 16, delay: "1.4s", duration: "11s", opacity: 0.16 },
    { left: "31%", top: "12%", size: 20, delay: "2.8s", duration: "8s", opacity: 0.18 },
    { left: "47%", top: "78%", size: 30, delay: "0.7s", duration: "12s", opacity: 0.14 },
    { left: "63%", top: "24%", size: 18, delay: "3.6s", duration: "10s", opacity: 0.2 },
    { left: "79%", top: "58%", size: 24, delay: "2.1s", duration: "9.5s", opacity: 0.17 },
    { left: "88%", top: "16%", size: 14, delay: "4.2s", duration: "13s", opacity: 0.15 },
    { left: "92%", top: "80%", size: 22, delay: "1.1s", duration: "10.5s", opacity: 0.13 },
];

const AuroraBackground = () => {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* Base wash */}
            <div className="absolute inset-0 bg-background" />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 80% at 50% -10%, hsl(var(--gold) / 0.16), transparent 55%), radial-gradient(90% 60% at 12% 8%, hsl(var(--violet) / 0.14), transparent 60%), radial-gradient(80% 60% at 88% 22%, hsl(var(--cyan) / 0.10), transparent 60%)",
                }}
            />

            {/* Drifting aurora blobs */}
            <div className="absolute -left-40 -top-32 h-[38rem] w-[38rem] rounded-full bg-[hsl(var(--gold)/0.22)] blur-[130px] animate-float-slow" />
            <div
                className="absolute -right-40 top-24 h-[34rem] w-[34rem] rounded-full bg-[hsl(var(--violet)/0.20)] blur-[130px] animate-float-slow"
                style={{ animationDelay: "-7s" }}
            />
            <div
                className="absolute bottom-[-14rem] left-1/3 h-[40rem] w-[40rem] rounded-full bg-[hsl(var(--cyan)/0.14)] blur-[150px] animate-float-slow"
                style={{ animationDelay: "-14s" }}
            />

            {/* Structure */}
            <div className="absolute inset-0 grid-mesh" />

            {/* Slow horizontal scan line */}
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--gold)/0.55),transparent)] animate-scan" />

            {/* Floating coins */}
            {FLOATERS.map((f, i) => (
                <div
                    key={i}
                    className="absolute animate-float"
                    style={{
                        left: f.left,
                        top: f.top,
                        animationDelay: f.delay,
                        animationDuration: f.duration,
                        opacity: f.opacity,
                    }}
                >
                    <CoinIcon size={f.size} />
                </div>
            ))}

            {/* Grain + vignette */}
            <div className="absolute inset-0 noise opacity-[0.035] mix-blend-overlay" />
            <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(110% 90% at 50% 45%, transparent 40%, hsl(240 25% 2% / 0.75) 100%)" }}
            />
        </div>
    );
};

export default AuroraBackground;
