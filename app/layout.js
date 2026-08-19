import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "../styles/globals.css";
import AuroraBackground from "../components/AuroraBackground";
import MotionProvider from "../components/MotionProvider";
import SiteHeader from "../components/SiteHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Resolved from the environment so canonical/OG URLs follow wherever this is
// deployed. Set NEXT_PUBLIC_SITE_URL to pin a custom domain.
const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000");

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: "LeetCode Coin Calculator — turn your streak into swag",
    description:
        "Simulate your LeetCode coin earnings day by day and find the exact date you can redeem the hoodie, kit or premium subscription.",
    keywords: [
        "LeetCode points calculator",
        "LeetCode coin calculator",
        "LeetCoin calculator",
        "LeetCode",
        "LeetCoin",
        "LeetCode points",
        "LeetCode rewards",
        "LeetCode Store",
    ],
    openGraph: {
        title: "LeetCode Coin Calculator",
        description:
            "Simulate your LeetCode coin earnings day by day and find the exact date you can redeem your reward.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "LeetCode Coin Calculator",
        description: "Find the exact date you can redeem your LeetCode reward.",
    },
};

export const viewport = {
    themeColor: "#07070b",
    colorScheme: "dark",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${sora.variable} ${mono.variable}`}
            suppressHydrationWarning
        >
            <body className="min-h-screen bg-background font-sans text-foreground antialiased" suppressHydrationWarning>
                <MotionProvider>
                    <AuroraBackground />
                    <SiteHeader />
                    <div className="relative flex min-h-screen flex-col">
                        <main className="flex-1 w-full">{children}</main>
                    </div>
                </MotionProvider>
                <Analytics />
            </body>
        </html>
    );
}
