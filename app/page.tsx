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

type PressureState = "Low Pressure" | "Moderate Pressure" | "High Pressure";

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

function getPressureState(
  runway: number,
  burnoutScore: number,
  monthlySurplus: number,
  hasSafetyNet: boolean
): PressureState {
  // High Pressure: financial margin is dangerously low or actively shrinking
  if (runway < 6 && runway > 0) return "High Pressure";
  if (runway < 9 && burnoutScore >= 8) return "High Pressure";
  if (monthlySurplus < 0 && runway < 12) return "High Pressure";

  // Low Pressure: real room to be deliberate
  if (runway >= 12 || (runway >= 9 && hasSafetyNet)) {
    if (burnoutScore < 8) return "Low Pressure";
    return "Moderate Pressure"; // high burnout compresses even strong financial positions
  }

  // Everything else
  return "Moderate Pressure";
}

function getBestMove(
  pressureState: PressureState,
  path: RecommendedPath,
  burnoutScore: number,
  runway: number
): string {
  if (pressureState === "Low Pressure") {
    if (path === "Consider taking a break or quitting") {
      return burnoutScore >= 8 ? "Decompress, then decide" : "Explore and transition";
    }
    return "Search deliberately";
  }
  if (pressureState === "Moderate Pressure") {
    if (path === "Search while employed") return "Search while you save";
    if (path === "Build more runway before quitting") return "Set a quit date and build toward it";
    return "Protect your options";
  }
  // High Pressure
  if (runway < 3) return "Don\u2019t quit without an offer";
  if (path === "Build more runway before quitting") return "Extend your runway first";
  return "Stabilize, then move";
}

function formatRunwayHuman(runway: number): string {
  if (runway >= 999) return "Covered";
  if (runway <= 0) return "0";
  const months = Math.floor(runway);
  const weeks = Math.round((runway - months) * 4.33);
  if (weeks === 0 || weeks >= 4) return `${Math.round(runway)} mo`;
  return `${months} mo ${weeks} wk`;
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
      ? ` In this rough framework you look most like a "${archetype}".`
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

function getYourMove(path: RecommendedPath, burnoutDriver: BurnoutDriver, runway: number, satisfaction: number, growth: number, income: number, expenses: number): { thisWeek: string; thisMonth: string; beforeYouDecide: string } {
  const monthlySurplus = income - expenses;

  // THIS WEEK — one specific action
  let thisWeek: string;
  if (path === "Consider taking a break or quitting") {
    thisWeek = "Tell one person you trust that you're seriously considering leaving. Not for advice — to hear yourself say it out loud.";
  } else if (path === "Search while employed") {
    thisWeek = "Reach out to 2 people in roles you find interesting. Ask: 'What's the worst part nobody talks about?' You're gathering intelligence, not job hunting.";
  } else if (path === "Build more runway before quitting") {
    if (monthlySurplus > 0) {
      thisWeek = `Set up a separate savings account with a $${Math.round(monthlySurplus * 0.7).toLocaleString()}/mo auto-transfer. Automate the runway you need.`;
    } else {
      thisWeek = "List every subscription and recurring charge. Most people find $200–400/mo they forgot about. That's not budgeting — it's buying time.";
    }
  } else {
    thisWeek = "Write down the 3 things that would need to change for you to feel good about staying. Be honest about which ones are in your control.";
  }

  // THIS MONTH — the career move
  let thisMonth: string;
  if (burnoutDriver === "Toxic culture") {
    thisMonth = "Start planning your exit. No amount of boundary-setting fixes a broken culture. The same work at a healthy company will feel like a different career.";
  } else if (burnoutDriver === "Lack of meaning") {
    thisMonth = satisfaction <= 4
      ? "Get clear on what 'meaningful' actually means to you — impact, autonomy, creative expression. The answer changes where you should look."
      : "Volunteer your skills somewhere that matters for 5 hours a week. See if that changes the equation before making a bigger move.";
  } else if (burnoutDriver === "Workload / hours") {
    thisMonth = "Run one experiment: say no to something you'd normally accept. If nothing breaks, do it again. If your boss punishes boundaries, that's your answer.";
  } else if (burnoutDriver === "Lack of growth") {
    thisMonth = "Ask your manager what the next level looks like. If they can't articulate it clearly in two weeks, they're telling you there isn't one here.";
  } else if (burnoutDriver === "Compensation mismatch") {
    thisMonth = "Get your market number — levels.fyi, Glassdoor, or ask peers directly. If you're 15%+ below market, you have a data problem, not a motivation problem.";
  } else {
    thisMonth = satisfaction <= 3 && growth <= 3
      ? "Map what you'd do if money weren't a factor, then find the version that pays. Low satisfaction and low growth together isn't a rough patch — it's a slow decline."
      : "Keep a 2-week log of what drains you vs. what energizes you. The pattern will point somewhere more useful than a gut feeling.";
  }

  // BEFORE YOU DECIDE — the financial grounding
  let beforeYouDecide: string;
  if (runway >= 999) {
    beforeYouDecide = "Your safety net covers you. The risk isn't financial — it's staying too long because you can afford to. Set a decision deadline and honor it.";
  } else if (runway >= 12) {
    beforeYouDecide = "You have over a year of runway. Stop using money as the reason to stay. The real question: what are you afraid happens if you actually leave?";
  } else if (monthlySurplus > 0 && runway < 12) {
    beforeYouDecide = `Every month you stay adds ${(monthlySurplus / expenses).toFixed(1)} months of runway. Pick your target number and work backward to a quit date.`;
  } else if (runway < 3) {
    beforeYouDecide = "With less than 3 months of runway, don't quit without an offer or a concrete plan. That's not fear — it's strategy.";
  } else {
    beforeYouDecide = "Get to 6 months of runway. That's the threshold where most people stop making fear-based decisions.";
  }

  return { thisWeek, thisMonth, beforeYouDecide };
}

function getWhatMovesTheNeedle(
  runway: number,
  expenses: number,
  income: number,
  severance: number,
  partnerIncome: number,
  hasHealthCoverage: boolean,
  adjustedRunway: number | null,
  runwayStay3: number,
  runwayStay6: number,
  safeQuitDate: string | null,
): string[] {
  const insights: { text: string; impact: number }[] = [];
  const monthlySurplus = income - expenses;

  // Staying longer
  if (monthlySurplus > 0 && runway < 12 && runway > 0 && runwayStay6 < 999) {
    const delta = runwayStay6 - runway;
    if (delta >= 2) {
      insights.push({
        text: `Staying 6 more months adds ${delta.toFixed(1)} months of runway — taking you from ${runway.toFixed(1)} to ${runwayStay6.toFixed(1)} months.`,
        impact: delta
      });
    }
  }

  // Safe quit date
  if (safeQuitDate && monthlySurplus > 0 && runway < 12) {
    insights.push({
      text: `At your current savings rate, you hit 12 months of runway by ${safeQuitDate}. That's your safe quit date.`,
      impact: 8
    });
  }

  // Health insurance
  if (!hasHealthCoverage && adjustedRunway !== null && adjustedRunway < 999 && runway > 0) {
    const delta = runway - adjustedRunway;
    if (delta > 0.5) {
      insights.push({
        text: `Health insurance (~$500/mo) reduces your runway from ${runway.toFixed(1)} to ${adjustedRunway.toFixed(1)} months. Factor this in.`,
        impact: delta
      });
    }
  }

  // Spending reduction
  if (expenses > 0 && runway > 0 && runway < 12) {
    const reducedExpenses = expenses * 0.85;
    const reducedRunway = (income > 0 ? (income - expenses) : 0) > 0 ? runway : ((typeof severance === "number" ? severance : 0) + 0) / reducedExpenses; // simplified
    const extraMonths = ((expenses - reducedExpenses) / reducedExpenses) * runway;
    if (extraMonths > 1) {
      insights.push({
        text: `Cutting 15% of expenses ($${Math.round(expenses * 0.15).toLocaleString()}/mo) adds roughly ${extraMonths.toFixed(0)} months to your runway.`,
        impact: extraMonths
      });
    }
  }

  // Partner income
  if (partnerIncome === 0 && expenses > 0 && runway > 0 && runway < 18) {
    insights.push({
      text: `Your runway is entirely self-funded. Adding any external income source \u2014 partner, family, or side work \u2014 would meaningfully extend it.`,
      impact: 3
    });
  }

  // Severance
  if (severance > 0 && expenses > 0) {
    const severanceMonths = severance / expenses;
    if (severanceMonths >= 1) {
      insights.push({
        text: `Your severance alone covers ${severanceMonths.toFixed(1)} months of expenses.`,
        impact: severanceMonths
      });
    }
  }

  // Sort by impact, return top 3
  return insights
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)
    .map(i => i.text);
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

function getCareerPhaseLabel(age: number | ""): string | null {
  const a = typeof age === "number" ? age : 0;
  if (a < 18) return null;
  if (a <= 25) return "Early exploration";
  if (a <= 30) return "Direction-setting";
  if (a <= 35) return "Mid-career inflection";
  if (a <= 45) return "Peak leverage";
  return "Senior recalibration";
}

function getCoreTension(
  archetype: Archetype,
  burnoutDriver: BurnoutDriver,
  financialRisk: RiskLevel,
  runway: number,
  burnoutScore: number
): string {
  // This names the REAL thing the person is wrestling with

  if (archetype === "Burned-Out Achiever") {
    if (burnoutDriver === "Workload / hours") {
      return "You've built real financial security by working at a pace your body and mind can no longer sustain. The tension isn't whether you can afford to leave — it's whether you can let go of the identity that got you here.";
    }
    if (burnoutDriver === "Lack of meaning") {
      return "You're good at what you do and you've been rewarded for it, but the work has stopped meaning anything to you. The hard part isn't money or options — it's admitting that success on someone else's terms isn't enough anymore.";
    }
    return "You've earned the right to step back, but achievers often feel like rest is failure. The real question: can you sit with discomfort long enough to figure out what you actually want, or will you just sprint into the next thing?";
  }

  if (archetype === "Trapped Professional") {
    if (financialRisk === "High") {
      return "You feel stuck because you are — high burnout and tight finances is the hardest combination. But 'trapped' is a feeling, not a fact. The path out is slower than you want, but it exists: stabilize the money, then make the move.";
    }
    return "The trap feels total, but it's usually one or two specific things — a boss, a commute, a role that shrank. Name the actual constraint. The way out is usually narrower and more specific than 'change everything.'";
  }

  if (archetype === "Restless Optimizer") {
    return "Nothing is technically wrong, and that's what makes this so confusing. You're not burned out enough to justify quitting and not satisfied enough to stop thinking about it. The risk isn't leaving — it's spending years in comfortable limbo.";
  }

  if (archetype === "Early Career Crisis") {
    return "Early career feels like everyone else has it figured out and you're behind. They don't and you're not. The real tension is between wanting certainty and needing to experiment. You can't think your way to the right career — you have to try things.";
  }

  if (archetype === "Comfortable Drifter") {
    return "Your situation is stable enough that there's no crisis forcing a decision. That's a luxury and a trap. The tension is between comfort now and regret later. The question isn't 'should I quit?' — it's 'what am I drifting toward?'";
  }

  // Generic fallback based on burnout + finances
  if (burnoutScore >= 7 && financialRisk === "Low") {
    return "You can afford to leave and your body is telling you to. The only thing keeping you is inertia, identity, or fear of what comes next. Name which one it is — that's where the real decision lives.";
  }

  if (burnoutScore >= 7 && financialRisk === "High") {
    return "You need to leave but can't afford to yet. That's the hardest position to be in. The goal isn't to feel better about staying — it's to build a bridge out as fast as possible while protecting your mental health in the meantime.";
  }

  if (burnoutScore < 4) {
    return "Your burnout is low, which means this isn't a crisis — it's a question of direction. You have the clarity and energy to make a thoughtful move rather than a desperate one. Don't waste that advantage by overthinking it.";
  }

  return "Your situation has real tension in it, and there's no clean answer. That's normal. The goal isn't to find the perfect move — it's to find one that's good enough and that you can commit to without looking back every week.";
}

function getMoneyRunsOutDate(runway: number): string | null {
  if (!Number.isFinite(runway) || runway >= 999 || runway <= 0) return null;
  const d = new Date();
  const totalDays = runway * 30.44; // average days per month
  d.setDate(d.getDate() + Math.round(totalDays));
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getFloorRunway(
  totalCash: number,
  expenses: number,
  hasHealthCoverage: boolean,
  unemploymentBenefits: number,
  partnerIncome: number,
  familySupport: number
): { floorRunway: number; floorDate: string | null; adjustments: string[] } {
  const EMERGENCY_BUFFER = 3000; // one-time transition costs
  const HEALTH_INSURANCE_COST = 550; // monthly if not covered
  const EXPENSE_BUMP = 0.15; // 15% higher expenses in stress scenario

  const adjustments: string[] = [];
  let adjustedCash = totalCash - EMERGENCY_BUFFER;
  adjustments.push("$3,000 in transition costs");
  let adjustedExpenses = expenses * (1 + EXPENSE_BUMP);
  adjustments.push("15% higher monthly expenses");
  if (!hasHealthCoverage) {
    adjustedExpenses += HEALTH_INSURANCE_COST;
    adjustments.push(`health insurance at $${HEALTH_INSURANCE_COST}/mo`);
  }

  const ongoingSafetyNet = partnerIncome + familySupport;
  const UNEMPLOYMENT_MONTHS = 6;
  const phase1Expenses = Math.max(0, adjustedExpenses - unemploymentBenefits - ongoingSafetyNet);
  const phase2Expenses = Math.max(0, adjustedExpenses - ongoingSafetyNet);

  let floorRunway: number;
  if (adjustedCash <= 0) {
    floorRunway = 0;
  } else if (phase1Expenses <= 0) {
    floorRunway = phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + Math.max(0, adjustedCash) / phase2Expenses;
  } else {
    const p1 = adjustedCash / phase1Expenses;
    if (p1 <= UNEMPLOYMENT_MONTHS) {
      floorRunway = p1;
    } else {
      const rem = adjustedCash - phase1Expenses * UNEMPLOYMENT_MONTHS;
      floorRunway = phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + rem / phase2Expenses;
    }
  }

  const floorDate = getMoneyRunsOutDate(floorRunway);
  return { floorRunway, floorDate, adjustments };
}

function getFullRecommendation(
  path: RecommendedPath,
  runway: number,
  savingsTarget: number,
  savingsGap: number,
  safeQuitDate: string | null,
  monthlySurplus: number,
  totalCash: number,
  readinessTier: string,
  runwayStay3: number,
  burnoutScore: number,
  moneyRunsOutDate: string | null,
  pressureState: PressureState
): string {
  const targetStr = `$${Math.round(savingsTarget).toLocaleString()}`;
  const gapStr = `$${Math.round(savingsGap).toLocaleString()}`;
  const dateStr = moneyRunsOutDate ? `Your savings would last until ${moneyRunsOutDate}. ` : "";

  if (pressureState === "Low Pressure") {
    if (runway >= 18) {
      return `${dateStr}You have the margin to be fully deliberate about what comes next. This isn\u2019t a financial decision anymore \u2014 it\u2019s a strategic one.`;
    }
    if (runway >= 12) {
      return `${dateStr}You\u2019ve cleared the 12-month safety threshold. You can afford to move on your own timeline, not someone else\u2019s.`;
    }
    return `${dateStr}With a safety net backing you, you have more room than the raw number suggests. Use it wisely.`;
  }

  if (pressureState === "High Pressure") {
    if (monthlySurplus < 0) {
      return `You\u2019re spending more than you earn \u2014 your runway is shrinking, not growing. ${dateStr}Before you can plan an exit, you need to stop the bleeding: cut expenses or increase income.`;
    }
    if (runway < 3) {
      return `${dateStr}With less than 3 months of margin, you don\u2019t have room for an unplanned exit. Your priority is creating breathing room \u2014 not making a career decision under this kind of pressure.`;
    }
    if (burnoutScore >= 8) {
      return `${dateStr}Your burnout is severe and your financial margin is tight. That\u2019s the hardest combination. The instinct to flee is real, but a forced exit makes everything harder. Build toward your ${targetStr} target first.`;
    }
    return `${dateStr}You need more runway before any exit makes sense. Focus on closing the ${gapStr} gap to reach ${targetStr}.`;
  }

  // Moderate Pressure
  if (safeQuitDate && monthlySurplus > 0) {
    return `${dateStr}You have a window, but not an open one. At $${Math.round(monthlySurplus).toLocaleString()}/month in savings, you close the ${gapStr} gap by ${safeQuitDate}. That\u2019s your target.`;
  }
  if (runway >= 9 && runwayStay3 >= 12) {
    return `${dateStr}Three more months of saving gets you from ${runway.toFixed(1)} to ${runwayStay3.toFixed(1)} months \u2014 enough to cross the safety threshold. Search now, but don\u2019t resign until you\u2019re there.`;
  }
  return `${dateStr}You have enough margin to be strategic but not enough to be casual. Keep your income while you search, and keep saving toward ${targetStr}.`;
}

function getChecklist(
  path: RecommendedPath,
  runway: number,
  monthlySurplus: number,
  expenses: number,
  totalCash: number,
  savingsTarget: number,
  safeQuitDate: string | null,
  parsedSeverance: number,
  hasHealthCoverage: boolean,
  parsedUnemployment: number,
  parsedPartnerIncome: number,
  burnoutDriver: BurnoutDriver
): string[] {
  const items: string[] = [];
  const surplus = Math.max(0, monthlySurplus);
  const autoTransfer = Math.round(surplus * 0.7);
  const gap = Math.max(0, savingsTarget - totalCash);

  if (path === "Consider taking a break or quitting") {
    items.push(`Move $${Math.round(totalCash).toLocaleString()} into a dedicated "runway account." Separate it from investments and daily spending.`);
    if (!hasHealthCoverage) {
      items.push("Research health coverage: COBRA (~$600/mo) vs. marketplace ($400–$550/mo). Budget for this starting day one.");
    }
    if (parsedUnemployment > 0) {
      items.push(`File for unemployment benefits immediately after your last day. That's ~$${Math.round(parsedUnemployment).toLocaleString()}/month for up to 6 months.`);
    } else {
      items.push("Check your state's unemployment eligibility. Most professionals qualify for $1,500–$2,500/month for 6 months.");
    }
    items.push("Set a \u201Cdecision check-in\u201D date 90 days out. Put it in your calendar now. Revisit this plan then.");
    if (parsedPartnerIncome > 0) {
      items.push("Have the money conversation with your partner: share this plan, your runway number, and your timeline.");
    } else {
      items.push("Tell one person you trust about your plan and your timeline. Not for advice — for accountability.");
    }
  } else if (path === "Build more runway before quitting") {
    if (surplus > 0) {
      items.push(`Set up auto-transfer: $${autoTransfer.toLocaleString()}/month to a separate savings account. ${safeQuitDate ? `This gets you to your target by ${safeQuitDate}.` : "Every month counts."}`);
    }
    items.push(`Your target is $${Math.round(savingsTarget).toLocaleString()} (12 months of expenses). You're $${Math.round(gap).toLocaleString()} away.`);
    items.push("Audit subscriptions and recurring charges this week. Most people find $200–$400/month they forgot about.");
    if (!hasHealthCoverage) {
      items.push("Start researching health coverage options now. Budget $400–$600/month in your post-exit expenses.");
    }
    if (burnoutDriver === "Toxic culture" || burnoutDriver === "Workload / hours") {
      items.push("While you build runway, protect your energy: set one firm boundary this week and hold it.");
    }
    items.push(`Set a calendar reminder to revisit this plan in 30 days. ${safeQuitDate ? `Your safe quit date is ${safeQuitDate} — track against it.` : "Track your savings progress."}`);
  } else if (path === "Search while employed") {
    items.push("Update your resume and LinkedIn this week. Not tomorrow — this week.");
    if (surplus > 0) {
      items.push(`Keep saving: $${autoTransfer.toLocaleString()}/month auto-transfer while you search. ${safeQuitDate ? `You hit 12-month safety by ${safeQuitDate}.` : ""}`);
    }
    items.push("Reach out to 3 people in roles or companies you're curious about. Ask what they'd change about their job.");
    if (!hasHealthCoverage) {
      items.push("Don't accept an offer without comparing health coverage. Budget $400–$600/month if you'll have a gap.");
    }
    items.push("Set a search deadline: if nothing promising in 90 days, reassess whether the issue is the market or the target.");
    if (parsedSeverance > 0) {
      items.push(`Your severance of $${Math.round(parsedSeverance).toLocaleString()} gives you extra cushion. Factor it in, but don't count on it until it's confirmed in writing.`);
    }
  } else {
    // Stay and improve
    items.push("Write down the 3 specific things that would need to change for you to feel good about staying 12 more months.");
    items.push("Share those 3 things with your manager within 2 weeks. If you can't, that tells you something.");
    if (surplus > 0) {
      items.push(`Keep building runway: $${autoTransfer.toLocaleString()}/month auto-transfer. Options feel different when you have 12 months of savings.`);
    }
    items.push("Set a 90-day check-in: if nothing has improved by then, switch to an active search.");
    if (burnoutDriver === "Compensation mismatch") {
      items.push("Get your market number this week: levels.fyi, Glassdoor, or ask peers directly. Data changes negotiations.");
    }
  }

  return items.slice(0, 7); // cap at 7 items
}

export default function Home() {
  const [savings, setSavings] = React.useState<number | "">("");
  const [expenses, setExpenses] = React.useState<number | "">("");
  const [severance, setSeverance] = React.useState<number | "">("");
  const [income, setIncome] = React.useState<number | "">("");
  const [age, setAge] = React.useState<number | "">("");
  const [burnoutDriver, setBurnoutDriver] = React.useState<BurnoutDriver>("Not sure");
  const [partnerIncome, setPartnerIncome] = React.useState<number | "">("");
  const [familySupport, setFamilySupport] = React.useState<number | "">("");
  const [unemploymentBenefits, setUnemploymentBenefits] = React.useState<number | "">("");
  const [netWorth, setNetWorth] = React.useState<number | "">("");
  const [hasHealthCoverage, setHasHealthCoverage] = React.useState(true);
  const [debtPayments, setDebtPayments] = React.useState<number | "">("");
  const [burnout, setBurnout] = React.useState(5);
  const [satisfaction, setSatisfaction] = React.useState(5);
  const [growth, setGrowth] = React.useState(5);
  const [gateEmail, setGateEmail] = React.useState("");
  const [gateUnlocked, setGateUnlocked] = React.useState(false);
  const [gateSubmitting, setGateSubmitting] = React.useState(false);
  const [gateError, setGateError] = React.useState("");
  const parsedSavings = typeof savings === "number" ? savings : parseFloat(savings || "0");
  const parsedExpenses = typeof expenses === "number" ? expenses : parseFloat(expenses || "0");
  const parsedSeverance = typeof severance === "number" ? severance : parseFloat(severance || "0");
  const parsedIncome = typeof income === "number" ? income : parseFloat(income || "0");
  const parsedPartnerIncome = typeof partnerIncome === "number" ? partnerIncome : parseFloat(partnerIncome || "0");
  const parsedFamilySupport = typeof familySupport === "number" ? familySupport : parseFloat(familySupport || "0");
  const parsedWeeklyUnemployment = typeof unemploymentBenefits === "number" ? unemploymentBenefits : parseFloat(unemploymentBenefits || "0");
  const parsedUnemployment = parsedWeeklyUnemployment * 4.33; // weekly → monthly
  const parsedNetWorth = typeof netWorth === "number" ? netWorth : parseFloat(netWorth || "0");
  const parsedDebtPayments = typeof debtPayments === "number" ? debtPayments : parseFloat(debtPayments || "0");

  const effectiveExpenses = parsedExpenses + parsedDebtPayments;

  const UNEMPLOYMENT_MONTHS = 6;
  const monthlySafetyNet = parsedPartnerIncome + parsedFamilySupport + parsedUnemployment;
  const ongoingSafetyNet = parsedPartnerIncome + parsedFamilySupport; // after unemployment expires
  const phase1Expenses = Math.max(0, effectiveExpenses - monthlySafetyNet); // first 6 months
  const phase2Expenses = Math.max(0, effectiveExpenses - ongoingSafetyNet); // after unemployment ends

  // Runway accounts for unemployment benefits lasting only 6 months
  const totalCash = parsedSavings + parsedSeverance;
  const runway = (() => {
    if (parsedExpenses <= 0) return 0;
    // Phase 1: with unemployment (up to 6 months)
    if (phase1Expenses <= 0) {
      // Safety net covers everything during phase 1
      if (phase2Expenses <= 0) return 999; // ongoing safety net covers everything too
      return UNEMPLOYMENT_MONTHS + totalCash / phase2Expenses;
    }
    const phase1Months = totalCash / phase1Expenses;
    if (phase1Months <= UNEMPLOYMENT_MONTHS) return phase1Months; // cash runs out before benefits expire
    // Cash survives past 6 months — switch to phase 2 rate
    const cashAfterPhase1 = totalCash - phase1Expenses * UNEMPLOYMENT_MONTHS;
    if (phase2Expenses <= 0) return 999; // ongoing safety net covers post-unemployment
    return UNEMPLOYMENT_MONTHS + cashAfterPhase1 / phase2Expenses;
  })();

  // Health insurance adjustment: ~$500/mo if no employer coverage
  const HEALTH_INSURANCE_COST = 500;
  const adjustedExpenses = !hasHealthCoverage ? effectiveExpenses + HEALTH_INSURANCE_COST : effectiveExpenses;
  const adjustedRunway = (() => {
    if (hasHealthCoverage || effectiveExpenses <= 0) return null;
    const adjPhase1 = Math.max(0, adjustedExpenses - monthlySafetyNet);
    const adjPhase2 = Math.max(0, adjustedExpenses - ongoingSafetyNet);
    if (adjPhase1 <= 0) {
      if (adjPhase2 <= 0) return 999;
      return UNEMPLOYMENT_MONTHS + totalCash / adjPhase2;
    }
    const p1 = totalCash / adjPhase1;
    if (p1 <= UNEMPLOYMENT_MONTHS) return p1;
    const cashAfter = totalCash - adjPhase1 * UNEMPLOYMENT_MONTHS;
    if (adjPhase2 <= 0) return 999;
    return UNEMPLOYMENT_MONTHS + cashAfter / adjPhase2;
  })();

  const monthlySurplus = parsedIncome - effectiveExpenses;
  const runwayStay3 = (() => {
    const cash = totalCash + Math.max(0, monthlySurplus) * 3;
    if (phase1Expenses <= 0) return phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + cash / phase2Expenses;
    const p1 = cash / phase1Expenses;
    if (p1 <= UNEMPLOYMENT_MONTHS) return p1;
    const rem = cash - phase1Expenses * UNEMPLOYMENT_MONTHS;
    return phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + rem / phase2Expenses;
  })();
  const runwayStay6 = (() => {
    const cash = totalCash + Math.max(0, monthlySurplus) * 6;
    if (phase1Expenses <= 0) return phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + cash / phase2Expenses;
    const p1 = cash / phase1Expenses;
    if (p1 <= UNEMPLOYMENT_MONTHS) return p1;
    const rem = cash - phase1Expenses * UNEMPLOYMENT_MONTHS;
    return phase2Expenses <= 0 ? 999 : UNEMPLOYMENT_MONTHS + rem / phase2Expenses;
  })();
  const scenarioDelta = runwayStay6 - runway;
  const scenarioInsight = scenarioDelta > 8
    ? `Staying 6 more months nearly doubles your runway. That's significant leverage.`
    : scenarioDelta >= 4
    ? `Six more months buys you ${scenarioDelta.toFixed(1)} extra months of freedom. Worth considering.`
    : `The financial upside of staying is modest. This decision is about more than money.`;

  // New calculations: savings target, safe quit date, readiness tier
  const TARGET_RUNWAY_MONTHS = 12;
  const savingsTarget = effectiveExpenses > 0 ? effectiveExpenses * TARGET_RUNWAY_MONTHS : 0;
  const savingsGap = Math.max(0, savingsTarget - totalCash);
  const monthsToTarget = monthlySurplus > 0 && savingsGap > 0
    ? Math.ceil(savingsGap / monthlySurplus)
    : monthlySurplus <= 0 && savingsGap > 0
    ? null // spending more than earning, can't reach target
    : 0; // already there
  const safeQuitDate = (() => {
    if (monthsToTarget === null || monthsToTarget === 0) return null;
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToTarget);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  const burnoutScore =
    (burnout + (10 - satisfaction) + (10 - growth)) / 3;

  const financialRisk = getFinancialRisk(runway);
  const burnoutLevel = getBurnoutLevel(burnoutScore);
  const archetype = getArchetype(burnoutScore, satisfaction, growth, runway, financialRisk);
  const careerHealthScore = satisfaction + growth - burnout;
  const careerHealthLabel = getCareerHealthLabel(careerHealthScore);
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
  const yourMove = getYourMove(recommendedPath, burnoutDriver, runway, satisfaction, growth, parsedIncome, parsedExpenses);
  const needleMovers = getWhatMovesTheNeedle(runway, effectiveExpenses, parsedIncome, parsedSeverance, parsedPartnerIncome, hasHealthCoverage, adjustedRunway, runwayStay3, runwayStay6, safeQuitDate);
  const burnoutDriverInsight = getBurnoutDriverInsight(burnoutDriver);
  // Field-count confidence score
  const optionalFieldLabels: { filled: boolean; label: string }[] = [
    { filled: growth !== 5, label: "growth trajectory" },
    { filled: burnoutDriver !== "Not sure", label: "burnout driver" },
    { filled: age !== "", label: "age" },
    { filled: parsedSeverance > 0 || severance !== "", label: "severance" },
    { filled: parsedNetWorth > 0 || netWorth !== "", label: "net worth" },
    { filled: parsedPartnerIncome > 0 || partnerIncome !== "", label: "partner income" },
    { filled: parsedFamilySupport > 0 || familySupport !== "", label: "family support" },
    { filled: parsedUnemployment > 0 || unemploymentBenefits !== "", label: "unemployment" },
    { filled: !hasHealthCoverage, label: "health coverage" },
  ];

  const filledCount = optionalFieldLabels.filter((f) => f.filled).length;
  const totalOptional = optionalFieldLabels.length;
  const fieldConfidence: "High" | "Medium" | "Low" =
    filledCount >= 7 ? "High" : filledCount >= 4 ? "Medium" : "Low";
  const missingFieldLabels = optionalFieldLabels.filter((f) => !f.filled).map((f) => f.label);
  const confidenceExplanation = `Based on ${filledCount} of ${totalOptional} optional fields.${
    missingFieldLabels.length > 0
      ? ` Adding ${missingFieldLabels.slice(0, 2).join(" and ")} would most improve accuracy.`
      : ""
  }`;

  // Keep old decision confidence for internal use
  const decisionConfidence = getDecisionConfidence(
    archetype,
    financialRisk,
    burnoutLevel,
    recommendedPath,
    runway
  );
  const normalizationParagraph = getNormalizationParagraph(age);
  const careerTimingPerspective = getCareerTimingPerspective(age);

  const whyParts: string[] = [situationSummary];
  if (burnoutDriverInsight) whyParts.push(burnoutDriverInsight);
  if (careerTimingPerspective) whyParts.push(careerTimingPerspective);
  const whyParagraph = whyParts.join(" ");

  // Readiness tier
  type ReadinessTier = "Build More Runway" | "Prepare to Leave" | "Clear to Go";
  const hasSafetyNet = parsedPartnerIncome > 0 || parsedFamilySupport > 0 || parsedUnemployment > 0;
  const readinessTier: ReadinessTier = (() => {
    if (runway >= 12 || (runway >= 9 && hasSafetyNet)) return "Clear to Go";
    if (runway >= 6 && burnout >= 7) return "Prepare to Leave";
    if (runway >= 6) return "Prepare to Leave";
    return "Build More Runway";
  })();
  const tierExplanation: string = (() => {
    switch (readinessTier) {
      case "Build More Runway":
        return "Your financial position isn't strong enough yet for a safe exit. Focus on closing the gap.";
      case "Prepare to Leave":
        return "You have enough runway to start planning an exit. Use the next 60–90 days strategically.";
      case "Clear to Go":
        return "Your finances can support a transition. The question is timing and what comes next.";
    }
  })();

  // Risk flags + strengths
  const strengths: string[] = [];
  const riskFlags: string[] = [];
  if (runway > 9) strengths.push(`You have ${runway >= 999 ? "full coverage" : `${runway.toFixed(1)} months`} of runway — more than most people who make this transition.`);
  if (parsedPartnerIncome > 0) strengths.push("Partner income provides a financial safety net during your transition.");
  if (monthlySurplus > 1000) strengths.push("Your savings rate is strong — every month you stay adds meaningfully to your runway.");
  if (parsedSeverance > 0) strengths.push(`Expected severance of $${Math.round(parsedSeverance).toLocaleString()} extends your effective runway.`);
  if (runway < 4 && runway > 0) riskFlags.push("Less than 4 months of runway creates significant pressure to accept the first opportunity available.");
  if (burnout >= 8 && runway < 6 && runway > 0) riskFlags.push("High burnout combined with a short runway is the highest-risk combination. Decisions made under this pressure are often regretted.");
  if (parsedPartnerIncome === 0 && parsedFamilySupport === 0) riskFlags.push("Your runway is entirely self-funded. There\u2019s no external safety net factored in.");
  if (!hasHealthCoverage) riskFlags.push("You'll need marketplace health coverage, which typically costs $400–600/month and isn't factored into most people's initial estimates.");
  if (parsedIncome > 0 && parsedExpenses > 0 && parsedIncome <= parsedExpenses) riskFlags.push("You're currently spending more than you earn — your runway is actively shrinking.");

  const readinessTierColor =
    readinessTier === "Clear to Go" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
    readinessTier === "Prepare to Leave" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
    "border-rose-700/50 bg-rose-900/30 text-rose-300";

  const pressureState = getPressureState(runway, burnoutScore, monthlySurplus, hasSafetyNet);
  const bestMove = getBestMove(pressureState, recommendedPath, burnoutScore, runway);

  const pressureColor =
    pressureState === "Low Pressure" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
    pressureState === "Moderate Pressure" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
    "border-rose-700/50 bg-rose-900/30 text-rose-300";

  // Option comparison: leave now vs stay 3 vs stay 6
  type OptionKey = "now" | "stay3" | "stay6";
  const riskForRunway = (r: number): RiskLevel => r >= 12 ? "Low" : r >= 6 ? "Moderate" : "High";
  const tradeoffForOption = (key: OptionKey, r: number): string => {
    if (key === "now") {
      if (r >= 12) return "Reclaim your time now — you have the cushion.";
      if (r >= 6) return "Freedom now, but limited margin for error.";
      return "Freedom now, but tight money and high pressure.";
    }
    if (key === "stay3") {
      const added = (runwayStay3 - runway).toFixed(1);
      if (runwayStay3 >= 12 && runway < 12) return `Crosses the 12-month threshold (+${added} mo).`;
      return `+${added} months of cushion for 3 months of patience.`;
    }
    // stay6
    const added = (runwayStay6 - runway).toFixed(1);
    if (runway >= 12) return `Diminishing returns — more money, less life.`;
    if (runwayStay6 >= 12) return `Gets you to safety (+${added} mo), but 6 more months.`;
    return `3 more months of work buys ${added} months of freedom.`;
  };
  const recommendedOption: OptionKey = (() => {
    if (readinessTier === "Clear to Go") return "now";
    if (readinessTier === "Build More Runway") {
      return runwayStay3 >= 12 ? "stay3" : "stay6";
    }
    // Prepare to Leave
    if (runway >= 9) return "now";
    return runwayStay3 >= 9 ? "stay3" : "stay6";
  })();
  const options: { key: OptionKey; label: string; runway: number; risk: RiskLevel; tradeoff: string; recommended: boolean }[] = [
    { key: "now", label: "Leave now", runway, risk: riskForRunway(runway), tradeoff: tradeoffForOption("now", runway), recommended: recommendedOption === "now" },
    { key: "stay3", label: "Stay 3 months", runway: runwayStay3, risk: riskForRunway(runwayStay3), tradeoff: tradeoffForOption("stay3", runwayStay3), recommended: recommendedOption === "stay3" },
    { key: "stay6", label: "Stay 6 months", runway: runwayStay6, risk: riskForRunway(runwayStay6), tradeoff: tradeoffForOption("stay6", runwayStay6), recommended: recommendedOption === "stay6" },
  ];

  const realityCheck = getRealityCheck(archetype, careerHealthLabel, financialRisk, burnoutDriver);

  const coreTension = getCoreTension(archetype, burnoutDriver, financialRisk, runway, burnoutScore);

  const moneyRunsOutDate = getMoneyRunsOutDate(runway);
  const { floorRunway, floorDate, adjustments: floorAdjustments } = getFloorRunway(
    totalCash,
    effectiveExpenses,
    hasHealthCoverage,
    parsedUnemployment,
    parsedPartnerIncome,
    parsedFamilySupport
  );

  const fullRecommendation = getFullRecommendation(
    recommendedPath,
    runway,
    savingsTarget,
    savingsGap,
    safeQuitDate,
    monthlySurplus,
    totalCash,
    readinessTier,
    runwayStay3,
    burnoutScore,
    moneyRunsOutDate,
    pressureState
  );

  const checklist = getChecklist(
    recommendedPath,
    runway,
    monthlySurplus,
    effectiveExpenses,
    totalCash,
    savingsTarget,
    safeQuitDate,
    parsedSeverance,
    hasHealthCoverage,
    parsedUnemployment,
    parsedPartnerIncome,
    burnoutDriver
  );

  const hasFinancialInputs = effectiveExpenses > 0;
  const hasAnySavings = parsedSavings > 0 || parsedSeverance > 0;
  const showLiveRunway = hasAnySavings || hasFinancialInputs;
  const [copied, setCopied] = React.useState(false);

  const handleShareProfile = async () => {
    const profileLabel =
      archetype === "None" ? "No clear single profile" : archetype;

    const runwayText =
      runway && Number.isFinite(runway)
        ? `${runway.toFixed(1)} months of runway`
        : "runway not yet calculated";

    const totalCashText = totalCash > 0
      ? `$${Math.round(totalCash).toLocaleString()} total cash (savings${parsedSeverance > 0 ? ` + $${Math.round(parsedSeverance).toLocaleString()} severance` : ""})`
      : null;

    const netWorthText = parsedNetWorth > 0
      ? `Net worth: $${Math.round(parsedNetWorth).toLocaleString()}`
      : null;

    const shareLines = [
      "My Runway Assessment:",
      profileLabel,
      `Career health: ${careerHealthLabel}`,
      `Runway: ${runwayText}`,
      ...(totalCashText ? [`Est. cash available: ${totalCashText}`] : []),
      ...(netWorthText ? [netWorthText] : []),
      `Burnout: ${burnoutScore.toFixed(1)}/10`,
      `Recommended next move: ${recommendedPath}`,
    ];

    const shareText = shareLines.join(" | ");

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateEmail || !gateEmail.includes("@")) {
      setGateError("Enter a valid email address.");
      return;
    }
    setGateSubmitting(true);
    setGateError("");
    try {
      // Fire-and-forget: attempt capture but always unlock
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: gateEmail,
          pressureState,
          runway: runway >= 999 ? "covered" : runway.toFixed(1),
          archetype,
        }),
      }).catch(() => {});
      setGateUnlocked(true);
    } catch {
      // Unlock even if something unexpected happens
      setGateUnlocked(true);
    } finally {
      setGateSubmitting(false);
    }
  };

  // Split core tension: first sentence bold, rest lighter
  const coreTensionParts = (() => {
    const idx = coreTension.indexOf(". ");
    if (idx === -1) return { lead: coreTension, rest: "" };
    return { lead: coreTension.slice(0, idx + 1), rest: coreTension.slice(idx + 2) };
  })();

  // Collapsible section state
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Live read based on slider combination
  const sliderRead = (() => {
    const highBurnout = burnout >= 7;
    const lowBurnout = burnout <= 3;
    const highSat = satisfaction >= 7;
    const lowSat = satisfaction <= 3;

    if (highBurnout && lowSat) return "That's a rough combination. Let's see if the money works.";
    if (highBurnout && highSat) return "Burned out but you like what you do. That changes things.";
    if (highBurnout) return "Your burnout is high. The financial picture will matter a lot.";
    if (lowBurnout && lowSat) return "Not burned out, but not happy either. Worth exploring why.";
    if (lowBurnout && highSat) return "You're in a good spot. What brought you here?";
    if (lowSat) return "Low satisfaction is a slow drain. Let's see what your options look like.";
    if (burnout >= 5 && satisfaction <= 4) return "Something's off. Let's figure out how much room you have to move.";
    return null;
  })();

  const inputClass = "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-8 py-2.5 text-sm text-white placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400 focus:bg-slate-700";
  const inputClassNoDollar = "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400 focus:bg-slate-700";

  const runwayColorClass =
    !hasFinancialInputs ? "text-slate-600" :
    runway >= 999 ? "text-emerald-400" :
    runway > 18 ? "text-emerald-400" :
    runway >= 6 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6 font-sans text-slate-100 sm:py-8">
      {/* Persistent runway bar — always pinned to top */}
      {showLiveRunway && (
        <div className="fixed inset-x-0 top-0 z-50 bg-slate-800/95 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Runway</span>
            <span className={`text-lg font-bold tabular-nums ${runwayColorClass}`}>
              {runway >= 999 ? "Covered" : runway ? `${runway.toFixed(1)} mo` : "0 mo"}
            </span>
          </div>
        </div>
      )}
      {/* Spacer to offset fixed bar */}
      {showLiveRunway && <div className="h-10" />}
      <main className="mx-auto w-full max-w-2xl space-y-6">

        {/* ── Header ── */}
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Runway</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Career Runway Planner</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            You already know something needs to change. This tool helps you see whether the money supports the move — and what to do next.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            No account required. Your data stays in your browser.
          </p>
        </header>

        {/* ── Card 1: How you're feeling ── */}
        <section className="space-y-5 rounded-2xl bg-slate-800 p-5 sm:p-7">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200">
              How burned out are you?{" "}
              <span className="rounded-full bg-slate-600 px-2 py-0.5 text-[11px] text-slate-200">
                {burnout}/10
              </span>
            </p>
            <input type="range" min={1} max={10} value={burnout}
              onChange={(e) => setBurnout(Number(e.target.value))}
              className="w-full accent-slate-400" />
            <p className="text-xs text-slate-400">1 = deeply rested, 10 = completely depleted</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200">
              How do you feel about your job?{" "}
              <span className="rounded-full bg-slate-600 px-2 py-0.5 text-[11px] text-slate-200">
                {satisfaction}/10
              </span>
            </p>
            <input type="range" min={1} max={10} value={satisfaction}
              onChange={(e) => setSatisfaction(Number(e.target.value))}
              className="w-full accent-slate-400" />
            <p className="text-xs text-slate-400">1 = actively miserable, 10 = genuinely fulfilled</p>
          </div>
          {sliderRead && (
            <p className="mt-1 text-center text-sm italic text-slate-400">{sliderRead}</p>
          )}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200">
              Are you still learning and growing?{" "}
              <span className="rounded-full bg-slate-600 px-2 py-0.5 text-[11px] text-slate-200">
                {growth}/10
              </span>
            </p>
            <input type="range" min={1} max={10} value={growth}
              onChange={(e) => setGrowth(Number(e.target.value))}
              className="w-full accent-slate-400" />
            <p className="text-xs text-slate-400">1 = completely stalled, 10 = accelerating</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">What's wearing you down most?</label>
            <select value={burnoutDriver}
              onChange={(e) => setBurnoutDriver(e.target.value as BurnoutDriver)}
              className={inputClassNoDollar}>
              <option value="Not sure">Not sure yet</option>
              <option value="Workload / hours">Workload / hours</option>
              <option value="Lack of meaning">Lack of meaning</option>
              <option value="Toxic culture">Toxic culture</option>
              <option value="Lack of growth">Lack of growth</option>
              <option value="Compensation mismatch">Compensation mismatch</option>
            </select>
          </div>
        </section>

        {/* ── Card 2: Your financial picture ── */}
        <section className="space-y-5 rounded-2xl bg-slate-800 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">Liquid savings you could live on</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                <input type="number" min={0} value={savings}
                  onChange={(e) => setSavings(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputClass} placeholder="e.g. 25,000" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">What you spend per month</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                <input type="number" min={0} value={expenses}
                  onChange={(e) => setExpenses(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputClass} placeholder="e.g. 3,500" />
              </div>
              <p className="text-xs text-slate-400">Rent + food + insurance + transport + subscriptions. Exclude debt payments.</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">What you earn per month</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
              <input type="number" min={0} value={income}
                onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
                className={inputClass} placeholder="e.g. 6,200" />
            </div>
            <p className="text-xs text-slate-400">After taxes. Used for scenario modeling.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">Monthly debt payments</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
              <input type="number" min={0} value={debtPayments}
                onChange={(e) => setDebtPayments(e.target.value === "" ? "" : Number(e.target.value))}
                className={inputClass} placeholder="0" />
            </div>
            <p className="text-xs text-slate-400">Student loans, car payment, minimum credit card payments.</p>
          </div>
        </section>

        {/* ── Empty state ── */}
        {!hasFinancialInputs && (
          <p className="py-4 text-center text-sm text-slate-500">Add your financial details above to see your assessment.</p>
        )}

        {/* ── Sharpen the picture (progressive disclosure) ── */}
        <details className="group rounded-2xl bg-slate-800">
          <summary className="cursor-pointer select-none px-5 py-4 text-sm font-medium text-slate-200 sm:px-7">
            <span className="inline-flex items-center gap-2">
              Sharpen the picture
              <span className="text-xs text-slate-400">age, severance, net worth, safety net</span>
              <svg className="h-4 w-4 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </summary>
          <div className="space-y-5 px-5 pb-6 sm:px-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200">Age</label>
                <input type="number" min={18} max={70} value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputClassNoDollar} placeholder="Your age" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200">Expected severance</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                  <input type="number" min={0} value={severance}
                    onChange={(e) => setSeverance(e.target.value === "" ? "" : Number(e.target.value))}
                    className={inputClass} placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200">Total net worth</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                  <input type="number" min={0} value={netWorth}
                    onChange={(e) => setNetWorth(e.target.value === "" ? "" : Number(e.target.value))}
                    className={inputClass} placeholder="e.g. 150,000" />
                </div>
                <p className="text-xs text-slate-400">Investments, retirement accounts, equity, and other assets beyond cash savings.</p>
              </div>
            </div>

            {/* Health insurance toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-600 bg-slate-700/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-200">Will you have health coverage after leaving?</p>
                <p className="text-xs text-slate-400">Through partner, spouse, or other arrangement</p>
              </div>
              <button
                type="button"
                onClick={() => setHasHealthCoverage(!hasHealthCoverage)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  hasHealthCoverage ? "bg-emerald-600" : "bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    hasHealthCoverage ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <details className="group/net rounded-xl border border-slate-600 bg-slate-700/30 px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium text-slate-200 select-none">
                Safety net
                <span className="ml-2 text-xs text-slate-400">partner income, family, unemployment</span>
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Partner income</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                    <input type="number" min={0} value={partnerIncome}
                      onChange={(e) => setPartnerIncome(e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputClass} placeholder="0" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Family support</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                    <input type="number" min={0} value={familySupport}
                      onChange={(e) => setFamilySupport(e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputClass} placeholder="0" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Unemployment benefits</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                    <input type="number" min={0} value={unemploymentBenefits}
                      onChange={(e) => setUnemploymentBenefits(e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputClass} placeholder="e.g. 450" />
                  </div>
                  <p className="text-[10px] text-slate-500">Weekly amount, typically $300–$600. Leave blank if unsure.</p>
                </div>
              </div>
            </details>
          </div>
        </details>

        {/* ── Results ── */}
        {hasFinancialInputs && (
          <section className="space-y-4">

            {/* ── PLAN HEADER WITH DATE + COPY ── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Your Runway Plan</p>
                <p className="text-[10px] text-slate-500">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const runwayLine = runway >= 999 ? "Runway: Fully covered" : `Runway: ${runway.toFixed(1)} months${moneyRunsOutDate ? ` (through ${moneyRunsOutDate})` : ""}`;
                  const planText = [
                    `RUNWAY PLAN — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
                    "",
                    `${pressureState} · ${bestMove}`,
                    runwayLine,
                    `12-month target: $${Math.round(savingsTarget).toLocaleString()}`,
                    savingsGap > 0 ? `Gap to close: $${Math.round(savingsGap).toLocaleString()}` : "Target reached",
                    safeQuitDate ? `Safe quit date: ${safeQuitDate}` : "",
                    floorRunway < 999 && floorRunway > 0 ? `Worst-case floor: ${floorRunway.toFixed(1)} months${floorDate ? ` (through ${floorDate})` : ""}` : "",
                    "",
                    fullRecommendation,
                    "",
                    "— Generated by Runway (tryrunway.com)"
                  ].filter(Boolean).join("\n");
                  try {
                    await navigator.clipboard.writeText(planText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch { /* clipboard may not be available */ }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                {copied ? (
                  <>
                    <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy plan
                  </>
                )}
              </button>
            </div>

            {/* ── 1. THE BOTTOM LINE ── */}
            <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${pressureColor}`}>{pressureState}</span>
              </div>

              {/* Best next move */}
              <p className="mt-3 text-lg font-semibold text-white">{bestMove}</p>

              {/* Recommendation */}
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {fullRecommendation}
              </p>

              {/* Key numbers row */}
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-700 pt-5">
                <div>
                  <p className={`text-2xl font-bold tabular-nums ${runwayColorClass}`}>
                    {formatRunwayHuman(runway)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {runway >= 999 ? "expenses covered" : "runway"}
                    {moneyRunsOutDate && runway < 999 && <span className="text-slate-400"> · through {moneyRunsOutDate}</span>}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums text-white">
                    {savingsTarget > 0 ? `$${Math.round(savingsTarget / 1000)}k` : "\u2014"}
                  </p>
                  <p className="text-[11px] text-slate-500">12-month target</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold tabular-nums ${savingsGap <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {savingsGap <= 0 ? "\u2713" : `$${Math.round(savingsGap / 1000)}k`}
                  </p>
                  <p className="text-[11px] text-slate-500">{savingsGap <= 0 ? "target reached" : "gap to close"}</p>
                </div>
              </div>
            </div>

            {/* ── 2. YOUR OPTIONS, COMPARED — always visible ── */}
            {(() => {
              const allSameRisk = options.every((o) => o.risk === options[0].risk);
              return (
                <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Your options, compared</p>
                  <div className="mt-4 space-y-3">
                    {options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`rounded-xl border p-4 ${opt.recommended ? "border-emerald-700/60 bg-emerald-950/20" : "border-slate-700 bg-slate-800/50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${opt.recommended ? "text-emerald-300" : "text-slate-200"}`}>{opt.label}</p>
                            {opt.recommended && (
                              <span className="rounded-full bg-emerald-900/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300">Recommended</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-lg font-bold tabular-nums ${opt.risk === "Low" ? "text-emerald-400" : opt.risk === "Moderate" ? "text-amber-400" : "text-rose-400"}`}>
                                {formatRunwayHuman(opt.runway)}
                              </p>
                              {opt.key !== "now" && (
                                <p className="text-[10px] text-slate-500">
                                  ${Math.round(totalCash + Math.max(0, monthlySurplus) * (opt.key === "stay3" ? 3 : 6)).toLocaleString()} saved
                                </p>
                              )}
                            </div>
                            {!allSameRisk && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${opt.risk === "Low" ? "bg-emerald-900/40 text-emerald-400" : opt.risk === "Moderate" ? "bg-amber-900/40 text-amber-400" : "bg-rose-900/40 text-rose-400"}`}>
                                {opt.risk}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{opt.tradeoff}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── 3. WHAT MOVES THE NEEDLE — always visible ── */}
            {needleMovers.length > 0 && (
              <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">What moves the needle</p>
                <div className="mt-3 space-y-2.5">
                  {needleMovers.map((insight, i) => (
                    <div key={insight} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className={`mt-0.5 font-bold tabular-nums ${i === 0 ? "text-emerald-400" : "text-slate-500"}`}>{i + 1}.</span>
                      <span className="text-slate-200">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. EMAIL GATE — gates safe quit date, floor, checklist ── */}
            {!gateUnlocked ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 sm:p-7">
                <p className="text-sm font-semibold text-white">Unlock your full Runway Plan.</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  Your safe quit date, worst-case floor, personalized 30-day checklist, and risk analysis — based on your numbers.
                </p>
                <form onSubmit={handleGateSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={gateEmail}
                    onChange={(e) => setGateEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-slate-400 focus:bg-slate-700"
                  />
                  <button
                    type="submit"
                    disabled={gateSubmitting}
                    className="whitespace-nowrap rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                  >
                    {gateSubmitting ? "Sending..." : "Unlock your plan"}
                  </button>
                </form>
                {gateError && <p className="mt-2 text-xs text-rose-400">{gateError}</p>}
                <p className="mt-3 text-[11px] text-slate-500">No spam. Just your plan.</p>
              </div>
            ) : (
              <>
                {/* ── 5. YOUR SAFE QUIT DATE ── */}
                {parsedExpenses > 0 && (
                  <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Your safe quit date</p>
                    {runway >= 12 ? (
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-emerald-400">Now</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          You already have {runway >= 999 ? "full coverage" : `${runway.toFixed(1)} months of runway`}, which exceeds the 12-month safety threshold. You could leave today with financial confidence.
                        </p>
                      </div>
                    ) : safeQuitDate && monthlySurplus > 0 ? (
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-white">{safeQuitDate}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          At your current savings rate of ${Math.round(monthlySurplus).toLocaleString()}/month, you hit 12 months of runway ({`$${Math.round(savingsTarget).toLocaleString()}`}) by this date. That{"\u2019"}s {monthsToTarget} month{monthsToTarget === 1 ? "" : "s"} from now.
                        </p>
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>${Math.round(totalCash).toLocaleString()} saved</span>
                            <span>${Math.round(savingsTarget).toLocaleString()} target</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                              style={{ width: `${Math.min(100, (totalCash / savingsTarget) * 100)}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-slate-500">{Math.round((totalCash / savingsTarget) * 100)}% of target</p>
                        </div>
                      </div>
                    ) : monthlySurplus <= 0 ? (
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-rose-400">Not yet calculable</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          You{"\u2019"}re currently spending more than you earn. Until you create a monthly surplus, your runway is shrinking, not growing. Cut expenses or increase income to establish a safe quit date.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-emerald-400">You{"\u2019"}re there</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          Your savings already cover 12 months of expenses. The financial runway is in place.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── 6. YOUR FLOOR — stress test ── */}
                {floorRunway > 0 && floorRunway < 999 && runway > 0 && runway < 999 && (runway - floorRunway) > 0.5 && (
                  <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Your floor</p>
                    <div className="mt-3 flex items-baseline gap-3">
                      <p className="text-2xl font-bold tabular-nums text-rose-400">{floorRunway.toFixed(1)}</p>
                      <p className="text-sm text-slate-400">months in a tighter scenario</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      If things don{"\u2019"}t go perfectly {"\u2014"} {floorAdjustments.join(", ")} {"\u2014"} your runway drops from{" "}
                      <span className="text-white">{runway.toFixed(1)} months</span> to{" "}
                      <span className="text-rose-300">{floorRunway.toFixed(1)} months</span>.
                      {moneyRunsOutDate && floorDate && (
                        <> Money runs out by {floorDate} instead of {moneyRunsOutDate}.</>
                      )}
                    </p>
                  </div>
                )}

                {/* ── 7. YOUR 30-DAY CHECKLIST ── */}
                <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Your 30-day checklist</p>
                  <div className="mt-4 space-y-3">
                    {checklist.map((item, i) => (
                      <label key={i} className="flex gap-3 cursor-pointer group">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-slate-600 bg-slate-700/50 text-[10px] text-slate-400 group-hover:border-slate-400 transition">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-slate-200">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── 8. STRENGTHS & RISK FLAGS ── */}
                {(strengths.length > 0 || riskFlags.length > 0) && (
                  <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Strengths &amp; risk flags</p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      {strengths.length > 0 && (
                        <div className="space-y-2">
                          {strengths.slice(0, 3).map((s) => (
                            <p key={s} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                              <span className="text-emerald-400 font-bold">+</span>
                              <span>{s}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      {riskFlags.length > 0 && (
                        <div className="space-y-2">
                          {riskFlags.slice(0, 3).map((r) => (
                            <p key={r} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                              <span className="text-rose-400 font-bold">!</span>
                              <span>{r}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 9. THE DEEPER PICTURE — collapsed ── */}
                {archetype !== "None" && (
                  <div className="rounded-xl bg-slate-800">
                    <button type="button" onClick={() => toggleSection("deeper")}
                      className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-400">
                      The deeper picture
                      <svg className={`h-4 w-4 text-slate-400 transition ${openSections["deeper"] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections["deeper"] && (
                      <div className="px-5 pb-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{archetype}</p>
                        <p className="mt-2 text-sm leading-relaxed">
                          <span className="font-medium text-white">{coreTensionParts.lead}</span>
                          {coreTensionParts.rest && <span className="text-slate-400"> {coreTensionParts.rest}</span>}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── 10. ASSUMPTIONS & LIMITS — collapsed ── */}
                <div className="rounded-xl bg-slate-800">
                  <button type="button" onClick={() => toggleSection("analysis")}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-400">
                    Assumptions &amp; limits
                    <svg className={`h-4 w-4 text-slate-400 transition ${openSections["analysis"] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openSections["analysis"] && (
                    <div className="space-y-3 px-5 pb-5 text-xs leading-relaxed text-slate-400">
                      <p className="text-slate-300">{realityCheck}</p>
                      <p>{confidenceExplanation}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Disclaimer */}
            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              This is a decision aid, not financial or career advice.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
