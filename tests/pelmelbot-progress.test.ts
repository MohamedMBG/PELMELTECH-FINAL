import { test } from "node:test";
import assert from "node:assert/strict";
import { getStepProgress } from "../src/components/pelmelbot/progress";

// Run: node --import tsx --test tests/pelmelbot-progress.test.ts
test("guided-selection progress is derived from the step id", () => {
  assert.deepEqual(getStepProgress("WELCOME"), { current: 1, total: 3, phase: "need" });
  assert.deepEqual(getStepProgress("FALLBACK_1"), { current: 1, total: 3, phase: "need" });
  assert.deepEqual(getStepProgress("A_Q2"), { current: 2, total: 3, phase: "details" });
  assert.deepEqual(getStepProgress("D_Q3_1800"), { current: 2, total: 3, phase: "details" });
  assert.deepEqual(getStepProgress("FALLBACK_INPUT"), { current: 2, total: 3, phase: "details" });
  assert.deepEqual(getStepProgress("REC_DTG_4050"), { current: 3, total: 3, phase: "result" });

  // Utility steps are outside the funnel → no indicator.
  for (const id of ["PRIX", "SAV", "CONTACT_MANAGER", "FALLBACK_2"]) {
    assert.equal(getStepProgress(id), null, `${id} should have no progress`);
  }
});
