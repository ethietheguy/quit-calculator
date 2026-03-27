"use client";

import React from "react";

type RiskLevel = "Low" | "Moderate" | "High";

type RecommendedPath =
  | "Stay and improve"
  | "Search while employed"
  | "Build more runway before quitting"
  | "Consider taking a break or quitting";

type ClarityAnswer = "Yes" | "Somewhat" | "No";

type ExitTrigger =
  | "Laid off or given notice"
  | "Actively miserable"
  | "Pursuing an opportunity"
  | "Just exploring"
  | "Something specific happened"
  | "";

type ReadinessStage = "Exploring" | "Preparing" | "Ready to Act";
type PrimaryGap = "financial clarity" | "next-step clarity" | "support" | "values alignment" | "none";
type ExitPathway = "imposed timeline" | "deliberate exit" | "exploratory";
type DecisionClarity = "High" | "Medium" | "Low";

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

function clarityScore(a: ClarityAnswer): number {
  return a === "Yes" ? 2 : a === "Somewhat" ? 1 : 0;
}

function getReadinessStage(q1: ClarityAnswer, q2: ClarityAnswer, q3: ClarityAnswer, q4: ClarityAnswer): ReadinessStage {
  const total = clarityScore(q1) + clarityScore(q2) + clarityScore(q3) + clarityScore(q4);
  if (total >= 6) return "Ready to Act";
  if (total >= 3) return "Preparing";
  return "Exploring";
}

function getDecisionClarityLevel(q1: ClarityAnswer, q2: ClarityAnswer): DecisionClarity {
  const total = clarityScore(q1) + clarityScore(q2);
  if (total >= 3) return "High";
  if (total >= 1) return "Medium";
  return "Low";
}

function getPrimaryGap(q1: ClarityAnswer, q2: ClarityAnswer, q3: ClarityAnswer, q4: ClarityAnswer): PrimaryGap {
  const scores: { gap: PrimaryGap; score: number }[] = [
    { gap: "next-step clarity", score: clarityScore(q1) },
    { gap: "financial clarity", score: clarityScore(q2) },
    { gap: "support", score: clarityScore(q3) },
    { gap: "values alignment", score: clarityScore(q4) },
  ];
  const min = Math.min(...scores.map((s) => s.score));
  if (min >= 2) return "none";
  return scores.find((s) => s.score === min)!.gap;
}

function getExitPathway(trigger: ExitTrigger): ExitPathway {
  if (trigger === "Laid off or given notice" || trigger === "Something specific happened") return "imposed timeline";
  if (trigger === "Actively miserable" || trigger === "Pursuing an opportunity") return "deliberate exit";
  return "exploratory";
}

function getRecommendedPath(
  financialRisk: RiskLevel,
  readinessStage: ReadinessStage,
  exitPathway: ExitPathway,
  runway: number,
  valuesAlignment: ClarityAnswer
): RecommendedPath {
  // Imposed timeline (layoff) — urgency changes the calculus
  if (exitPathway === "imposed timeline") {
    if (financialRisk === "Low") return "Consider taking a break or quitting";
    if (financialRisk === "Moderate") return "Search while employed";
    return "Build more runway before quitting";
  }

  // Ready to act + financially safe
  if (readinessStage === "Ready to Act" && financialRisk === "Low") {
    return "Consider taking a break or quitting";
  }

  // Values are clearly misaligned — staying is costly
  if (valuesAlignment === "Yes" && financialRisk !== "High") {
    return "Search while employed";
  }

  if (valuesAlignment === "Yes" && financialRisk === "High") {
    return "Build more runway before quitting";
  }

  // Preparing stage
  if (readinessStage === "Preparing" && financialRisk !== "High") {
    return "Search while employed";
  }

  if (readinessStage === "Preparing" && financialRisk === "High") {
    return "Build more runway before quitting";
  }

  // Exploring — no clear urgency
  if (financialRisk === "High" && runway < 3) {
    return "Build more runway before quitting";
  }

  if (financialRisk === "Low") {
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

function getBestMove(
  readinessStage: ReadinessStage,
  path: RecommendedPath,
  exitPathway: ExitPathway,
  runway: number
): string {
  if (exitPathway === "imposed timeline") {
    if (runway >= 12) return "You have time — use it strategically";
    if (runway >= 6) return "Stabilize your finances, then search";
    return "Lock down income before the clock runs out";
  }

  if (readinessStage === "Ready to Act") {
    if (path === "Consider taking a break or quitting") return "Make the move";
    return "Execute your plan";
  }

  if (readinessStage === "Preparing") {
    if (path === "Search while employed") return "Search while you save";
    if (path === "Build more runway before quitting") return "Set a quit date and build toward it";
    return "Close the gaps, then decide";
  }

  // Exploring
  if (runway < 3) return "Don\u2019t quit without an offer";
  if (path === "Build more runway before quitting") return "Extend your runway first";
  if (path === "Stay and improve") return "Get clear before you move";
  return "Explore deliberately";
}

function formatRunwayHuman(runway: number): string {
  if (runway >= 999) return "Covered";
  if (runway <= 0) return "0";
  const months = Math.floor(runway);
  const weeks = Math.round((runway - months) * 4.33);
  if (weeks === 0 || weeks >= 4) return `${Math.round(runway)} mo`;
  return `${months} mo ${weeks} wk`;
}

function getDecisionMatrixRead(
  q1: ClarityAnswer,
  q2: ClarityAnswer,
  q3: ClarityAnswer,
  q4: ClarityAnswer,
  exitPathway: ExitPathway
): string {
  const total = clarityScore(q1) + clarityScore(q2) + clarityScore(q3) + clarityScore(q4);

  if (exitPathway === "imposed timeline") {
    return "You\u2019re working against a clock. The plan below prioritizes what to lock down first.";
  }

  if (total >= 7) {
    return "You\u2019re further along than most people who use this tool. The numbers below will either confirm your instinct or surface what you\u2019re missing.";
  }

  if (total >= 5) {
    return "You have some clarity but not the full picture yet. The assessment below will sharpen what\u2019s still fuzzy.";
  }

  if (clarityScore(q2) === 0 && clarityScore(q3) === 0) {
    return "You\u2019re in the hardest part \u2014 feeling the pull to leave but not yet clear on the numbers or who to talk to. That\u2019s exactly what this is for.";
  }

  if (clarityScore(q1) === 0) {
    return "You know something needs to change but haven\u2019t landed on what comes next. The plan below starts there.";
  }

  if (clarityScore(q2) === 0) {
    return "The financial picture is still unclear. The numbers below will give you something concrete to work with.";
  }

  return "You\u2019re early in this process. That\u2019s fine \u2014 better to think it through now than to react under pressure later.";
}

function getNormalizationParagraph(age: number | ""): string | null {
  const a = typeof age === "number" ? age : parseFloat(String(age || "0"));
  if (!Number.isFinite(a) || a < 24 || a > 35) return null;
  return "Career reassessment in the late twenties and early thirties is common; you are not alone in questioning your path.";
}

function getSituationSummary(
  runway: number,
  financialRisk: RiskLevel,
  path: RecommendedPath,
  readinessStage: ReadinessStage,
  primaryGap: PrimaryGap
): string {
  const runwayText =
    runway <= 0
      ? "Right now, the tool cannot see a clear financial runway because monthly expenses are zero or missing."
      : runway >= 999
      ? "Your safety net fully covers your expenses."
      : `You have about ${runway.toFixed(1)} months of runway based on what you entered.`;

  const riskText = `Financially, this looks like ${financialRisk.toLowerCase()} risk.`;

  const gapText = primaryGap !== "none"
    ? ` The biggest gap in your readiness right now is ${primaryGap}.`
    : "";

  if (path === "Consider taking a break or quitting") {
    return `${runwayText} ${riskText}${gapText} Together, that suggests you have enough buffer to seriously consider stepping away if that aligns with your values and support system.`;
  }

  if (path === "Build more runway before quitting") {
    return `${runwayText} ${riskText}${gapText} That points to focusing on stability first so that any exit is on your terms, not forced by money stress.`;
  }

  if (path === "Search while employed") {
    return `${runwayText} ${riskText}${gapText} That mix often pairs well with keeping your current income while you quietly explore roles that fit you better.`;
  }

  // Stay and improve
  return `${runwayText} ${riskText}${gapText} Given that, this tool leans toward improving your current situation before making any drastic moves.`;
}

function getYourMove(
  path: RecommendedPath,
  primaryGap: PrimaryGap,
  exitPathway: ExitPathway,
  runway: number,
  income: number,
  expenses: number,
  q3Support: ClarityAnswer
): { thisWeek: string; thisMonth: string; beforeYouDecide: string } {
  const monthlySurplus = income - expenses;

  // THIS WEEK — one specific action, driven by primary gap
  let thisWeek: string;
  if (exitPathway === "imposed timeline") {
    thisWeek = "Get your exact last day, severance terms, and benefits end date in writing. Everything else follows from those dates.";
  } else if (primaryGap === "next-step clarity") {
    thisWeek = "Write down 3 realistic scenarios for what comes after this job. Not dream jobs — plausible next moves. You need options to evaluate, not a fantasy to chase.";
  } else if (primaryGap === "financial clarity") {
    if (monthlySurplus > 0) {
      thisWeek = `Set up a separate savings account with a $${Math.round(monthlySurplus * 0.7).toLocaleString()}/mo auto-transfer. Automate the runway you need.`;
    } else {
      thisWeek = "List every subscription and recurring charge. Most people find $200\u2013400/mo they forgot about. That\u2019s not budgeting \u2014 it\u2019s buying time.";
    }
  } else if (primaryGap === "support") {
    thisWeek = "Tell one person you trust that you\u2019re seriously considering leaving. Not for advice \u2014 to hear yourself say it out loud.";
  } else if (path === "Consider taking a break or quitting") {
    thisWeek = "Tell one person you trust that you\u2019re seriously considering leaving. Not for advice \u2014 to hear yourself say it out loud.";
  } else if (path === "Search while employed") {
    thisWeek = "Reach out to 2 people in roles you find interesting. Ask: \u2018What\u2019s the worst part nobody talks about?\u2019 You\u2019re gathering intelligence, not job hunting.";
  } else if (path === "Build more runway before quitting") {
    if (monthlySurplus > 0) {
      thisWeek = `Set up a separate savings account with a $${Math.round(monthlySurplus * 0.7).toLocaleString()}/mo auto-transfer. Automate the runway you need.`;
    } else {
      thisWeek = "List every subscription and recurring charge. Most people find $200\u2013400/mo they forgot about. That\u2019s not budgeting \u2014 it\u2019s buying time.";
    }
  } else {
    thisWeek = "Write down the 3 things that would need to change for you to feel good about staying. Be honest about which ones are in your control.";
  }

  // THIS MONTH — the career move, driven by primary gap and pathway
  let thisMonth: string;
  if (exitPathway === "imposed timeline") {
    thisMonth = "File for unemployment, research health coverage (COBRA vs. marketplace), and reach out to 5 people in your network. You\u2019re building a bridge, not just jumping.";
  } else if (primaryGap === "next-step clarity") {
    thisMonth = "Spend 5 hours this month on informational conversations with people doing work you\u2019re curious about. You\u2019re not job hunting \u2014 you\u2019re testing hypotheses about what fits.";
  } else if (primaryGap === "financial clarity") {
    thisMonth = "Build a real post-exit budget: housing, insurance, food, debt, and a 15% buffer for surprises. The number you\u2019re afraid of is usually less scary once it\u2019s specific.";
  } else if (primaryGap === "values alignment") {
    thisMonth = "Keep a 2-week log of what drains you vs. what energizes you. The pattern will tell you whether this is a bad job or a bad fit \u2014 those require different solutions.";
  } else if (q3Support === "No") {
    thisMonth = "Find a sounding board \u2014 a coach, a mentor, a trusted friend outside your company. Decisions made in isolation tend to be either too cautious or too reckless.";
  } else if (path === "Consider taking a break or quitting") {
    thisMonth = "Draft a 90-day plan for your first 3 months after leaving. What will you do with the time? Not having an answer is a signal worth paying attention to.";
  } else {
    thisMonth = "Reach out to 3 people in roles or companies you\u2019re curious about. Ask what they\u2019d change about their job. Real intelligence beats job board browsing.";
  }

  // BEFORE YOU DECIDE — the financial grounding
  let beforeYouDecide: string;
  if (runway >= 999) {
    beforeYouDecide = "Your safety net covers you. The risk isn\u2019t financial \u2014 it\u2019s staying too long because you can afford to. Set a decision deadline and honor it.";
  } else if (runway >= 12) {
    beforeYouDecide = "You have over a year of runway. Stop using money as the reason to stay. The real question: what are you afraid happens if you actually leave?";
  } else if (monthlySurplus > 0 && runway < 12) {
    beforeYouDecide = `Every month you stay adds ${(monthlySurplus / expenses).toFixed(1)} months of runway. Pick your target number and work backward to a quit date.`;
  } else if (runway < 3) {
    beforeYouDecide = "With less than 3 months of runway, don\u2019t quit without an offer or a concrete plan. That\u2019s not fear \u2014 it\u2019s strategy.";
  } else {
    beforeYouDecide = "Get to 6 months of runway. That\u2019s the threshold where most people stop making fear-based decisions.";
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
  readinessStage: ReadinessStage,
  primaryGap: PrimaryGap,
  exitPathway: ExitPathway,
  financialRisk: RiskLevel,
  valuesAlignment: ClarityAnswer
): string {
  const base =
    "This tool can surface patterns, but it cannot see your full life, identity, or responsibilities.";

  if (exitPathway === "imposed timeline") {
    return `${base} When a timeline is imposed on you, the instinct is to rush. Resist it where you can. Even with a deadline, most decisions benefit from a week of structured thinking rather than a weekend of panic.`;
  }

  if (primaryGap === "support") {
    return `${base} Making a career decision without a sounding board is like navigating without a map. The numbers here are useful, but they are not a substitute for a real conversation with someone who knows you.`;
  }

  if (primaryGap === "values alignment") {
    return `${base} If you are not sure whether staying is actually costing you something important, slow down. The urge to leave can be a signal or a symptom. A two-week observation log can help you tell the difference.`;
  }

  if (valuesAlignment === "Yes" && financialRisk === "Low") {
    return `${base} The numbers here suggest you are more resourced than your inner critic might admit. When staying is genuinely costing you something and the money supports the move, the remaining hesitation is usually about identity, not logistics.`;
  }

  if (valuesAlignment === "Yes" && financialRisk === "High") {
    return `${base} You feel the cost of staying, but the money is tight. That is the hardest combination. You do not need to solve everything this month; steadily improving your financial position is still real progress toward the exit you want.`;
  }

  if (readinessStage === "Exploring") {
    return `${base} You are early in this process, and that is fine. Restlessness can be a healthy signal that you are ready for more depth or alignment \u2014 not a guarantee that you picked the wrong path. Treat this as data, not a verdict.`;
  }

  if (readinessStage === "Ready to Act") {
    return `${base} Your inputs suggest you have thought this through. The risk at this stage is not impulsiveness \u2014 it is overthinking a decision you have already made. Trust the preparation you have done.`;
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
  readinessStage: ReadinessStage,
  primaryGap: PrimaryGap,
  exitPathway: ExitPathway,
  financialRisk: RiskLevel,
  runway: number,
  valuesAlignment: ClarityAnswer,
  nextStepClarity: ClarityAnswer
): string {
  // This names the REAL thing the person is wrestling with

  if (exitPathway === "imposed timeline" && financialRisk === "High") {
    return "You didn\u2019t choose this timeline and the money is tight. That\u2019s the hardest combination. The goal isn\u2019t to feel better about the situation \u2014 it\u2019s to make the best moves available to you right now, even if they\u2019re not the ones you\u2019d choose with more time.";
  }

  if (exitPathway === "imposed timeline") {
    return "A forced timeline removes one kind of uncertainty but creates another. You don\u2019t have to decide what you want forever \u2014 you just have to decide what you\u2019re doing next. Focus there.";
  }

  if (valuesAlignment === "Yes" && financialRisk === "Low" && nextStepClarity === "Yes") {
    return "You know what\u2019s costing you, you know what comes next, and the money supports the move. The only thing between you and action is the fear of being wrong. That fear doesn\u2019t go away \u2014 you just have to decide it\u2019s worth walking through.";
  }

  if (valuesAlignment === "Yes" && financialRisk === "Low") {
    return "You can afford to leave and staying is costing you something real. The tension isn\u2019t financial \u2014 it\u2019s that you haven\u2019t fully committed to what comes next. Name what\u2019s holding you back. That\u2019s where the real decision lives.";
  }

  if (valuesAlignment === "Yes" && financialRisk === "High") {
    return "Staying is costing you something important but you can\u2019t afford to leave yet. That\u2019s a real bind, not a failure of nerve. The path out is slower than you want, but it exists: stabilize the money, then make the move.";
  }

  if (valuesAlignment === "No" && readinessStage === "Exploring") {
    return "You\u2019re not sure staying is actually hurting you, and you don\u2019t have a clear next step. That\u2019s not indecision \u2014 it\u2019s the honest starting point. The risk isn\u2019t making the wrong move; it\u2019s spending years in comfortable limbo because no single moment is bad enough to force a change.";
  }

  if (primaryGap === "support") {
    return "You\u2019re carrying this decision alone, and that makes everything harder. Decisions made in isolation tend to be either too cautious or too impulsive. The most useful thing you can do right now isn\u2019t financial \u2014 it\u2019s finding someone to think this through with.";
  }

  if (primaryGap === "financial clarity") {
    return "The financial picture is the thing you\u2019re most uncertain about, and that uncertainty is keeping you stuck. You don\u2019t need perfect numbers \u2014 you need a realistic range. Once the money question has a real answer instead of a feeling, the rest gets clearer.";
  }

  if (primaryGap === "next-step clarity") {
    return "You know something needs to change but haven\u2019t figured out what comes after. That\u2019s the hardest gap to close because it requires experimentation, not just planning. You can\u2019t think your way to the right career \u2014 you have to try things.";
  }

  if (readinessStage === "Ready to Act" && financialRisk !== "High") {
    return "Your readiness is high and the money works. The only thing left is the leap itself. Most people at this stage aren\u2019t missing information \u2014 they\u2019re waiting for certainty that never comes. Set a date and hold it.";
  }

  return "Your situation has real tension in it, and there\u2019s no clean answer. That\u2019s normal. The goal isn\u2019t to find the perfect move \u2014 it\u2019s to find one that\u2019s good enough and that you can commit to without looking back every week.";
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
  runwayStay3: number,
  moneyRunsOutDate: string | null,
  readinessStage: ReadinessStage,
  exitPathway: ExitPathway
): string {
  const targetStr = `$${Math.round(savingsTarget).toLocaleString()}`;
  const gapStr = `$${Math.round(savingsGap).toLocaleString()}`;
  const dateStr = moneyRunsOutDate ? `Your savings would last until ${moneyRunsOutDate}. ` : "";

  // Imposed timeline gets its own logic
  if (exitPathway === "imposed timeline") {
    if (runway >= 12) {
      return `${dateStr}You have a timeline imposed on you, but the money gives you room. Use the transition period to be strategic, not reactive.`;
    }
    if (runway >= 6) {
      return `${dateStr}You\u2019re on a clock, but you have enough runway to search thoughtfully. Prioritize income replacement over dream-job hunting.`;
    }
    return `${dateStr}Your timeline is imposed and your margin is thin. Prioritize income replacement immediately \u2014 refinement comes after stability.`;
  }

  // Ready to Act
  if (readinessStage === "Ready to Act") {
    if (runway >= 18) {
      return `${dateStr}You have the margin to be fully deliberate about what comes next. This isn\u2019t a financial decision anymore \u2014 it\u2019s a strategic one.`;
    }
    if (runway >= 12) {
      return `${dateStr}You\u2019ve cleared the 12-month safety threshold. You can afford to move on your own timeline, not someone else\u2019s.`;
    }
    return `${dateStr}Your readiness is high but your financial margin isn\u2019t there yet. Close the gap to ${targetStr} before you act.`;
  }

  // Exploring — financial risk is the main driver
  if (readinessStage === "Exploring") {
    if (monthlySurplus < 0) {
      return `You\u2019re spending more than you earn \u2014 your runway is shrinking, not growing. ${dateStr}Before you can plan an exit, you need to stop the bleeding: cut expenses or increase income.`;
    }
    if (runway < 3) {
      return `${dateStr}With less than 3 months of margin, you don\u2019t have room for an unplanned exit. Your priority is creating breathing room \u2014 not making a career decision under this kind of pressure.`;
    }
    if (runway >= 12) {
      return `${dateStr}With a safety net backing you, you have more room than the raw number suggests. Use this time to get clearer on what you actually want.`;
    }
    return `${dateStr}You\u2019re still exploring, and that\u2019s fine. Focus on building toward ${targetStr} while you clarify what comes next.`;
  }

  // Preparing
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
  primaryGap: PrimaryGap,
  exitPathway: ExitPathway,
  q3Support: ClarityAnswer
): string[] {
  const items: string[] = [];
  const surplus = Math.max(0, monthlySurplus);
  const autoTransfer = Math.round(surplus * 0.7);
  const gap = Math.max(0, savingsTarget - totalCash);

  if (path === "Consider taking a break or quitting") {
    items.push(`Move $${Math.round(totalCash).toLocaleString()} into a dedicated "runway account." Separate it from investments and daily spending.`);
    if (!hasHealthCoverage) {
      items.push("Research health coverage: COBRA (~$600/mo) vs. marketplace ($400\u2013$550/mo). Budget for this starting day one.");
    }
    if (parsedUnemployment > 0) {
      items.push(`File for unemployment benefits immediately after your last day. That\u2019s ~$${Math.round(parsedUnemployment).toLocaleString()}/month for up to 6 months.`);
    } else {
      items.push("Check your state\u2019s unemployment eligibility. Most professionals qualify for $1,500\u2013$2,500/month for 6 months.");
    }
    if (primaryGap === "next-step clarity") {
      items.push("Draft a 90-day plan for what you\u2019ll do after leaving. Structure prevents drift.");
    }
    items.push("Set a \u201Cdecision check-in\u201D date 90 days out. Put it in your calendar now. Revisit this plan then.");
    if (q3Support === "No") {
      items.push("Find a sounding board before you finalize anything \u2014 a coach, mentor, or trusted friend outside your company.");
    } else if (parsedPartnerIncome > 0) {
      items.push("Have the money conversation with your partner: share this plan, your runway number, and your timeline.");
    } else {
      items.push("Tell one person you trust about your plan and your timeline. Not for advice \u2014 for accountability.");
    }
  } else if (path === "Build more runway before quitting") {
    if (surplus > 0) {
      items.push(`Set up auto-transfer: $${autoTransfer.toLocaleString()}/month to a separate savings account. ${safeQuitDate ? `This gets you to your target by ${safeQuitDate}.` : "Every month counts."}`);
    }
    items.push(`Your target is $${Math.round(savingsTarget).toLocaleString()} (12 months of expenses). You\u2019re $${Math.round(gap).toLocaleString()} away.`);
    items.push("Audit subscriptions and recurring charges this week. Most people find $200\u2013$400/month they forgot about.");
    if (!hasHealthCoverage) {
      items.push("Start researching health coverage options now. Budget $400\u2013$600/month in your post-exit expenses.");
    }
    if (primaryGap === "next-step clarity") {
      items.push("While you build runway, start exploring what comes next. Informational conversations cost nothing and compound.");
    }
    items.push(`Set a calendar reminder to revisit this plan in 30 days. ${safeQuitDate ? `Your safe quit date is ${safeQuitDate} \u2014 track against it.` : "Track your savings progress."}`);
  } else if (path === "Search while employed") {
    items.push("Update your resume and LinkedIn this week. Not tomorrow \u2014 this week.");
    if (surplus > 0) {
      items.push(`Keep saving: $${autoTransfer.toLocaleString()}/month auto-transfer while you search. ${safeQuitDate ? `You hit 12-month safety by ${safeQuitDate}.` : ""}`);
    }
    items.push("Reach out to 3 people in roles or companies you\u2019re curious about. Ask what they\u2019d change about their job.");
    if (!hasHealthCoverage) {
      items.push("Don\u2019t accept an offer without comparing health coverage. Budget $400\u2013$600/month if you\u2019ll have a gap.");
    }
    items.push("Set a search deadline: if nothing promising in 90 days, reassess whether the issue is the market or the target.");
    if (parsedSeverance > 0) {
      items.push(`Your severance of $${Math.round(parsedSeverance).toLocaleString()} gives you extra cushion. Factor it in, but don\u2019t count on it until it\u2019s confirmed in writing.`);
    }
  } else {
    // Stay and improve
    items.push("Write down the 3 specific things that would need to change for you to feel good about staying 12 more months.");
    items.push("Share those 3 things with your manager within 2 weeks. If you can\u2019t, that tells you something.");
    if (surplus > 0) {
      items.push(`Keep building runway: $${autoTransfer.toLocaleString()}/month auto-transfer. Options feel different when you have 12 months of savings.`);
    }
    items.push("Set a 90-day check-in: if nothing has improved by then, switch to an active search.");
    if (primaryGap === "financial clarity") {
      items.push("Build a real budget this week. The number you need to feel safe is probably lower than you think.");
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
  const [q1NextStep, setQ1NextStep] = React.useState<ClarityAnswer>("No");
  const [q2Financial, setQ2Financial] = React.useState<ClarityAnswer>("No");
  const [q3Support, setQ3Support] = React.useState<ClarityAnswer>("No");
  const [q4Values, setQ4Values] = React.useState<ClarityAnswer>("No");
  const [exitTrigger, setExitTrigger] = React.useState<ExitTrigger>("");
  const [partnerIncome, setPartnerIncome] = React.useState<number | "">("");
  const [familySupport, setFamilySupport] = React.useState<number | "">("");
  const [unemploymentBenefits, setUnemploymentBenefits] = React.useState<number | "">("");
  const [netWorth, setNetWorth] = React.useState<number | "">("");
  const [hasHealthCoverage, setHasHealthCoverage] = React.useState(true);
  const [debtPayments, setDebtPayments] = React.useState<number | "">("");
  const [taxRate, setTaxRate] = React.useState(30); // effective tax rate on severance + unemployment
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
  const parsedUnemploymentGross = parsedWeeklyUnemployment * 4.33; // weekly → monthly (gross)
  const parsedNetWorth = typeof netWorth === "number" ? netWorth : parseFloat(netWorth || "0");
  const parsedDebtPayments = typeof debtPayments === "number" ? debtPayments : parseFloat(debtPayments || "0");

  // Apply tax rate to severance and unemployment (both are taxable income)
  const taxMultiplier = 1 - taxRate / 100;
  const afterTaxSeverance = parsedSeverance * taxMultiplier;
  const parsedUnemployment = parsedUnemploymentGross * taxMultiplier; // after-tax monthly

  const effectiveExpenses = parsedExpenses + parsedDebtPayments;

  const UNEMPLOYMENT_MONTHS = 6;
  const monthlySafetyNet = parsedPartnerIncome + parsedFamilySupport + parsedUnemployment;
  const ongoingSafetyNet = parsedPartnerIncome + parsedFamilySupport; // after unemployment expires
  const phase1Expenses = Math.max(0, effectiveExpenses - monthlySafetyNet); // first 6 months
  const phase2Expenses = Math.max(0, effectiveExpenses - ongoingSafetyNet); // after unemployment ends

  // Runway accounts for unemployment benefits lasting only 6 months
  const totalCash = parsedSavings + afterTaxSeverance;
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

  // Decision matrix derived values
  const readinessStage = getReadinessStage(q1NextStep, q2Financial, q3Support, q4Values);
  const decisionClarityLevel = getDecisionClarityLevel(q1NextStep, q2Financial);
  const primaryGap = getPrimaryGap(q1NextStep, q2Financial, q3Support, q4Values);
  const exitPathway = getExitPathway(exitTrigger);
  const decisionMatrixRead = getDecisionMatrixRead(q1NextStep, q2Financial, q3Support, q4Values, exitPathway);

  const financialRisk = getFinancialRisk(runway);
  const recommendedPath = getRecommendedPath(financialRisk, readinessStage, exitPathway, runway, q4Values);
  const headline = getHeadline(recommendedPath);
  const situationSummary = getSituationSummary(
    runway,
    financialRisk,
    recommendedPath,
    readinessStage,
    primaryGap
  );
  const yourMove = getYourMove(recommendedPath, primaryGap, exitPathway, runway, parsedIncome, parsedExpenses, q3Support);
  const needleMovers = getWhatMovesTheNeedle(runway, effectiveExpenses, parsedIncome, afterTaxSeverance, parsedPartnerIncome, hasHealthCoverage, adjustedRunway, runwayStay3, runwayStay6, safeQuitDate);

  // Field-count confidence score
  const optionalFieldLabels: { filled: boolean; label: string }[] = [
    { filled: exitTrigger !== "", label: "exit trigger" },
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
    filledCount >= 6 ? "High" : filledCount >= 3 ? "Medium" : "Low";
  const missingFieldLabels = optionalFieldLabels.filter((f) => !f.filled).map((f) => f.label);
  const confidenceExplanation = `Based on ${filledCount} of ${totalOptional} optional fields.${
    missingFieldLabels.length > 0
      ? ` Adding ${missingFieldLabels.slice(0, 2).join(" and ")} would most improve accuracy.`
      : ""
  }`;

  const normalizationParagraph = getNormalizationParagraph(age);
  const careerTimingPerspective = getCareerTimingPerspective(age);

  const whyParts: string[] = [situationSummary];
  if (careerTimingPerspective) whyParts.push(careerTimingPerspective);
  const whyParagraph = whyParts.join(" ");

  // Readiness tier
  type ReadinessTier = "Build More Runway" | "Prepare to Leave" | "Clear to Go";
  const hasSafetyNet = parsedPartnerIncome > 0 || parsedFamilySupport > 0 || parsedUnemployment > 0;
  const readinessTier: ReadinessTier = (() => {
    if (runway >= 12 || (runway >= 9 && hasSafetyNet)) return "Clear to Go";
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
  if (runway > 9) strengths.push(`You have ${runway >= 999 ? "full coverage" : `${runway.toFixed(1)} months`} of runway \u2014 more than most people who make this transition.`);
  if (parsedPartnerIncome > 0) strengths.push("Partner income provides a financial safety net during your transition.");
  if (monthlySurplus > 1000) strengths.push("Your savings rate is strong \u2014 every month you stay adds meaningfully to your runway.");
  if (parsedSeverance > 0) strengths.push(`Expected severance of $${Math.round(afterTaxSeverance).toLocaleString()} after taxes extends your effective runway.`);
  if (q1NextStep === "Yes") strengths.push("You have a clear picture of what comes next \u2014 that\u2019s a significant advantage most people don\u2019t have at this stage.");
  if (q3Support === "Yes") strengths.push("You have someone to talk this through with. That support meaningfully improves decision quality.");
  if (runway < 4 && runway > 0) riskFlags.push("Less than 4 months of runway creates significant pressure to accept the first opportunity available.");
  if (exitPathway === "imposed timeline" && runway < 6 && runway > 0) riskFlags.push("An imposed timeline combined with a short runway is high-risk. Prioritize income replacement over optimization.");
  if (q3Support === "No") riskFlags.push("You\u2019re making this decision without a sounding board. Decisions made in isolation tend to have blind spots.");
  if (parsedPartnerIncome === 0 && parsedFamilySupport === 0) riskFlags.push("Your runway is entirely self-funded. There\u2019s no external safety net factored in.");
  if (!hasHealthCoverage) riskFlags.push("You\u2019ll need marketplace health coverage, which typically costs $400\u2013600/month and isn\u2019t factored into most people\u2019s initial estimates.");
  if (parsedIncome > 0 && parsedExpenses > 0 && parsedIncome <= parsedExpenses) riskFlags.push("You\u2019re currently spending more than you earn \u2014 your runway is actively shrinking.");

  const readinessTierColor =
    readinessTier === "Clear to Go" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
    readinessTier === "Prepare to Leave" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
    "border-rose-700/50 bg-rose-900/30 text-rose-300";

  const bestMove = getBestMove(readinessStage, recommendedPath, exitPathway, runway);

  const stageColor =
    readinessStage === "Ready to Act" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
    readinessStage === "Preparing" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
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

  const realityCheck = getRealityCheck(readinessStage, primaryGap, exitPathway, financialRisk, q4Values);

  const coreTension = getCoreTension(readinessStage, primaryGap, exitPathway, financialRisk, runway, q4Values, q1NextStep);

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
    runwayStay3,
    moneyRunsOutDate,
    readinessStage,
    exitPathway
  );

  const checklist = getChecklist(
    recommendedPath,
    runway,
    monthlySurplus,
    effectiveExpenses,
    totalCash,
    savingsTarget,
    safeQuitDate,
    afterTaxSeverance,
    hasHealthCoverage,
    parsedUnemployment,
    parsedPartnerIncome,
    primaryGap,
    exitPathway,
    q3Support
  );

  const hasFinancialInputs = effectiveExpenses > 0;
  const hasAnySavings = parsedSavings > 0 || parsedSeverance > 0;
  const showLiveRunway = hasAnySavings || hasFinancialInputs;
  const [copied, setCopied] = React.useState(false);

  const handleShareProfile = async () => {
    const runwayText =
      runway && Number.isFinite(runway)
        ? `${runway.toFixed(1)} months of runway`
        : "runway not yet calculated";

    const totalCashText = totalCash > 0
      ? `$${Math.round(totalCash).toLocaleString()} total cash (savings${parsedSeverance > 0 ? ` + $${Math.round(afterTaxSeverance).toLocaleString()} severance after tax` : ""})`
      : null;

    const shareLines = [
      "My Runway Assessment:",
      `Stage: ${readinessStage}`,
      `Runway: ${runwayText}`,
      ...(totalCashText ? [`Est. cash available: ${totalCashText}`] : []),
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
    // Email capture disabled for preview — just unlock
    setGateUnlocked(true);
    setGateSubmitting(false);
  };

  // Collapsible section state
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

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
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Career Decision Tool</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            A structured assessment of your financial readiness to leave — and a concrete plan for what to do next.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            No account required. Nothing stored. Your data stays in your browser.
          </p>
        </header>

        {/* ── Card 1: Where you are in this decision ── */}
        <section className="space-y-5 rounded-2xl bg-slate-800 p-5 sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Where you are in this decision</p>
            <p className="mt-1.5 text-xs text-slate-400">Five questions to ground the analysis in your actual situation.</p>
          </div>

          {/* Q1 — Next step clarity */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">I know what I would do next if I left.</p>
            <div className="flex gap-2">
              {(["Yes", "Somewhat", "No"] as ClarityAnswer[]).map((opt) => (
                <button key={opt} type="button" onClick={() => setQ1NextStep(opt)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    q1NextStep === opt
                      ? "border-white bg-white/10 text-white"
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 — Financial confidence */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">I have a clear picture of how long my money would last.</p>
            <div className="flex gap-2">
              {(["Yes", "Somewhat", "No"] as ClarityAnswer[]).map((opt) => (
                <button key={opt} type="button" onClick={() => setQ2Financial(opt)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    q2Financial === opt
                      ? "border-white bg-white/10 text-white"
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 — Support */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">I have someone I trust to talk this through with.</p>
            <div className="flex gap-2">
              {(["Yes", "Somewhat", "No"] as ClarityAnswer[]).map((opt) => (
                <button key={opt} type="button" onClick={() => setQ3Support(opt)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    q3Support === opt
                      ? "border-white bg-white/10 text-white"
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q4 — Values alignment */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">Staying in this job is costing me something important.</p>
            <div className="flex gap-2">
              {(["Yes", "Somewhat", "No"] as ClarityAnswer[]).map((opt) => (
                <button key={opt} type="button" onClick={() => setQ4Values(opt)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    q4Values === opt
                      ? "border-white bg-white/10 text-white"
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q5 — Exit trigger */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">What prompted you to look at this today?</p>
            <select value={exitTrigger}
              onChange={(e) => setExitTrigger(e.target.value as ExitTrigger)}
              className={inputClassNoDollar}>
              <option value="">Select one</option>
              <option value="Laid off or given notice">I was laid off or given notice</option>
              <option value="Actively miserable">I{"\u2019"}m actively miserable</option>
              <option value="Pursuing an opportunity">I have an opportunity I want to pursue</option>
              <option value="Just exploring">I{"\u2019"}m just exploring</option>
              <option value="Something specific happened">Something specific happened recently</option>
            </select>
          </div>

          {/* Dynamic read */}
          <p className="mt-1 text-center text-sm italic text-slate-400">{decisionMatrixRead}</p>
        </section>

        {/* ── Card 2: Your financial picture ── */}
        <section className="space-y-5 rounded-2xl bg-slate-800 p-5 sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Your financial picture</p>
            <p className="mt-1.5 text-xs text-slate-400">Monthly after-tax numbers. These drive your runway calculation.</p>
          </div>
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
          <p className="py-4 text-center text-sm text-slate-500">Enter your financial details above to generate your assessment.</p>
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
                <label className="block text-sm font-medium text-slate-200">Expected severance (gross)</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                  <input type="number" min={0} value={severance}
                    onChange={(e) => setSeverance(e.target.value === "" ? "" : Number(e.target.value))}
                    className={inputClass} placeholder="0" />
                </div>
                {parsedSeverance > 0 && (
                  <p className="text-xs text-slate-400">After {taxRate}% tax: <span className="text-slate-300">${Math.round(afterTaxSeverance).toLocaleString()}</span></p>
                )}
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

            {/* Effective tax rate */}
            {(parsedSeverance > 0 || parsedWeeklyUnemployment > 0) && (
              <div className="space-y-2 rounded-xl border border-slate-600 bg-slate-700/30 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Estimated tax rate on severance &amp; unemployment</p>
                    <p className="text-xs text-slate-400">Federal + state. Severance is taxed as supplemental income; unemployment is taxed as ordinary income.</p>
                  </div>
                  <span className="rounded-full bg-slate-600 px-2.5 py-0.5 text-xs font-bold text-slate-200">{taxRate}%</span>
                </div>
                <input type="range" min={0} max={50} value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full accent-slate-400" />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (no tax)</span>
                  <span>50%</span>
                </div>
              </div>
            )}

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
                  <label className="block text-xs font-medium text-slate-300">Unemployment benefits (gross)</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                    <input type="number" min={0} value={unemploymentBenefits}
                      onChange={(e) => setUnemploymentBenefits(e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputClass} placeholder="e.g. 450" />
                  </div>
                  <p className="text-[10px] text-slate-500">Weekly gross amount, typically $300–$600. Taxed at your rate above.</p>
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
                    `${readinessStage} · ${bestMove}`,
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
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${stageColor}`}>{readinessStage}</span>
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
                  <p className="text-[11px] text-slate-500">{savingsGap <= 0 ? "target reached" : "short of 12-mo target"}</p>
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
                <p className="text-sm font-semibold text-white">See the full assessment.</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  Your safe quit date, worst-case stress test, personalized 30-day action plan, and risk profile — all calculated from your inputs.
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
                    {gateSubmitting ? "Loading..." : "Continue"}
                  </button>
                </form>
                {gateError && <p className="mt-2 text-xs text-rose-400">{gateError}</p>}
                <p className="mt-3 text-[11px] text-slate-500">Enter any email to continue. Nothing is stored or sent.</p>
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
                <div className="rounded-xl bg-slate-800">
                  <button type="button" onClick={() => toggleSection("deeper")}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-400">
                    The deeper picture
                    <svg className={`h-4 w-4 text-slate-400 transition ${openSections["deeper"] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openSections["deeper"] && (
                    <div className="px-5 pb-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">What you{"\u2019"}re really deciding</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {coreTension}
                      </p>
                    </div>
                  )}
                </div>

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
              This is a decision-support tool, not financial or career advice. Consult a qualified professional before making major financial decisions.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
