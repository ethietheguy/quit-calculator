"use client";

import React from "react";

type RiskLevel = "Low" | "Moderate" | "High";

type RecommendedPath =
  | "Stay and improve"
  | "Search while employed"
  | "Build more runway before quitting"
  | "Consider taking a break or quitting";

type Archetype =
  | "Burned-Out Achiever"
  | "Trapped Professional"
  | "Restless Optimizer"
  | "Early Career Crisis"
  | "Comfortable Drifter"
  | "None";

type BurnoutDriver =
  | "Workload / hours"
  | "Lack of meaning"
  | "Toxic culture"
  | "Lack of growth"
  | "Compensation mismatch"
  | "Not sure";

function getCareerTimingPerspective(age: number | ""): string | null {
  const a = typeof age === "number" ? age : parseFloat(String(age || "0"));
  if (!Number.isFinite(a) || a < 18) return null;

  if (a <= 27) {
    return "In your mid‑twenties, questioning your career direction is very common. Many people are still experimenting with roles, industries, and work styles. What feels like a crisis is often a normal part of figuring out what actually fits.";
  }
  if (a <= 31) {
    return "The late twenties and early thirties are a frequent time for reassessment. By now you have enough experience to know what drains you and what you want more of, but it can still feel like you are behind. That feeling is common; it does not mean you have failed.";
  }
  if (a <= 35) {
    return "The early‑to‑mid‑thirties often bring a more deliberate phase of career reflection. Pivots and shifts are still normal at this stage, and many people make meaningful changes without starting over. The path does not have to be linear.";
  }
  return "Beyond the mid‑thirties, career changes and reassessment remain common. Your accumulated experience and clarity about what you do and do not want can make this a more intentional, rather than reactive, time to adjust. There is no cutoff age for rethinking your path.";
}

function getFinancialRisk(runway: number): RiskLevel {
  if (runway >= 12) return "Low";
  if (runway >= 6) return "Moderate";
  return "High";
}

function getBurnoutLevel(burnoutScore: number): RiskLevel {
  if (burnoutScore >= 7) return "High";
  if (burnoutScore >= 4.5) return "Moderate";
  return "Low";
}

function getArchetype(
  burnoutScore: number,
  satisfaction: number,
  growth: number,
  runway: number,
  financialRisk: RiskLevel
): Archetype {
  const highBurnout = burnoutScore >= 7;
  const lowBurnout = burnoutScore < 4.5;
  const moderateBurnout = !highBurnout && !lowBurnout; // between 4.5 and 7
  const strongRunway = runway >= 12 || financialRisk === "Low";
  const weakRunway = runway < 6 || financialRisk === "High";
  const lowSatisfaction = satisfaction <= 4;
  const lowGrowth = growth <= 4;

  // Early Career Crisis: low satisfaction + low growth + moderate burnout.
  if (lowSatisfaction && lowGrowth && moderateBurnout) {
    return "Early Career Crisis";
  }

  // Burned-Out Achiever: high burnout + strong runway.
  if (highBurnout && strongRunway) {
    return "Burned-Out Achiever";
  }

  // Trapped Professional: high burnout + weak runway.
  if (highBurnout && weakRunway) {
    return "Trapped Professional";
  }

  // Restless Optimizer: low burnout but low satisfaction or growth.
  if (lowBurnout && (lowSatisfaction || lowGrowth)) {
    return "Restless Optimizer";
  }

  // Comfortable Drifter: low burnout but also low growth.
  if (lowBurnout && lowGrowth) {
    return "Comfortable Drifter";
  }

  return "None";
}

function getRecommendedPath(
  financialRisk: RiskLevel,
  burnoutLevel: RiskLevel,
  runway: number
): RecommendedPath {
  if (burnoutLevel === "High" && financialRisk === "Low") {
    return "Consider taking a break or quitting";
  }

  if (burnoutLevel === "High" && financialRisk === "Moderate") {
    return "Search while employed";
  }

  if (burnoutLevel === "High" && financialRisk === "High") {
    return "Build more runway before quitting";
  }

  if (burnoutLevel === "Moderate" && financialRisk !== "High") {
    return "Search while employed";
  }

  if (burnoutLevel === "Moderate" && financialRisk === "High") {
    return "Build more runway before quitting";
  }

  // Low burnout
  if (financialRisk === "High" && runway < 3) {
    return "Build more runway before quitting";
  }

  if (financialRisk === "Low" && burnoutLevel === "Low") {
    return "Search while employed";
  }

  return "Stay and improve";
}

function getHeadline(path: RecommendedPath): string {
  switch (path) {
    case "Stay and improve":
      return "Staying is reasonable — focus on making this role better.";
    case "Search while employed":
      return "Keep your income while you explore better options.";
    case "Build more runway before quitting":
      return "Your first job is shoring up your safety net.";
    case "Consider taking a break or quitting":
      return "You may be ready to step away, at least for a while.";
  }
}

type Strategy = "Reset" | "Search while employed" | "Career pivot" | "Stay and optimize";

function getStrategy(path: RecommendedPath): Strategy {
  switch (path) {
    case "Consider taking a break or quitting":
      return "Reset";
    case "Search while employed":
      return "Search while employed";
    case "Build more runway before quitting":
      return "Career pivot";
    case "Stay and improve":
      return "Stay and optimize";
  }
}

type TrajectoryLabel = "Compounding" | "Plateauing" | "Declining";

function getCareerTrajectory(satisfaction: number, growth: number): {
  label: TrajectoryLabel;
  interpretation: string;
} {
  const score = satisfaction + growth; // 2–20
  if (score >= 14) {
    return {
      label: "Compounding",
      interpretation:
        "Your satisfaction and growth scores suggest you are building momentum. The main tension may be sustainability or fit rather than trajectory.",
    };
  }
  if (score >= 8) {
    return {
      label: "Plateauing",
      interpretation:
        "Your scores point to a plateau — not a crisis, but a signal to be more intentional about what comes next and where you want to grow.",
    };
  }
  return {
    label: "Declining",
    interpretation:
      "Low satisfaction and growth together suggest a declining trajectory. This deserves attention rather than being pushed aside indefinitely.",
  };
}

function getBurnoutDriverInsight(burnoutDriver: BurnoutDriver): string | null {
  switch (burnoutDriver) {
    case "Lack of meaning":
      return "Given that meaning is a key driver, the core question may be career alignment — what work actually connects to what you care about.";
    case "Workload / hours":
      return "With workload driving burnout, the levers are often role boundaries, scope, or a company change rather than mindset alone.";
    case "Toxic culture":
      return "When the environment is corrosive, changing jobs or teams can matter more than fixing your response to it.";
    case "Lack of growth":
      return "Trajectory concerns are central here — feeling underused or stalled often needs stretch roles, learning, or a deliberate pivot.";
    case "Compensation mismatch":
      return "Money misalignment blends practical strain with questions of fairness; clarifying needs and market value can clarify next steps.";
    default:
      return null;
  }
}

function getDecisionConfidence(
  archetype: Archetype,
  financialRisk: RiskLevel,
  burnoutLevel: RiskLevel,
  path: RecommendedPath,
  runway: number
): { level: "High" | "Medium" | "Low"; explanation: string } {
  const signalsAlign =
    archetype !== "None" &&
    ((path === "Consider taking a break or quitting" && financialRisk === "Low" && burnoutLevel === "High") ||
      (path === "Build more runway before quitting" && financialRisk === "High") ||
      (path === "Search while employed" && (financialRisk === "Low" || financialRisk === "Moderate")) ||
      (path === "Stay and improve" && burnoutLevel === "Low"));

  const runwaySupports =
    (path === "Consider taking a break or quitting" && runway >= 12) ||
    (path === "Build more runway before quitting" && runway < 6) ||
    (path === "Search while employed" && runway >= 3) ||
    (path === "Stay and improve");

  if (signalsAlign && runwaySupports) {
    return {
      level: "High",
      explanation: "Your inputs point in a consistent direction; the recommendation reflects strong alignment between burnout, finances, and trajectory.",
    };
  }
  if (archetype === "None" || (!signalsAlign && !runwaySupports)) {
    return {
      level: "Low",
      explanation: "Signals are mixed or incomplete. Use this as a starting point and gather more input from people who know your situation.",
    };
  }
  return {
    level: "Medium",
    explanation: "Some signals align; others are less clear. The recommendation is a reasonable default, but your judgement matters.",
  };
}

function getNormalizationParagraph(age: number | ""): string | null {
  const a = typeof age === "number" ? age : parseFloat(String(age || "0"));
  if (!Number.isFinite(a) || a < 24 || a > 35) return null;
  return "Career reassessment in the late twenties and early thirties is common; you are not alone in questioning your path.";
}

function getSituationSummary(
  runway: number,
  burnoutScore: number,
  financialRisk: RiskLevel,
  burnoutLevel: RiskLevel,
  path: RecommendedPath,
  archetype: Archetype
): string {
  const runwayText =
    runway <= 0
      ? "Right now, the tool cannot see a clear financial runway because monthly expenses are zero or missing."
      : `You have about ${runway.toFixed(
          1
        )} months of runway based on what you entered.`;

  const burnoutText = `Your burnout score is ${burnoutScore.toFixed(
    1
  )} out of 10, which this tool treats as ${burnoutLevel.toLowerCase()} burnout.`;

  const riskText = `Financially, this looks like ${financialRisk.toLowerCase()} risk.`;

  const archetypeText =
    archetype !== "None"
      ? ` In this rough framework you look most like a “${archetype}”.`
      : "";

  if (path === "Consider taking a break or quitting") {
    return `${runwayText} ${burnoutText} ${riskText}${archetypeText} Together, that suggests you have enough buffer to seriously consider stepping away if that aligns with your values and support system.`;
  }

  if (path === "Build more runway before quitting") {
    return `${runwayText} ${burnoutText} ${riskText}${archetypeText} That points to focusing on stability first so that any exit is on your terms, not forced by money stress.`;
  }

  if (path === "Search while employed") {
    return `${runwayText} ${burnoutText} ${riskText}${archetypeText} That mix often pairs well with keeping your current income while you quietly explore roles that fit you better.`;
  }

  // Stay and improve
  return `${runwayText} ${burnoutText} ${riskText}${archetypeText} Given that, this tool leans toward improving your current situation before making any drastic moves.`;
}

function getCareerHealthLabel(score: number): "Strong trajectory" | "Plateau" | "Declining" {
  if (score >= 10) return "Strong trajectory";
  if (score >= 4) return "Plateau";
  return "Declining";
}

function getCareerHealthExplanation(score: number, label: string): string {
  if (label === "Strong trajectory") {
    return `Your career health score is ${score.toFixed(
      1
    )}, which suggests you are generally moving in a good direction even if certain days feel heavy.`;
  }

  if (label === "Plateau") {
    return `Your career health score is ${score.toFixed(
      1
    )}, which looks like a plateau — not a crisis, but a signal to be more intentional about what comes next.`;
  }

  // Declining
  return `Your career health score is ${score.toFixed(
    1
  )}, which points to a declining trajectory that deserves attention rather than being pushed aside indefinitely.`;
}

function getArchetypeExplanation(archetype: Archetype): string {
  switch (archetype) {
    case "Burned-Out Achiever":
      return "You have pushed hard and built financial options, but your current pace and load are no longer sustainable.";
    case "Trapped Professional":
      return "You feel overextended at work while money still feels tight, which can make every choice feel higher stakes.";
    case "Restless Optimizer":
      return "Things are stable enough, but the work itself is not satisfying your curiosity, ambition, or values.";
    case "Early Career Crisis":
      return "You are early in your career, but the mix of burnout, low satisfaction, and stalled growth is asking for a reset in direction or support.";
    case "Comfortable Drifter":
      return "Day to day feels manageable, yet growth is muted, and it may be time to engage more intentionally with where you are heading.";
    case "None":
    default:
      return "You do not cleanly match one profile, which is normal — use this as a starting point for reflection, not a label.";
  }
}

function getNextSteps(path: RecommendedPath, archetype: Archetype, runway?: number): string[] {
  if (path === "Consider taking a break or quitting") {
    if (runway !== undefined && runway > 14) {
      return [
        `You have ${runway.toFixed(1)} months of runway. Money isn't your constraint right now — clarity is.`,
      ];
    }

    if (archetype === "Burned-Out Achiever") {
      return [
        "Name the specific ways achievement has been running your life and what a healthier version would look like.",
        "Sketch a simple 3–6 month break or downshift plan that protects your finances and your nervous system.",
        "Share that draft with one grounded friend or mentor and invite honest feedback on risks and blind spots.",
      ];
    }

    return [
      "List your non‑negotiables for your next chapter: health, rest, learning, or something else.",
      "Run a simple budget with your runway to decide how long a break could realistically last.",
      "Talk to one trusted person who knows you well and can help you reality‑check this move.",
    ];
  }

  if (path === "Build more runway before quitting") {
    if (archetype === "Trapped Professional") {
      return [
        "Clarify the minimum financial runway that would make you feel meaningfully less trapped.",
        "Identify one or two realistic levers (spend less, earn more, change location) and attach rough numbers to each.",
        "Set a modest, time‑bound plan (for example 6–12 months) to move toward that target while you gather support.",
      ];
    }

    return [
      "Tighten or reorganize your monthly expenses so that each dollar has a clear job.",
      "Decide on a target runway (for example 6–12 months) and calculate the gap from today.",
      "Explore ways to increase income or savings while keeping your current role as stable as possible.",
    ];
  }

  if (path === "Search while employed") {
    if (archetype === "Restless Optimizer") {
      return [
        "Write down what “a better chapter” means in concrete terms: skills, environments, impact, and compensation.",
        "Identify 5–10 roles or companies that genuinely fit that picture, not just what your peers are doing.",
        "Schedule recurring, protected time each week for low‑pressure exploration, conversations, and applications.",
      ];
    }

    return [
      "Write a short, honest description of what is and is not working in your current role.",
      "Refresh your resume and LinkedIn to highlight work you actually enjoyed doing.",
      "Block quiet time each week for networking, outreach, or low‑pressure applications.",
    ];
  }

  // Stay and improve
  if (archetype === "Early Career Crisis") {
    return [
      "Separate short‑term survival from long‑term direction: write down what you need from the next 12 months versus the next 5 years.",
      "Talk with someone a few years ahead of you about how their early career unfolded, including detours and wrong turns.",
      "Choose one small, low‑risk experiment at work or outside of it that moves you toward work that feels more like you.",
    ];
  }

  return [
    "Identify the 2–3 specific frictions at work that drain you the most today.",
    "Schedule one conversation (manager, mentor, or peer) about changing scope, support, or expectations.",
    "Experiment with small boundaries or routines for 2–4 weeks, then reassess how you feel.",
  ];
}

function getRealityCheck(
  archetype: Archetype,
  careerHealthLabel: string,
  financialRisk: RiskLevel,
  burnoutDriver: BurnoutDriver
): string {
  const base =
    "This tool can surface patterns, but it cannot see your full life, identity, or responsibilities.";

  if (burnoutDriver === "Toxic culture") {
    return `${base} When the environment itself is corrosive, changing jobs or teams can matter more than fixing your mindset. It is reasonable to prioritise safer, healthier contexts over staying to prove you can endure more.`;
  }

  if (burnoutDriver === "Lack of meaning") {
    return `${base} If meaning is the main source of friction, you may need more than tweaks to hours or tasks. Treat this as a nudge to experiment toward work that feels more connected to what you care about.`;
  }

  if (burnoutDriver === "Workload / hours") {
    return `${base} Chronic overwork can make everything feel more fragile than the numbers alone suggest. Even small experiments with boundaries, pacing, or scope can shift how sustainable this role feels.`;
  }

  if (burnoutDriver === "Lack of growth") {
    return `${base} Feeling underused or stalled is a common mid‑career tension. You do not have to burn everything down to restart; steady bets on learning, projects, and stretch roles compound over time.`;
  }

  if (burnoutDriver === "Compensation mismatch") {
    return `${base} Money misalignment often blends practical strain with questions of fairness and self‑worth. Clarifying your real needs and market value can help you negotiate, search, or redesign your path with more confidence.`;
  }

  if (archetype === "Early Career Crisis") {
    return `${base} Early‑career turbulence is common, even when it feels intensely personal. You have time to course‑correct, and small, thoughtful moves compound more than dramatic swings made in panic.`;
  }

  if (archetype === "Burned-Out Achiever") {
    return `${base} If achievement has been your main compass so far, it makes sense that slowing down feels risky. You are allowed to choose a version of success that protects your health, even if that looks different from your peers.`;
  }

  if (archetype === "Trapped Professional") {
    return `${base} Feeling trapped is often a sign that money and identity have become tightly linked. You do not need to solve everything this month; steadily improving your options is still real progress.`;
  }

  if (archetype === "Restless Optimizer") {
    return `${base} Restlessness can be a healthy signal that you are ready for more depth or alignment, not a guarantee that you picked the wrong path. Treat this as data to design your next chapter, not as a verdict on the last one.`;
  }

  if (careerHealthLabel === "Strong trajectory") {
    return `${base} The numbers here suggest you are more resourced than your inner critic might admit. It is okay to make changes from a place of strength rather than waiting for a crisis.`;
  }

  if (careerHealthLabel === "Declining") {
    return `${base} A declining trajectory does not mean you have failed; it means your current setup is not sustainable as‑is. Reaching out early for support is a strength, not a weakness.`;
  }

  return `${base} Whatever you decide, try to move in conversation with people you trust and at a pace your finances can realistically support.`;
}

export default function Home() {
  const [savings, setSavings] = React.useState<number | "">("");
  const [expenses, setExpenses] = React.useState<number | "">("");
  const [severance, setSeverance] = React.useState<number | "">("");
  const [income, setIncome] = React.useState<number | "">("");
  const [burnout, setBurnout] = React.useState(5);
  const [satisfaction, setSatisfaction] = React.useState(5);
  const [growth, setGrowth] = React.useState(5);
  const parsedSavings = typeof savings === "number" ? savings : parseFloat(savings || "0");
  const parsedExpenses = typeof expenses === "number" ? expenses : parseFloat(expenses || "0");
  const parsedSeverance = typeof severance === "number" ? severance : parseFloat(severance || "0");
  const parsedIncome = typeof income === "number" ? income : parseFloat(income || "0");

  const runway =
    parsedExpenses > 0 ? (parsedSavings + parsedSeverance) / parsedExpenses : 0;

  const monthlySurplus = parsedIncome - parsedExpenses;
  const runwayStay3 = parsedExpenses > 0 ? (parsedSavings + parsedSeverance + Math.max(0, monthlySurplus) * 3) / parsedExpenses : 0;
  const runwayStay6 = parsedExpenses > 0 ? (parsedSavings + parsedSeverance + Math.max(0, monthlySurplus) * 6) / parsedExpenses : 0;

  const burnoutScore =
    (burnout + (10 - satisfaction) + (10 - growth)) / 3;

  const financialRisk = getFinancialRisk(runway);
  const burnoutLevel = getBurnoutLevel(burnoutScore);
  const archetype = getArchetype(burnoutScore, satisfaction, growth, runway, financialRisk);
  const careerHealthScore = satisfaction + growth - burnout;
  const careerHealthLabel = getCareerHealthLabel(careerHealthScore);
  const careerHealthExplanation = getCareerHealthExplanation(
    careerHealthScore,
    careerHealthLabel
  );
  const recommendedPath = getRecommendedPath(financialRisk, burnoutLevel, runway);
  const headline = getHeadline(recommendedPath);
  const situationSummary = getSituationSummary(
    runway,
    burnoutScore,
    financialRisk,
    burnoutLevel,
    recommendedPath,
    archetype
  );
  const nextSteps = getNextSteps(recommendedPath, archetype, runway);
  const strategy = getStrategy(recommendedPath);
  const careerTrajectory = getCareerTrajectory(satisfaction, growth);
  const burnoutDriverInsight = getBurnoutDriverInsight("Not sure");
  const decisionConfidence = getDecisionConfidence(
    archetype,
    financialRisk,
    burnoutLevel,
    recommendedPath,
    runway
  );
  const normalizationParagraph = getNormalizationParagraph("");
  const careerTimingPerspective = getCareerTimingPerspective("");

  const whyParts: string[] = [situationSummary];
  if (burnoutDriverInsight) whyParts.push(burnoutDriverInsight);
  if (careerTimingPerspective) whyParts.push(careerTimingPerspective);
  const fullWhyParagraph = whyParts.join(" ");
  const whyParagraph = fullWhyParagraph
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ");

  const financialColorClasses =
    financialRisk === "Low"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : financialRisk === "Moderate"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  const burnoutColorClasses =
    burnoutLevel === "Low"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : burnoutLevel === "Moderate"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-rose-200 bg-rose-50 text-rose-800";
  const hasFinancialInputs = parsedExpenses > 0;
  const runwayColor =
    !runway || !Number.isFinite(runway)
      ? "text-zinc-900"
      : runway > 18
      ? "text-emerald-600"
      : runway >= 6
      ? "text-amber-600"
      : "text-rose-600";
  const burnoutColor =
    burnoutScore > 7
      ? "text-rose-600"
      : burnoutScore >= 4
      ? "text-amber-600"
      : "text-emerald-600";

  const scenarioColors = (months: number) =>
    !months || !Number.isFinite(months)
      ? "text-zinc-900"
      : months > 18
      ? "text-emerald-600"
      : months >= 6
      ? "text-amber-600"
      : "text-rose-600";

  const [copied, setCopied] = React.useState(false);

  const handleShareProfile = async () => {
    const profileLabel =
      archetype === "None" ? "No clear single profile" : archetype;

    const runwayText =
      runway && Number.isFinite(runway)
        ? `${runway.toFixed(1)} months of runway`
        : "runway not yet calculated";

    const shareText = [
      "My Exit Profile from The Exit Calculator:",
      profileLabel,
      `Career health: ${careerHealthLabel}`,
      `Runway: ${runwayText}`,
      `Burnout: ${burnoutScore.toFixed(1)}/10`,
      `Recommended next move: ${recommendedPath}`,
    ].join(" | ");

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-7 font-sans text-zinc-900">
      <main className="w-full max-w-4xl rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-zinc-200 backdrop-blur-sm sm:p-7">
        <header className="mb-7 text-center sm:mb-8">
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">
            The Quit Calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            A clear-eyed look at your finances, burnout, and next move.
          </p>
        </header>

        <section className="grid gap-7 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Liquid savings
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={savings}
                  onChange={(e) => setSavings(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-2 text-sm text-zinc-900 shadow-inner outline-none ring-0 transition focus:border-zinc-400 focus:bg-white"
                  placeholder="Total liquid savings you could use if you left"
                />
              </div>
              <p className="text-xs text-gray-400">
                Cash or cash‑like savings you can safely tap to support yourself between roles.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Monthly living costs
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-2 text-sm text-zinc-900 shadow-inner outline-none ring-0 transition focus:border-zinc-400 focus:bg-white"
                  placeholder="Rent, food, insurance, debt, and basics"
                />
              </div>
              <p className="text-xs text-gray-400">
                Use an honest average of the bills you truly need to cover each month.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Monthly take-home pay
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={income}
                  onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-2 text-sm text-zinc-900 shadow-inner outline-none ring-0 transition focus:border-zinc-400 focus:bg-white"
                  placeholder="e.g. 6,200"
                />
              </div>
              <p className="text-xs text-gray-400">
                Your net monthly income after taxes and deductions.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Severance (optional)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={severance}
                  onChange={(e) =>
                    setSeverance(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-2 text-sm text-zinc-900 shadow-inner outline-none ring-0 transition focus:border-zinc-400 focus:bg-white"
                  placeholder="Any one‑time payout if you left, can be 0"
                />
              </div>
              <p className="text-xs text-gray-400">
                Include only what you are reasonably confident you would receive.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-700">
                  Burnout level{" "}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700">
                    {burnout}/10
                  </span>
                </p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={burnout}
                  onChange={(e) => setBurnout(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <p className="text-xs text-gray-400">
                  1 = deeply rested, 10 = completely depleted
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-700">
                  Job satisfaction{" "}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700">
                    {satisfaction}/10
                  </span>
                </p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={satisfaction}
                  onChange={(e) => setSatisfaction(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <p className="text-xs text-gray-400">
                  1 = misaligned and draining, 10 = energising and meaningful
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-700">
                  Growth at work{" "}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700">
                    {growth}/10
                  </span>
                </p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={growth}
                  onChange={(e) => setGrowth(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <p className="text-xs text-gray-400">
                  1 = stuck and underused, 10 = learning and compounding
                </p>
              </div>
            </div>

          </div>

          {hasFinancialInputs ? (
            <aside className="sticky top-8 self-start space-y-4 rounded-2xl bg-zinc-50/80 p-4 ring-1 ring-zinc-200 sm:p-5">
              <section className="rounded-xl bg-zinc-100/90 px-3 py-3 ring-1 ring-zinc-200/80">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Your Exit Profile
                </h2>
                <p className="mt-1.5 text-2xl font-bold text-zinc-900">
                  {archetype === "None" ? "No clear single profile" : archetype}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                  {getArchetypeExplanation(archetype)}
                </p>
                <button
                  type="button"
                  onClick={handleShareProfile}
                  className="mt-2 inline-flex items-center rounded-md border border-zinc-200 bg-transparent px-2 py-0.5 text-sm text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-100/50 hover:text-zinc-700"
                >
                  Share my exit profile
                </button>
                {copied && (
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Copied to clipboard.
                  </p>
                )}
              </section>

              <section className="space-y-2 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Snapshot
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Runway
                    </p>
                    <p className={`mt-0.5 text-xl font-semibold ${runwayColor}`}>
                      {runway ? runway.toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-gray-400">months</p>
                  </div>

                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Burnout score
                    </p>
                    <p className={`mt-0.5 text-xl font-semibold ${burnoutColor}`}>
                      {burnoutScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-400">out of 10</p>
                  </div>
                </div>

                <div className="grid gap-1.5 text-xs sm:grid-cols-2">
                  <div
                    className={`flex items-center justify-between rounded-full border px-3 py-1.5 ${financialColorClasses}`}
                  >
                    <span className="font-medium">Financial risk</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      {financialRisk}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between rounded-full border px-3 py-1.5 ${burnoutColorClasses}`}
                  >
                    <span className="font-medium">Burnout level</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      {burnoutLevel}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-2 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Scenarios
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Quit now
                    </p>
                    <p className={`mt-0.5 text-lg font-semibold ${scenarioColors(runway)}`}>
                      {runway ? runway.toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-gray-400">months</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Stay 3 mo.
                    </p>
                    <p className={`mt-0.5 text-lg font-semibold ${scenarioColors(runwayStay3)}`}>
                      {runwayStay3 ? runwayStay3.toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-gray-400">months</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Stay 6 mo.
                    </p>
                    <p className={`mt-0.5 text-lg font-semibold ${scenarioColors(runwayStay6)}`}>
                      {runwayStay6 ? runwayStay6.toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-gray-400">months</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Assumes you save the difference between income and costs each month.
                </p>
              </section>

              <section className="space-y-2 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Career trajectory
                </h3>
                <p className="text-xs font-medium text-zinc-800">
                  {careerTrajectory.label}
                </p>
                <p className="text-xs leading-relaxed text-zinc-600">
                  {careerTrajectory.interpretation}
                </p>
              </section>

              <section className="space-y-2 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Best next move
                </h3>
                <p className="text-xs font-medium text-zinc-500">
                  Strategy: {strategy}
                </p>
                <p className="text-sm font-medium leading-relaxed text-zinc-900">
                  {headline}
                </p>
                <p className="text-xs leading-relaxed text-zinc-600">
                  {whyParagraph}
                </p>
                {normalizationParagraph && (
                  <p className="text-xs leading-relaxed text-gray-400 italic">
                    {normalizationParagraph}
                  </p>
                )}
              </section>

              <section className="space-y-1 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Decision confidence
                </h3>
                <p className="text-xs leading-relaxed text-zinc-600">
                  {decisionConfidence.level}: {decisionConfidence.explanation}
                </p>
              </section>

              <section className="space-y-2 border-t border-dashed border-zinc-200 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Suggested next steps
                </h3>
                <ul className="space-y-1.5 text-xs leading-relaxed text-zinc-600">
                  {nextSteps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="border-t border-dashed border-zinc-200 pt-3 text-[11px] leading-relaxed text-gray-400">
                This tool is a first‑pass decision aid. It does not account for taxes, health
                insurance, dependents, or the job market. Use it as one input alongside people you
                trust, your own judgement, and, if needed, professional advice.
              </p>

              <button
                type="button"
                onClick={handleShareProfile}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
              >
                Share my result
              </button>
            </aside>
          ) : (
            <aside className="sticky top-8 flex items-center justify-center self-start rounded-2xl bg-zinc-50/80 p-4 text-center ring-1 ring-zinc-200 sm:p-5">
              <p className="text-xs text-zinc-400">
                Enter your numbers on the left to see your snapshot.
              </p>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}
