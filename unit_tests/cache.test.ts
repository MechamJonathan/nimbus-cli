import { Cache } from "../src/api/cache.js";
import { test, expect } from "vitest";

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 0.5 seconds
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval * 2));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

test("get returns undefined for missing key", () => {
  const cache = new Cache(1000);
  try {
    const value = cache.get("missing-key");
    expect(value).toBeUndefined();
  } finally {
    cache.stopReapLoop();
  }
});

test("value is available before TTL expires", async () => {
  const cache = new Cache(100);
  try {
    cache.add("key", "value");

    await new Promise((resolve) => setTimeout(resolve, 50));
    const value = cache.get("key");
    expect(value).toBe("value");
  } finally {
    cache.stopReapLoop();
  }
});

test("add overwrites existing key", () => {
  const cache = new Cache(1000);
  try {
    cache.add("key", "first");
    cache.add("key", "second");

    const value = cache.get("key");
    expect(value).toBe("second");
  } finally {
    cache.stopReapLoop();
  }
});

