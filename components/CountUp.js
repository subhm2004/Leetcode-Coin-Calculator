"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

const defaultFormat = (n) => Math.round(n).toLocaleString();

// Tweens the rendered text toward `value`, landing exactly on it.
const CountUp = ({ value, duration = 1.3, delay = 0, className = "", format = defaultFormat }) => {
    const ref = useRef(null);
    const from = useRef(0);

    // Held in a ref so an inline `format` prop doesn't restart the tween every render.
    const formatRef = useRef(format);
    formatRef.current = format;

    const inView = useInView(ref, { once: true, margin: "-40px" });

    useEffect(() => {
        if (!inView) return;
        const node = ref.current;
        if (!node) return;

        const target = Number(value) || 0;

        const controls = animate(from.current, target, {
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                // Track the on-screen value so an interrupted tween resumes smoothly.
                from.current = v;
                node.textContent = formatRef.current(v);
            },
            onComplete: () => {
                // Easing can stop a hair short — pin the exact figure.
                from.current = target;
                node.textContent = formatRef.current(target);
            },
        });

        return () => controls.stop();
    }, [value, inView, duration, delay]);

    return (
        <span ref={ref} className={className}>
            {formatRef.current(0)}
        </span>
    );
};

export default CountUp;
