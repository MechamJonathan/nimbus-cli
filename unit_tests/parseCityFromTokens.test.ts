import { describe, expect, test } from "vitest";
import { parseCityFromTokens } from "../src/utils/parseCityFromTokens.js";

describe("parseCityFromTokens", () => {
  test("throws when no tokens are provided", () => {
    expect(() => parseCityFromTokens([])).toThrow("No location provided");
  });

  test("parses city only", () => {
    const result = parseCityFromTokens(["london"]);
    expect(result).toEqual({
      city: "london",
      state: undefined,
      country: undefined,
    });
  });

  test("parses multi-word city without country", () => {
    const result = parseCityFromTokens(["rio", "de", "janeiro"]);
    expect(result).toEqual({
      city: "rio de janeiro",
      state: undefined,
      country: undefined,
    });
  });

  test("parses city and country code", () => {
    const result = parseCityFromTokens(["london", "gb"]);
    expect(result).toEqual({
      city: "london",
      state: undefined,
      country: "gb",
    });
  });

  test("parses US city, state, and country", () => {
    const result = parseCityFromTokens(["seattle", "wa", "us"]);
    expect(result).toEqual({
      city: "seattle",
      state: "wa",
      country: "us",
    });
  });

  test("treats last token as country when not 'us'", () => {
    const result = parseCityFromTokens(["mexico", "city", "mx"]);
    expect(result).toEqual({
      city: "mexico city",
      state: undefined,
      country: "mx",
    });
  });

  test("does not parse state when only city and 'us' are provided", () => {
    const result = parseCityFromTokens(["boston", "us"]);
    expect(result).toEqual({
      city: "boston",
      state: undefined,
      country: "us",
    });
  });
});