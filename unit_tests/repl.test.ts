import { cleanInput } from "../src/cli/repl.js";
import { describe, expect, test } from "vitest";

describe.each([
    {
        input: " hello world ",
        expected: ["hello", "world"],
    },
    {
        input: "   weather   London   ",
        expected: ["weather", "london"],
    },
    {
        input: "",
        expected: [],
    },
    {
        input: "   ",
        expected: [],
    },
    {
        input: "summary New York",
        expected: ["summary", "new", "york"],
    },
])("cleanInput($input)", ({ input, expected }) => {
    test(`Expected: ${expected}`, () => {
        let actual = cleanInput(input);

        expect(actual).toHaveLength(expected.length);
        for (const i in expected) {
            expect(actual[i]).toBe(expected[i]);
        }
    });
});