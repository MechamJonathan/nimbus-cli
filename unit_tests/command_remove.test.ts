import { describe, test, expect, vi, beforeEach } from "vitest";
import { commandRemove } from "../src/commands/command_remove.js";
import { State } from "../src/cli/state.js";
import { Location } from "../src/types/weather.js";

vi.mock("../src/utils/configStore.js", () => ({
    saveConfig: vi.fn(),
}));

import { saveConfig } from "../src/utils/configStore.js";

const mockLocation: Location = {
    name: "Oslo",
    lat: 59.9,
    lon: 10.7,
    country: "NO",
};

function createTestState(overrides: Partial<State> = {}): State {
    return {
        units: "imperial",
        readline: {} as any,
        registry: {} as any,
        openWeatherMapAPI: {
            fetchLocation: vi.fn().mockResolvedValue(mockLocation),
            fetchWeatherByCity: vi.fn(),
            closeCache: vi.fn(),
        } as any,
        summaryList: {},
        summaryOrder: [],
        ...overrides,
    };
}

beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.clearAllMocks();
});

describe("commandRemove", () => {
    test("removes a location from the summary list and order", async () => {
        const state = createTestState({
            summaryList: { "oslo,no": mockLocation },
            summaryOrder: ["oslo,no"],
        });
        await commandRemove(state, "oslo");
        expect(state.summaryList["oslo,no"]).toBeUndefined();
        expect(state.summaryOrder).not.toContain("oslo,no");
        expect(saveConfig).toHaveBeenCalledOnce();
    });

    test("prints confirmation after removing", async () => {
        const state = createTestState({
            summaryList: { "oslo,no": mockLocation },
            summaryOrder: ["oslo,no"],
        });
        await commandRemove(state, "oslo");
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("removed from summary list"));
    });

    test("prints error when location is not in the list", async () => {
        const state = createTestState();
        await commandRemove(state, "oslo");
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("not in the summary list"));
        expect(saveConfig).not.toHaveBeenCalled();
    });

    test("prints error when no args provided", async () => {
        const state = createTestState();
        await commandRemove(state);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("must provide"));
        expect(saveConfig).not.toHaveBeenCalled();
    });

    test("prints error when API throws", async () => {
        const state = createTestState();
        (state.openWeatherMapAPI.fetchLocation as any).mockRejectedValue(new Error("network error"));
        await commandRemove(state, "nowhere");
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Could not fetch location"));
        expect(saveConfig).not.toHaveBeenCalled();
    });
});
