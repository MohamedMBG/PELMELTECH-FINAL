import type { PelmelBotUi } from "@/data/pelmelbot";

export type StepPhase = "need" | "details" | "result";

export type StepProgress = {
  current: number;
  total: number;
  phase: StepPhase;
};

const TOTAL_PHASES = 3;

// Utility steps (contact / price / after-sales) sit outside the guided
// selection funnel, so they carry no progress.
const NON_GUIDED_STEPS = new Set(["PRIX", "SAV", "CONTACT_MANAGER", "FALLBACK_2"]);

/**
 * Derives the guided-selection progress from the active step id alone — no
 * hardcoded per-branch counts. The funnel always has three conceptual phases:
 *   1 · pick a need        (WELCOME / FALLBACK_1)
 *   2 · answer follow-ups  (every other question, incl. FALLBACK_INPUT)
 *   3 · get a machine      (REC_*)
 * Returns null for steps that are not part of the funnel so the indicator hides.
 */
export function getStepProgress(stepId: string): StepProgress | null {
  if (NON_GUIDED_STEPS.has(stepId)) return null;
  if (stepId.startsWith("REC_")) return { current: 3, total: TOTAL_PHASES, phase: "result" };
  if (stepId === "WELCOME" || stepId === "FALLBACK_1")
    return { current: 1, total: TOTAL_PHASES, phase: "need" };
  return { current: 2, total: TOTAL_PHASES, phase: "details" };
}

export function getPhaseLabel(phase: StepPhase, ui: PelmelBotUi): string {
  if (phase === "need") return ui.progressNeed;
  if (phase === "details") return ui.progressDetails;
  return ui.progressResult;
}
