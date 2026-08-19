"use client";

import { motion } from "framer-motion";

const directions = {
    up: { y: 28, x: 0 },
    down: { y: -28, x: 0 },
    left: { x: 32, y: 0 },
    right: { x: -32, y: 0 },
    none: { x: 0, y: 0 },
};

// Scroll-triggered entrance. Runs once so the page doesn't re-animate on scroll-back.
const Reveal = ({ children, delay = 0, direction = "up", className = "", blur = true, ...rest }) => {
    const offset = directions[direction] ?? directions.up;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offset, filter: blur ? "blur(8px)" : "blur(0px)" }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
