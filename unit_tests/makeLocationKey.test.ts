import { describe, expect, test } from "vitest";
import { makeLocationKey } from "../src/utils/makeLocationKey.js";

describe("makeLocationKey", () => {
  test("normalizes city and lowercases it", () => {
    const key = makeLocationKey("  New   York  ");
    expect(key).toBe("new york");
  });

  test("includes city and country", () => {
    const key = makeLocationKey(" London ", undefined, "  GB ");
    expect(key).toBe("london,gb");
  });

  test("includes city and state", () => {
    const key = makeLocationKey(" Seattle ", " WA ");
    expect(key).toBe("seattle,wa");
  });

  test("includes city, state, and country", () => {
    const key = makeLocationKey(" São   Paulo ", " SP ", " BR ");
    expect(key).toBe("são paulo,sp,br");
  });

  test("collapses multiple spaces in city name", () => {
    const key = makeLocationKey("  Rio   de   Janeiro ");
    expect(key).toBe("rio de janeiro");
  });

  test("omits empty/undefined state and country", () => {
    expect(makeLocationKey("Paris", "", "")).toBe("paris");
    expect(makeLocationKey("Paris", "  ", undefined)).toBe("paris");
  });
});