import { describe, test, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted — use vi.hoisted so mockFs is available inside the factory
const mockFs = vi.hoisted(() => ({
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
}));

vi.mock("node:os", () => ({ homedir: () => "/tmp/nimbus-test" }));
vi.mock("node:fs", () => mockFs);

import { loadConfig, saveConfig } from "../src/utils/configStore.js";

beforeEach(() => {
    vi.clearAllMocks();
});

describe("loadConfig", () => {
    test("returns default config when file does not exist", () => {
        mockFs.readFileSync.mockImplementation(() => { throw new Error("ENOENT"); });
        const config = loadConfig();
        expect(config.units).toBe("imperial");
        expect(config.summaryList).toEqual({});
    });

    test("returns default config when file contains invalid JSON", () => {
        mockFs.readFileSync.mockReturnValue("not valid json {{");
        const config = loadConfig();
        expect(config.units).toBe("imperial");
        expect(config.summaryList).toEqual({});
    });

    test("loads saved units from file", () => {
        mockFs.readFileSync.mockReturnValue(JSON.stringify({ units: "metric", summaryList: {} }));
        const config = loadConfig();
        expect(config.units).toBe("metric");
    });

    test("loads saved summaryList from file", () => {
        const saved = {
            units: "imperial",
            summaryList: {
                "oslo,no": { name: "Oslo", lat: 59.9, lon: 10.7, country: "NO" },
            },
        };
        mockFs.readFileSync.mockReturnValue(JSON.stringify(saved));
        const config = loadConfig();
        expect(Object.keys(config.summaryList)).toHaveLength(1);
        expect(config.summaryList["oslo,no"].name).toBe("Oslo");
    });

    test("fills in missing keys with defaults", () => {
        mockFs.readFileSync.mockReturnValue(JSON.stringify({ units: "metric" }));
        const config = loadConfig();
        expect(config.summaryList).toEqual({});
    });
});

describe("saveConfig", () => {
    test("creates config directory if it does not exist", () => {
        saveConfig({ units: "imperial", summaryList: {} });
        expect(mockFs.mkdirSync).toHaveBeenCalledWith(
            "/tmp/nimbus-test/.nimbus-cli",
            { recursive: true }
        );
    });

    test("writes config as formatted JSON", () => {
        const config = { units: "metric" as const, summaryList: {} };
        saveConfig(config);
        const written = mockFs.writeFileSync.mock.calls[0][1] as string;
        const parsed = JSON.parse(written);
        expect(parsed.units).toBe("metric");
    });

    test("round-trips units and summaryList correctly", () => {
        const original = {
            units: "metric" as const,
            summaryList: {
                "oslo,no": { name: "Oslo", lat: 59.9, lon: 10.7, country: "NO" },
            },
        };
        saveConfig(original);
        const written = mockFs.writeFileSync.mock.calls[0][1] as string;
        mockFs.readFileSync.mockReturnValue(written);
        const loaded = loadConfig();
        expect(loaded.units).toBe("metric");
        expect(loaded.summaryList["oslo,no"].name).toBe("Oslo");
    });
});
