import { describe, test, expect, vi, beforeEach } from "vitest";
import { commandAdd } from "../src/commands/command_add.js";
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

describe("commandAdd", () => {
    test("adds a location to the summary list and order", async () => {
        const state = createTestState();
        await commandAdd(state, "oslo");
        expect(state.summaryList["oslo,no"]).toEqual(mockLocation);
        expect(state.summaryOrder).toContain("oslo,no");
        expect(saveConfig).toHaveBeenCalledOnce();
    });

    test("prints confirmation after adding", async () => {
        const state = createTestState();
        await commandAdd(state, "oslo");
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Oslo"));
    });

    test("does not add a duplicate location", async () => {
        const state = createTestState({
            summaryList: { "oslo,no": mockLocation },
        });
        await commandAdd(state, "oslo");
        expect(saveConfig).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("already in the summary list"));
    });

    test("prints error when no args provided", async () => {
        const state = createTestState();
        await commandAdd(state);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("must provide"));
        expect(saveConfig).not.toHaveBeenCalled();
    });

    test("prints error when API throws", async () => {
        const state = createTestState();
        (state.openWeatherMapAPI.fetchLocation as any).mockRejectedValue(new Error("not found"));
        await commandAdd(state, "nowhere");
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Could not fetch location"));
        expect(saveConfig).not.toHaveBeenCalled();
    });
});
