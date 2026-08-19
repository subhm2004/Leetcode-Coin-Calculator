<div align="center">

# LeetCode Coin Calculator

**Stop guessing when you can claim that hoodie.**

A day-by-day simulator that tells you the exact calendar date you'll have enough
LeetCoins for any reward in the LeetCode Store.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?style=flat-square&logo=framer&logoColor=white)](https://motion.dev)

</div>

---

## Table of contents

- [What it does](#what-it-does)
- [Features](#features)
- [How the maths works](#how-the-maths-works)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Architecture notes](#architecture-notes)
- [Design system](#design-system)
- [Chart colours](#chart-colours)
- [Shareable links](#shareable-links)
- [Accessibility](#accessibility)
- [Customising](#customising)
- [Git history helper](#git-history-helper)
- [Deployment](#deployment)
- [FAQ](#faq)
- [Credits](#credits)

---

## What it does

Most "coin calculators" divide your target by an average daily rate and call it a day. That
answer is wrong, because LeetCode's rewards don't arrive evenly — contests only run on
certain weekends, and the big streak bonuses only land at month boundaries.

This one **walks the real calendar**, one day at a time, from today until you can afford your
reward. Weekends fall where weekends fall. A biweekly contest only pays out every other
Saturday. The 50-coin perfect-month bonus only lands on the last day of a month you didn't
miss. The result is a date you can actually put in your calendar.

Everything runs in your browser. No backend, no sign-in, no account, nothing leaves your
machine.

---

## Features

### The answer

| | |
|---|---|
| **Four plans, side by side** | Premium, All events, Daily only and Check-in only — each with its day count, target date, and exactly which activities it assumes. |
| **Fastest badge** | The quickest route is highlighted, and result bars are scaled against the slowest plan so the gap is visible, not just numeric. |
| **Live progress** | A circular meter and a "still needed" counter update as you type, before you press anything. |
| **Affordability at a glance** | Every reward card carries a bar showing how close you already are, flipping to an *Affordable* badge once you can claim it. |

### Going deeper

| | |
|---|---|
| **Coins-over-time chart** | Your running balance under each plan, with a dashed goal line. Where a line crosses it, you can redeem. Crosshair tooltip, direct series labels, and a table view. |
| **Unlock order timeline** | Every reward in the store, cheapest first, showing how many days each is away at your current pace. |
| **Live countdown** | A ticking days / hours / minutes / seconds counter to your redeem date. |
| **Shareable links** | *Copy link* encodes your inputs into the URL. *Copy summary* puts a plain-text result on your clipboard. |
| **Remembers you** | Inputs persist to `localStorage`; a shared link always takes priority. |

### The interface

- Dark, gold-accented theme with an animated aurora background and frosted-glass panels
- Pointer-tracked 3D tilt and cursor-following spotlights on reward cards
- Scroll-triggered entrances, animated number count-ups, a self-drawing progress ring
- Confetti when you already have enough coins
- Fully responsive, and **every** animation honours `prefers-reduced-motion`

---

## How the maths works

The simulation starts today and steps forward one day at a time until your balance covers
the reward.

### Where coins come from

| Source | Coins | When |
|---|---|---|
| Daily check-in | **+1** | Every day |
| Daily challenge | **+10** | Every day |
| Weekly contest | **+5** | Sundays |
| Biweekly contest | **+5** | Every other Saturday |
| Double-contest weekend | **+35** | A biweekly Saturday followed by a weekly Sunday |
| 25-day streak bonus | **+25** | 25 daily challenges within one calendar month |
| Perfect month bonus | **+50** | Every daily challenge in a month |
| Premium weekly set | **+10** | Sundays, Premium accounts only |

### The four plans

| Plan | Includes |
|---|---|
| **Premium** | Everything below, plus the premium weekly set |
| **All events** | Daily check-in + daily challenge + weekly and biweekly contests |
| **Daily only** | Daily check-in + daily challenge |
| **Check-in only** | Daily check-in — a flat 1 coin/day |

### Assumptions worth knowing

- **You never miss a day.** Monthly bonuses reset the moment a streak breaks — which is
  exactly why the check-in-only column looks so bleak.
- **Your streak is clamped to today's day-of-month**, since a monthly bonus can't count more
  days than the month has had so far.
- These are estimates. LeetCode can change its reward rules whenever it likes.

---

## Getting started

**Requirements:** Node 18.18 or newer.

```bash
git clone https://github.com/subhm2004/leetcode-coin-calculator.git
cd leetcode-coin-calculator
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `./make_commits.sh` | Seed a clean git history ([details](#git-history-helper)) |

> **Note:** `next dev` and `next build` share the `.next` directory. Stop the dev server
> before running a build, or the dev server will start returning 500s.

---

## Project structure

```
app/
  layout.js              Fonts, metadata, background + header, analytics
  page.js                The single page: hero → calculator → how-it-works → footer
  icon.svg               Favicon (vector, any DPI) — also the source for the others
  favicon.ico            Multi-size fallback (16/32/48)
  apple-icon.png         iOS home-screen icon (180x180)

components/
  Hero.js                Landing headline, animated coin, stat strip
  SiteHeader.js          Floating nav that solidifies on scroll
  Calculator.js          Form, state, URL/localStorage sync, results orchestration
  RewardGrid.js          Selectable reward cards with tilt + affordability bars
  Result.js              One earning-plan result card
  CoinChart.js           Coins-over-time line chart (tooltip, legend, table view)
  UnlockTimeline.js      Every reward, cheapest-first, with days-to-unlock
  Countdown.js           Live ticker to the redeem date
  HowItWorks.js          The coin-economy explainer
  Footer.js              Your links and the disclaimer
  AuroraBackground.js    Fixed animated background layers
  MotionProvider.js      Makes every animation honour prefers-reduced-motion

  # Reusable primitives
  Reveal.js              Scroll-triggered entrance wrapper
  TiltCard.js            Pointer-tracked 3D tilt + spotlight
  CountUp.js             Number tweening that lands exactly on the target
  ProgressRing.js        Self-drawing circular meter
  CoinIcon.js            The LeetCoin SVG

  ui/                    Component primitives (button, card, input, label, select)

lib/
  calculatorSubmission.js  Turns form values into the four plan results
  shareState.js            URL ⇄ form-state round-tripping
  validation.js            Input validation
  useWindowSize.js         Viewport size hook (confetti)
  utils.js                 `cn()` class merger

utils/
  calculator.util.js     The simulation — the only place the coin rules live
  rewards.util.js        The reward catalogue

styles/
  globals.css            Design tokens, glass/spotlight/mesh utilities, keyframes
```

---

## Architecture notes

**One source of truth for the rules.** Every coin rule lives in a single function,
`earnForDay` in [utils/calculator.util.js](utils/calculator.util.js). Two things consume it:

- `simulate` — steps until the target is reached, and returns the day count and date
- `simulateSeries` — steps a fixed horizon and records the running balance for the chart

Because both share that function, the chart can never drift out of sync with the answer.

**State flow.** `Calculator.js` owns everything. Inputs come from `react-hook-form`; the
selected reward is local state. On submit, `lib/calculatorSubmission.js` produces the four
plan results, which fan out to the result cards, the chart, the countdown and the timeline.

**No backend.** The build produces static pages only — there are no API routes and no server
components doing data fetching.

---

## Design system

Tokens live as HSL triples on `:root` in [styles/globals.css](styles/globals.css) and are
consumed through Tailwind, so a colour changes in exactly one place.

| Token | Role |
|---|---|
| `--background` / `--foreground` | Page surface and primary ink |
| `--gold` / `--amber` | Primary brand accent |
| `--cyan` / `--violet` | Secondary accents for gradients and glows |
| `--emerald` / `--rose` | Success and "slow route" signals |
| `--muted-foreground` | Secondary ink |
| `--radius` | Corner radius base |

Reusable classes:

| Class | Effect |
|---|---|
| `.glass` | The frosted panel used for every surface |
| `.spotlight` | Cursor-following highlight (set `--mx` / `--my` on mousemove) |
| `.conic-border` | Animated rotating gradient border |
| `.grid-mesh`, `.noise` | Background texture |
| `.text-gradient-gold` | The shimmering headline treatment |

Fonts load via `next/font/google`: **Sora** (display), **Inter** (body), **JetBrains Mono**.

---

## Chart colours

The chart series colours are deliberately **not** the same values as the card accents. Chart
marks are thin 2px lines on a dark surface, so they were re-stepped into the dark-mode
lightness band (OKLCH L 0.48–0.67) and validated as a set for colour-vision deficiency
separation and contrast.

| Plan | Chart colour |
|---|---|
| Premium | `#985cff` |
| All events | `#02ac6d` |
| Daily only | `#c28100` |
| Check-in only | `#ff2d9b` |

Worst adjacent pair: **ΔE 9.1** under deuteranopia, **19.6** for normal vision, all four above
3:1 contrast on the panel. Identity is never carried by colour alone — the chart ships a
legend, direct end labels and a table view.

If you change these, re-validate rather than eyeballing, and keep the mapping stable: a
colour belongs to a plan, never to its rank.

---

## Shareable links

*Copy link* builds a URL that fully restores the calculator:

```
https://your-deployment.vercel.app/?coins=3200&streak=12&type=premium&reward=hoodie
```

| Param | Values | Notes |
|---|---|---|
| `coins` | integer ≥ 0 | Current balance |
| `streak` | integer ≥ 0 | Clamped to today's day-of-month |
| `type` | `default` \| `premium` | Account type |
| `reward` | a reward `id` | Must exist in [utils/rewards.util.js](utils/rewards.util.js) |

Unknown or malformed values are ignored and fall back to defaults. URL params take priority
over the saved `localStorage` session.

---

## Accessibility

- Reward cards are keyboard-operable (`Tab`, then `Enter`/`Space`) with visible focus rings
  and `aria-pressed` state
- The chart carries a descriptive `aria-label` and a table view of the same data
- Series identity comes from the legend and direct labels, never colour alone
- All motion collapses under `prefers-reduced-motion: reduce`
- Form errors appear in place, next to their input

---

## Customising

### Your links

Profile links live in one block at the top of [components/Footer.js](components/Footer.js):

```js
const OWNER = "Shubham Malik";

const CONNECT = [
    { href: "https://github.com/subhm2004", label: "GitHub" },
    // ...
];
```

### Rewards

1. Edit [utils/rewards.util.js](utils/rewards.util.js).
2. Add or update an entry:

| Field | Meaning |
|---|---|
| `id` | Unique string — also the value used in share links |
| `name` | Display name |
| `subtitle` | Short description |
| `coins` | Required coins (number) |
| `image` | Image URL — inspect the image on the LeetCode Store and copy its source |

New image hosts must be added to `images.remotePatterns` in
[next.config.js](next.config.js), or `next/image` will refuse to load them.

### Coin rules

All rules live in `earnForDay` in [utils/calculator.util.js](utils/calculator.util.js). If you
change it, also update:

1. The summary cards in [components/HowItWorks.js](components/HowItWorks.js)
2. The [coin table](#where-coins-come-from) above

---

## Git history helper

`make_commits.sh` seeds a clean, logical git history instead of one giant initial commit.

```bash
./make_commits.sh --dry-run   # preview, changes nothing
./make_commits.sh             # create the commits
```

- Runs `git init` if there's no repo yet
- **Idempotent** — running it twice is a no-op
- Never pushes, never forces, never touches a remote
- Stops with instructions if `git user.email` isn't configured

---

## Deployment

The build is static and deploys to Vercel with no configuration. Any host that runs
`next build` / `next start` works equally well.

Canonical and Open Graph URLs resolve from the environment: on Vercel they follow the
deployment automatically, or set `NEXT_PUBLIC_SITE_URL` to pin a custom domain.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`@vercel/analytics` is included; off Vercel its script 404s harmlessly, or you can remove the
`<Analytics />` tag in [app/layout.js](app/layout.js).

---

## FAQ

**Why is my date different from other calculators?**
Most divide by an average daily rate. This one walks the real calendar, so contest weekends
and month-end bonuses land on the days they actually would.

**Why does "check-in only" say 35 years?**
Because it's 1 coin a day with no challenge, no contests and no bonuses. That column exists
to show what you're giving up.

**Does it account for missed days?**
No — every plan assumes a perfect streak. Miss a day and the monthly bonuses reset, so treat
the dates as a best case.

**Is my data sent anywhere?**
No. The whole simulation runs in your browser, and your inputs only ever go to `localStorage`.

**The dev server started returning 500s.**
You probably ran `npm run build` while `npm run dev` was running — they share `.next`. Stop
both, `rm -rf .next`, and start again.

---

## Credits

Built by **[Shubham Malik](https://shubhammalik1.vercel.app)**.

[GitHub](https://github.com/subhm2004) ·
[LinkedIn](https://www.linkedin.com/in/shubham04012003) ·
[LeetCode](https://leetcode.com/u/subhm2003) ·
[Portfolio](https://shubhammalik1.vercel.app)

Based on the original [LeetCoin Calculator](https://github.com/KevzPeter/LeetCoin-Calculator)
by KevzPeter.

---

<div align="center">
<sub>Not affiliated with LeetCode. Estimates only — reward rules can change at any time.</sub>
</div>
