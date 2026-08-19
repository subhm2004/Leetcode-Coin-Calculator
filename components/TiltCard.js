"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const spring = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Pointer-reactive 3D tilt. Also publishes --mx / --my so the `.spotlight`
 * class can render a highlight that follows the cursor.
 */
const TiltCard = ({ children, className = "", max = 10, scale = 1.03, ...rest }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);

    const handleMove = (event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        x.set(px - 0.5);
        y.set(py - 0.5);
        node.style.setProperty("--mx", `${px * 100}%`);
        node.style.setProperty("--my", `${py * 100}%`);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            whileHover={{ scale }}
            transition={{ type: "spring", ...spring }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;
