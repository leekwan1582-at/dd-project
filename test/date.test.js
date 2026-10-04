import test from "node:test";
import assert from "node:assert/strict";
import { todayTag } from "../src/utils/date.js";

test("todayTag uses the local calendar date", (t) => {
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date(2026, 0, 2, 12, 0, 0),
  });
  assert.equal(todayTag(), "[dd-2026-01-02]");
});

test("todayTag pads single-digit months and days", (t) => {
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date(2026, 8, 5, 9, 30, 0),
  });
  assert.equal(todayTag(), "[dd-2026-09-05]");
});
