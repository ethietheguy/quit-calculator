# Runway Output Redesign Plan v2
**Generated: March 24, 2026**
**Status: Approved direction — ready to implement**

---

## A. Why the Current Output Still Feels Low-Value

The restructure (v1) was the right move. The section order is better, the recommendation has real numbers, the checklist is quantified, and the archetype is demoted. But three things still hold it back:

### 1. There's no downside scenario anywhere.
The output only shows the "expected case" — your runway assuming nothing goes wrong. A real financial planner would show you what happens if the job search takes 9 months instead of 3, or if you hit a $5K emergency in month two. The absence of any stress testing makes the output feel optimistic rather than trustworthy. Sophisticated users notice this, and it's why they wouldn't pay for it.

### 2. The "Bottom Line" is informative but not visceral.
Right now it says things like "You have 10.2 months of runway — not enough for a safe exit." That's a good sentence. But it doesn't create the *feeling* of understanding your situation. Compare: "You have 10.2 months of runway. That means if you quit today, you'd run out of money in January 2027." The date makes it real. The countdown makes it felt. Right now the numbers are abstract — months of runway, dollar targets, gap percentages — but the user's life runs on calendar dates and real months.

### 3. The output still has no artifact quality.
There's no way to save it, share it, download it, or revisit it. It's a screen you scroll through once. Premium tools produce something you keep. A one-page PDF, a "share with partner" link, or even a "copy your plan" button would transform how users perceive the value. Without this, it's still a tool you use and leave, not a plan you own.

---

## B. The Strongest Premium Output Format

**A "Runway Plan" — a dated, personalized decision brief that reads like a one-page financial strategy memo.**

Not an assessment (backward-looking). Not a summary (passive). A *plan* — forward-looking, dated, with your name on it if you gave your email. The mental model: "Your Runway Plan — Generated March 24, 2026."

This is the right format because:
- Plans get saved. Summaries get skimmed.
- Plans get shared with partners. Assessments feel private.
- Plans justify payment. Reflections don't.
- Plans have a shelf life ("revisit this in 90 days"), which creates a reason to return.

The title of the output section should literally say **"Your Runway Plan"** — not "Results" or "Your Assessment."

---

## C. The Ideal Output Hierarchy

### Immediately visible (above any gate):

1. **Your Runway Plan** (header with generated date)
2. **The Bottom Line** — Tier badge + full recommendation sentence + the three key numbers (runway, target, gap) + a "money runs out" calendar date
3. **Your Options, Compared** — Three scenarios with recommendation
4. **What Moves the Needle** — Top 3 levers, quantified

### Gated behind email:

5. **Your Safe Quit Date** — Date + progress bar
6. **Your Floor** (NEW) — Worst-case stress test: "If [variable], your runway drops to X months"
7. **Your 30-Day Checklist** — Quantified actions
8. **Strengths & Risk Flags** — Two columns

### Collapsed / tertiary:

9. **The Deeper Picture** — Archetype + tension (collapsed)
10. **Assumptions & Limits** — (collapsed)

Key change: move the email gate *up one section* so it captures after the comparison table (which creates the "I want to know more" moment) but before the safe quit date and checklist (which are the real premium content). And add a stress test section between safe quit date and checklist.

---

## D. The 5 Highest-Leverage Improvements

### 1. Add a "money runs out" date to Bottom Line
Calculate `new Date()` + runway months, display alongside the number. One line of math, one line of JSX. Instead of just "10.2 months of runway," add: "If you quit today, your savings would last until January 2027."

### 2. Add a "Your Floor" stress-test section
Calculate `floorRunway` with insurance + $3K buffer + 15% cost bump. Display as one comparison line with both dates. Place it after Safe Quit Date, before Checklist.

Present it as a single comparison line:
> **Your floor:** In a tighter scenario — higher insurance costs, unexpected expenses, slower job market — your runway drops from 10.2 to 7.4 months. Money runs out by October 2026 instead of January 2027.

### 3. Upgrade the `getFullRecommendation` copy
Add calendar dates, use "optionality" framing for 12+ months, sharpen the low-runway language.

### 4. Add "Copy your plan" button + date stamp
Format key outputs as clipboard text. Add a generated date to the results header. Implement as clipboard copy first (cheapest), PDF later.

### 5. Move email gate before Safe Quit Date
Shift the gate up one position so users see Bottom Line + Options + Needle Movers for free, then gate the date, floor, checklist, and risks.

---

## E. Voice / Copy Calibration

### Better top-summary copy examples:

**For strong runway (12+ months):**
> "You have 14.2 months of optionality — enough to leave on your terms. Your savings would last until May 2027. The financial question is answered. The remaining question is strategic: what do you want the next chapter to look like?"

**For moderate runway (6-12 months):**
> "You have 6.8 months of runway. If you quit today, your savings last until November 2026. That's enough to be strategic — not enough to be casual. Search while you're employed, and keep building toward your $72,000 target."

**For tight runway (<6 months):**
> "You have 4.1 months of runway. If you quit today, your money runs out by July 2026. That's not enough margin for a clean exit. Your priority right now is the gap: $28,000 to reach 12 months of safety."

### Better "deeper" interpretation copy:

**Burned-Out Achiever with strong runway:**
> "You've earned the right to make this choice from a position of strength. The irony of your situation: the same drive that built your savings is the thing burning you out. The financial math supports a transition — the harder part is giving yourself permission to use the runway you've built."

**Low burnout, low growth:**
> "Your situation isn't urgent, and that's part of the problem. There's no crisis forcing a decision, just a slow erosion of engagement. The risk isn't burning out — it's drifting until the cost of staying becomes invisible."

### Calibration rules:
- Use metaphor once per output, in the summary. Not in every section.
- Numbers should always appear *before* interpretation, never after. Lead with data, close with meaning.
- Never use words like "journey," "transform," "empower," or "unlock." Those are self-help.
- Use "optionality," "margin," "floor," "leverage," "runway" — financial language with emotional undertones.

---

## F. Stress-Test Logic

### The 1 stress test to add first:

A combined "tighter scenario" that adjusts for two realistic risks simultaneously.

Calculate a `floorRunway` that applies:
- Health insurance at $550/month if not covered (already have this data)
- An extra $3,000 in assumed one-time costs (moving, transition expenses, COBRA setup)
- 15% longer job search assumption (add 2 months to any implicit timeline)

Present as a single comparison line, not a whole scenario builder.

**Don't add:** Full scenario sliders, multiple what-if tabs, or Monte Carlo simulations. That's feature bloat. One stress test, clearly labeled, is enough for v1.

---

## G. Micro-Interactions / Polish

1. **"Copy your plan" button** at the top of results. Copies clean text summary: tier, runway, target, gap, safe quit date, recommendation.
2. **Generated date stamp** on the output: "Your Runway Plan · March 24, 2026." Makes it feel like a document, not a screen.
3. **"Money runs out" date** displayed prominently in Bottom Line. Format: "Runway: 10.2 months · through January 2027."
4. **Animate the progress bar** on safe quit date. Subtle 0.5s fill animation when it appears.

**What NOT to add:** Confetti, animated counters, gamification, "achievement" badges, or progress spinners. Those undermine seriousness.

---

## H. Build Order (Implementation Sequence)

1. Add "money runs out" date to Bottom Line
2. Add "Your Floor" stress-test section
3. Upgrade `getFullRecommendation` copy with calendar dates + optionality framing
4. Add "Copy your plan" button + date stamp
5. Move email gate before Safe Quit Date

Each change is self-contained and independently valuable.
