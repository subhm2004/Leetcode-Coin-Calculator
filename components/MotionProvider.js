"use client";

import { MotionConfig } from "framer-motion";

// `reducedMotion="user"` makes every motion component follow the OS setting:
// transforms are skipped, opacity still animates so nothing stays invisible.
const MotionProvider = ({ children }) => (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
