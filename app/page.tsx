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

function getNextSteps(path: RecommendedPath, archetype: Archetype, runway: number, satisfaction: number, growth: number, income: number, expenses: number, burnoutDriver: BurnoutDriver, burnoutScore: number, age: number | ""): string[] {
  const steps: string[] = [];
  const monthlySurplus = income - expenses;
  const parsedAge = typeof age === "number" ? age : 0;

  // Step 1: The specific thing to do THIS WEEK
  if (path === "Consider taking a break or quitting") {
    if (runway >= 18) {
      steps.push("This week: tell one person you trust that you're seriously considering leaving. Not to get advice — to say it out loud and see how it feels. You have the money. The question is whether you have the permission you're waiting for from yourself.");
    } else {
      steps.push("This week: block 2 hours and write down what your first 30 days after quitting would actually look like. Not a fantasy — the real version. If you can picture it clearly and it doesn't terrify you, that's a signal.");
    }
  } else if (path === "Search while employed") {
    steps.push("This week: reach out to 3 people who have jobs you find interesting and ask them one question: 'What's the worst part of your role that nobody talks about?' You're not job hunting yet — you're gathering intelligence so you don't jump into something equally wrong.");
  } else if (path === "Build more runway before quitting") {
    if (monthlySurplus > 0) {
      const targetMonths = Math.max(0, 6 - runway);
      const monthsToTarget = targetMonths > 0 ? Math.ceil((targetMonths * expenses) / monthlySurplus) : 0;
      steps.push(`This week: open a separate savings account and set up a $${Math.round(monthlySurplus * 0.7).toLocaleString()} auto-transfer. In ${monthsToTarget || "a few"} months you'll have 6 months of runway, and that changes everything about how trapped you feel.`);
    } else {
      steps.push("This week: list every subscription and recurring charge you have. Most people find $200-400/month they forgot about. That's not budgeting — it's buying yourself time.");
    }
  } else {
    steps.push("This week: write down the 3 specific things that would need to change for you to feel good about staying. Then ask yourself honestly — are any of them in your control? If yes, start with the smallest one.");
  }

  // Step 2: Week 2 — the real career move based on what's actually wrong
  if (burnoutDriver === "Toxic culture") {
    steps.push("Week 2: The environment is the problem, not you. No amount of boundary-setting fixes a fundamentally broken culture. Focus your energy on getting out — the same work at a healthy company will feel like a different career.");
  } else if (burnoutDriver === "Lack of meaning") {
    if (satisfaction <= 4) {
      steps.push("Week 2: You're not burned out from too much work — you're burned out from work that doesn't matter to you. Before changing jobs, get clear on what 'meaningful' actually means for you. Is it impact? Autonomy? Creative expression? The answer changes where you should look.");
    } else {
      steps.push("Week 2: The meaning gap is real but it doesn't always require a career change. Sometimes it's a project, a side thing, or a team switch. Try volunteering your skills somewhere that matters to you for 5 hours a week and see if that changes the math.");
    }
  } else if (burnoutDriver === "Workload / hours") {
    steps.push("Week 2: Run one experiment — say no to something you would normally say yes to. If the world doesn't end, do it again. If your boss punishes boundaries, that tells you everything you need to know about whether this is fixable.");
  } else if (burnoutDriver === "Lack of growth") {
    if (parsedAge > 0 && parsedAge <= 30) {
      steps.push("Week 2: You're early enough that a lateral move to a faster-growing company can restart your trajectory without starting over. Look for smaller companies where you'd be slightly over your head — that's where growth lives.");
    } else {
      steps.push("Week 2: Growth stalls usually mean you've outgrown the role, not that you've peaked. Talk to your manager about what the next level looks like. If they can't articulate it clearly in two weeks, they're telling you there isn't one here.");
    }
  } else if (burnoutDriver === "Compensation mismatch") {
    steps.push("Week 2: Get your market number. Use levels.fyi, Glassdoor, or ask peers directly. If you're more than 15% below market, you don't have a motivation problem — you have an information problem. Armed with data, either negotiate or leave knowing you tried.");
  } else {
    if (satisfaction <= 3 && growth <= 3) {
      steps.push("Week 2: Low satisfaction and low growth together isn't a rough patch — it's a slow decline. Start mapping what you'd do differently if money weren't a factor, then find the version of that which pays.");
    } else {
      steps.push("Week 2: Your signals are mixed, which usually means the problem is specific, not existential. Keep a 2-week log of what drains you vs. what energizes you. The pattern will point you somewhere more useful than a gut feeling.");
    }
  }

  // Step 3: Weeks 3–4 — the money move
  if (runway >= 999) {
    steps.push("Weeks 3–4: Your safety net covers your expenses. That's rare and powerful. The risk for you isn't financial — it's staying too long because you can afford to be comfortable. Set a decision deadline and honor it.");
  } else if (income > 0 && expenses > 0 && monthlySurplus > 0 && runway < 12) {
    const monthsPerMonth = (monthlySurplus / expenses).toFixed(1);
    steps.push(`Weeks 3–4: Every month you stay adds ${monthsPerMonth} months to your runway. That means staying 3 more months buys you ${(monthlySurplus * 3 / expenses).toFixed(0)} months of freedom. Decide what your target number is and work backward to your quit date.`);
  } else if (runway >= 12) {
    steps.push("Weeks 3–4: You have over a year of runway. Stop using money as the reason to stay — it's not the real blocker anymore. The real question is: what are you afraid happens if you actually leave?");
  } else if (runway < 3) {
    steps.push("Weeks 3–4: With less than 3 months of runway, do not quit without an offer or a concrete plan. That's not cowardice — it's strategy. Desperation is the worst negotiating position.");
  } else {
    steps.push("Weeks 3–4: Your financial position is workable but not comfortable. Focus on getting to 6 months of runway — that's the threshold where most people stop making fear-based decisions.");
  }

  return steps;
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
  const [burnout, setBurnout] = React.useState(5);
  const [satisfaction, setSatisfaction] = React.useState(5);
  const [growth, setGrowth] = React.useState(5);
  const parsedSavings = typeof savings === "number" ? savings : parseFloat(savings || "0");
  const parsedExpenses = typeof expenses === "number" ? expenses : parseFloat(expenses || "0");
  const parsedSeverance = typeof severance === "number" ? severance : parseFloat(severance || "0");
  const parsedIncome = typeof income === "number" ? income : parseFloat(income || "0");
  const parsedPartnerIncome = typeof partnerIncome === "number" ? partnerIncome : parseFloat(partnerIncome || "0");
  const parsedFamilySupport = typeof familySupport === "number" ? familySupport : parseFloat(familySupport || "0");
  const parsedWeeklyUnemployment = typeof unemploymentBenefits === "number" ? unemploymentBenefits : parseFloat(unemploymentBenefits || "0");
  const parsedUnemployment = parsedWeeklyUnemployment * 4.33; // weekly → monthly
  const parsedNetWorth = typeof netWorth === "number" ? netWorth : parseFloat(netWorth || "0");

  const UNEMPLOYMENT_MONTHS = 6;
  const monthlySafetyNet = parsedPartnerIncome + parsedFamilySupport + parsedUnemployment;
  const ongoingSafetyNet = parsedPartnerIncome + parsedFamilySupport; // after unemployment expires
  const phase1Expenses = Math.max(0, parsedExpenses - monthlySafetyNet); // first 6 months
  const phase2Expenses = Math.max(0, parsedExpenses - ongoingSafetyNet); // after unemployment ends

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
  const adjustedExpenses = !hasHealthCoverage ? parsedExpenses + HEALTH_INSURANCE_COST : parsedExpenses;
  const adjustedRunway = (() => {
    if (hasHealthCoverage || parsedExpenses <= 0) return null;
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

  const monthlySurplus = parsedIncome - parsedExpenses;
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
  const savingsTarget = parsedExpenses > 0 ? parsedExpenses * TARGET_RUNWAY_MONTHS : 0;
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
  const nextSteps = getNextSteps(recommendedPath, archetype, runway, satisfaction, growth, parsedIncome, parsedExpenses, burnoutDriver, burnoutScore, age);
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
    { filled: !hasHealthCoverage || hasHealthCoverage, label: "health coverage" }, // always counted since it has a default
  ];
  // Health coverage toggle always has a value (default true), so replace with a smarter check:
  // We count it as "filled" if the user has explicitly toggled it off (meaning they engaged with it)
  optionalFieldLabels[optionalFieldLabels.length - 1] = { filled: !hasHealthCoverage, label: "health coverage" };

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
  if (parsedPartnerIncome === 0 && parsedFamilySupport === 0) riskFlags.push("No partner income or family support — your runway is entirely self-funded.");
  if (!hasHealthCoverage) riskFlags.push("You'll need marketplace health coverage, which typically costs $400–600/month and isn't factored into most people's initial estimates.");
  if (parsedIncome > 0 && parsedExpenses > 0 && parsedIncome <= parsedExpenses) riskFlags.push("You're currently spending more than you earn — your runway is actively shrinking.");

  const readinessTierColor =
    readinessTier === "Clear to Go" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
    readinessTier === "Prepare to Leave" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
    "border-rose-700/50 bg-rose-900/30 text-rose-300";

  const realityCheck = getRealityCheck(archetype, careerHealthLabel, financialRisk, burnoutDriver);

  const coreTension = getCoreTension(archetype, burnoutDriver, financialRisk, runway, burnoutScore);

  const hasFinancialInputs = parsedExpenses > 0;
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

    const totalCash = parsedSavings + parsedSeverance;
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

  // Split core tension: first sentence bold, rest lighter
  const coreTensionParts = (() => {
    const idx = coreTension.indexOf(". ");
    if (idx === -1) return { lead: coreTension, rest: "" };
    return { lead: coreTension.slice(0, idx + 1), rest: coreTension.slice(idx + 2) };
  })();

  // Collapsible section state — "steps" open by default
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({ steps: true });
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
          <p className="mt-1.5 text-sm text-slate-400">See how long you can last — and what to do next.</p>
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
        </section>

        {/* ── Live runway hero (standalone when no results yet) ── */}
        {!hasFinancialInputs && (
          <section className="rounded-2xl bg-slate-800 p-5 text-center sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Your Runway</p>
            <p className="mt-2 text-6xl font-bold tabular-nums text-slate-600 sm:text-7xl">—</p>
            <p className="mt-1 text-sm text-slate-400">Enter your savings and monthly costs above</p>
          </section>
        )}

        {/* ── Sharpen the picture (progressive disclosure) ── */}
        <details className="group rounded-2xl bg-slate-800">
          <summary className="cursor-pointer select-none px-5 py-4 text-sm font-medium text-slate-200 sm:px-7">
            <span className="inline-flex items-center gap-2">
              Sharpen the picture
              <span className="text-xs text-slate-400">growth, age, severance, net worth</span>
              <svg className="h-4 w-4 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </summary>
          <div className="space-y-5 px-5 pb-6 sm:px-7">
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

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200">What&apos;s wearing you down?</label>
                <select value={burnoutDriver}
                  onChange={(e) => setBurnoutDriver(e.target.value as BurnoutDriver)}
                  className={inputClassNoDollar}>
                  <option value="Not sure">Select what applies most</option>
                  <option value="Workload / hours">Workload / hours</option>
                  <option value="Lack of meaning">Lack of meaning</option>
                  <option value="Toxic culture">Toxic culture</option>
                  <option value="Lack of growth">Lack of growth</option>
                  <option value="Compensation mismatch">Compensation mismatch</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200">Age</label>
                <input type="number" min={18} max={70} value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputClassNoDollar} placeholder="Your age" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                  <label className="block text-xs font-medium text-slate-300">Unemployment (weekly)</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
                    <input type="number" min={0} value={unemploymentBenefits}
                      onChange={(e) => setUnemploymentBenefits(e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputClass} placeholder="e.g. 450" />
                  </div>
                  <p className="text-[10px] text-slate-500">Weekly benefit · first 6 months only</p>
                </div>
              </div>
            </details>
          </div>
        </details>

        {/* ── Results ── */}
        {hasFinancialInputs && (
          <section className="space-y-4">

            {/* Visual break between inputs and results */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Your Career Runway Assessment</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500">Based on what you entered, here&apos;s what your situation looks like.</p>

            {/* ── 1. YOUR NUMBERS — runway, savings target, safe quit date ── */}
            <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Your Runway</p>
                <p className={`mt-2 text-6xl font-bold tabular-nums sm:text-7xl ${runwayColorClass}`}>
                  {runway >= 999 ? "Covered" : runway === 0 ? "0" : runway.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {runway >= 999 ? "Your safety net covers your monthly expenses" : runway === 0 ? "No runway — expenses entered but no savings" : "months of financial runway"}
                </p>
                {runway < 999 && runway > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    ${Math.round(totalCash).toLocaleString()} savings{parsedSeverance > 0 ? " + severance" : ""} · ${Math.round(parsedExpenses).toLocaleString()}/mo costs
                    {monthlySafetyNet > 0 && (
                      <span className="text-emerald-400"> · +${Math.round(monthlySafetyNet).toLocaleString()}/mo safety net</span>
                    )}
                  </p>
                )}
              </div>

              {/* Health insurance impact */}
              {adjustedRunway !== null && adjustedRunway < 999 && (
                <p className="mt-3 text-center text-xs text-amber-400">
                  Without employer health coverage, your estimated monthly costs increase by ~$500, reducing your runway to{" "}
                  <span className="font-semibold">{adjustedRunway.toFixed(1)} months</span>.
                </p>
              )}

              {/* Savings target + safe quit date */}
              {parsedExpenses > 0 && (
                <div className="mt-4 space-y-1.5 text-center">
                  {savingsGap > 0 ? (
                    <p className="text-xs text-slate-400">
                      To reach 12 months of runway, you need{" "}
                      <span className="font-semibold text-white">${Math.round(savingsGap).toLocaleString()}</span> more in savings.
                    </p>
                  ) : runway >= 12 ? (
                    <p className="text-xs text-emerald-400">
                      {runway >= 999 ? "Your safety net has you covered." : "You already have 12+ months of runway."}
                    </p>
                  ) : null}
                  {safeQuitDate && monthlySurplus > 0 && (
                    <p className="text-xs text-slate-400">
                      At your current savings rate, you&apos;ll reach that by{" "}
                      <span className="font-semibold text-white">{safeQuitDate}</span>.
                    </p>
                  )}
                  {monthsToTarget === null && savingsGap > 0 && (
                    <p className="text-xs text-rose-400">
                      You&apos;re spending more than you earn — your runway is depleting.
                    </p>
                  )}
                </div>
              )}

              {/* Net worth context */}
              {parsedNetWorth > 0 && (
                <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
                  Beyond your liquid runway, you have ~${Math.round(parsedNetWorth).toLocaleString()} in long-term savings.
                  {parsedNetWorth > parsedExpenses * 24
                    ? " That's a meaningful backstop — your worst-case scenario has a floor, even if tapping those funds should be a last resort."
                    : " It's not enough to change the math, but it's worth remembering you're not starting from zero."}
                </p>
              )}
            </div>

            {/* ── 2. YOUR READINESS — tier badge + explanation ── */}
            <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${readinessTierColor}`}>{readinessTier}</span>
                {archetype !== "None" && (
                  <span className="rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-300">{archetype}</span>
                )}
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  burnoutLevel === "Low" ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-300" :
                  burnoutLevel === "Moderate" ? "border-amber-700/50 bg-amber-900/30 text-amber-300" :
                  "border-rose-700/50 bg-rose-900/30 text-rose-300"
                }`}>{burnoutLevel} burnout</span>
                {getCareerPhaseLabel(age) && (
                  <span className="rounded-full border border-blue-700/50 bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-300">{getCareerPhaseLabel(age)}</span>
                )}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{headline}</h2>
              <p className="mt-2 text-sm text-slate-400">{tierExplanation}</p>

              {/* Core tension */}
              <p className="mt-4 text-sm leading-relaxed">
                <span className="font-medium text-white">{coreTensionParts.lead}</span>
                {coreTensionParts.rest && <span className="text-slate-300"> {coreTensionParts.rest}</span>}
              </p>
            </div>

            {/* ── 3. WHAT'S WORKING / WHAT TO WATCH — strengths + risk flags ── */}
            {(strengths.length > 0 || riskFlags.length > 0) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {strengths.length > 0 && (
                  <div className="rounded-xl border border-emerald-800/40 bg-emerald-900/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">What&apos;s working</p>
                    <ul className="mt-2 space-y-2">
                      {strengths.slice(0, 4).map((s) => (
                        <li key={s} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                          <span className="mt-0.5 text-emerald-400">+</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {riskFlags.length > 0 && (
                  <div className="rounded-xl border border-rose-800/40 bg-rose-900/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">What to watch</p>
                    <ul className="mt-2 space-y-2">
                      {riskFlags.slice(0, 4).map((r) => (
                        <li key={r} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                          <span className="mt-0.5 text-rose-400">!</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. IF YOU STAY — scenario comparison ── */}
            <div className="rounded-2xl bg-slate-800 p-5 sm:p-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">If you stay</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-700/30 px-4 py-3 text-center">
                  <p className="text-[11px] font-medium text-slate-500">Quit today</p>
                  <p className={`mt-1 text-2xl font-bold tabular-nums ${runway >= 999 ? "text-emerald-400" : runway > 18 ? "text-emerald-400" : runway >= 6 ? "text-amber-400" : "text-rose-400"}`}>
                    {runway >= 999 ? "✓" : runway ? runway.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-slate-500">{runway >= 999 ? "covered" : "months"}</p>
                </div>
                <div className="rounded-xl bg-slate-700/30 px-4 py-3 text-center">
                  <p className="text-[11px] font-medium text-slate-500">Stay 3 months</p>
                  <p className={`mt-1 text-2xl font-bold tabular-nums ${runwayStay3 >= 999 ? "text-emerald-400" : runwayStay3 > 18 ? "text-emerald-400" : runwayStay3 >= 6 ? "text-amber-400" : "text-rose-400"}`}>
                    {runwayStay3 >= 999 ? "✓" : runwayStay3 ? runwayStay3.toFixed(1) : "—"}
                  </p>
                  {parsedIncome > 0 && parsedExpenses > 0 && monthlySurplus > 0 && runway < 999 && runwayStay3 < 999 && (
                    <p className="text-[10px] font-medium text-emerald-400">+{(runwayStay3 - runway).toFixed(1)}</p>
                  )}
                  <p className="text-xs text-slate-500">{runwayStay3 >= 999 ? "covered" : "months"}</p>
                </div>
                <div className="rounded-xl bg-slate-700/30 px-4 py-3 text-center">
                  <p className="text-[11px] font-medium text-slate-500">Stay 6 months</p>
                  <p className={`mt-1 text-2xl font-bold tabular-nums ${runwayStay6 >= 999 ? "text-emerald-400" : runwayStay6 > 18 ? "text-emerald-400" : runwayStay6 >= 6 ? "text-amber-400" : "text-rose-400"}`}>
                    {runwayStay6 >= 999 ? "✓" : runwayStay6 ? runwayStay6.toFixed(1) : "—"}
                  </p>
                  {parsedIncome > 0 && parsedExpenses > 0 && monthlySurplus > 0 && runway < 999 && runwayStay6 < 999 && (
                    <p className="text-[10px] font-medium text-emerald-400">+{(runwayStay6 - runway).toFixed(1)}</p>
                  )}
                  <p className="text-xs text-slate-500">{runwayStay6 >= 999 ? "covered" : "months"}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-medium text-slate-300">{scenarioInsight}</p>
            </div>

            {/* ── 5. YOUR NEXT 30 DAYS — action items ── */}
            <div className="rounded-xl bg-slate-800">
              <button type="button" onClick={() => toggleSection("steps")}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-200">
                Your next 30 days
                <svg className={`h-4 w-4 text-slate-400 transition ${openSections["steps"] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openSections["steps"] && (
                <div className="space-y-3 px-5 pb-5">
                  {nextSteps.map((step, i) => (
                    <div key={step} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-200">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 6. ASSESSMENT CONFIDENCE ── */}
            <div className="rounded-xl bg-slate-800 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Assessment confidence:{" "}
                    <span className={
                      fieldConfidence === "High" ? "text-emerald-400" :
                      fieldConfidence === "Medium" ? "text-amber-400" :
                      "text-rose-400"
                    }>{fieldConfidence}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">{confidenceExplanation}</p>
                </div>
                <button type="button" onClick={handleShareProfile}
                  className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-slate-200">
                  {copied ? "Copied!" : "Copy summary"}
                </button>
              </div>
            </div>

            {/* ── 7. HOW THIS WAS CALCULATED — transparency ── */}
            <div className="rounded-xl bg-slate-800">
              <button type="button" onClick={() => toggleSection("analysis")}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-200">
                How this was calculated
                <svg className={`h-4 w-4 text-slate-400 transition ${openSections["analysis"] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openSections["analysis"] && (
                <div className="space-y-4 px-5 pb-5 text-xs leading-relaxed text-slate-300">
                  <p>{whyParagraph}</p>
                  {normalizationParagraph && <p className="italic text-slate-400">{normalizationParagraph}</p>}
                  <p className="text-slate-400">{realityCheck}</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              This is a first‑pass decision aid, not financial or career advice.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
