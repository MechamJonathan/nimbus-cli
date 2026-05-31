import { describe, test, expect, vi, beforeEach } from "vitest";
import { commandUnits } from "../src/commands/command_units.js";
import { State } from "../src/cli/state.js";

vi.mock("../src/utils/configStore.js", () => ({
    saveConfig: vi.fn(),
}));

import { saveConfig } from "../src/utils/configStore.js";

function createTestState(overrides: Partial<State> = {}): State {
    return {
        units: "imperial",
        readline: {} as any,
        registry: {} as any,
        openWeatherMapAPI: {} as any,
        summaryList: {},
        ...overrides,
    };
}

beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.clearAllMocks();
});

describe("commandUnits", () => {
    test("sets units to metric when given 'c'", async () => {
        const state = createTestState();
        await commandUnits(state, "c");
        expect(state.units).toBe("metric");
        expect(saveConfig).toHaveBeenCalledWith({ units: "metric", summaryList: {} });
    });

    test("sets units to metric when given 'celsius'", async () => {
        const state = createTestState();
        await commandUnits(state, "celsius");
        expect(state.units).toBe("metric");
    });

    test("sets units to imperial when given 'f'", async () => {
        const state = createTestState({ units: "metric" });
        await commandUnits(state, "f");
        expect(state.units).toBe("imperial");
        expect(saveConfig).toHaveBeenCalledWith({ units: "imperial", summaryList: {} });
    });

    test("sets units to imperial when given 'fahrenheit'", async () => {
        const state = createTestState({ units: "metric" });
        await commandUnits(state, "fahrenheit");
        expect(state.units).toBe("imperial");
    });

    test("does not save config on invalid input", async () => {
        const state = createTestState();
        await commandUnits(state, "kelvin");
        expect(state.units).toBe("imperial");
        expect(saveConfig).not.toHaveBeenCalled();
    });

    test("prints current units when called with no args", async () => {
        const state = createTestState({ units: "metric" });
        await commandUnits(state);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("metric"));
        expect(saveConfig).not.toHaveBeenCalled();
    });
});
