import { describe, expect, test } from "vitest";
import { formatWeatherReport, colorTemp, colorCondition, degToCompass } from "../src/utils/formatWeatherReport.js";
import { State } from "../src/cli/state.js";

// strip ANSI escape codes so assertions are not affected by color output
const strip = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");

function createTestState(overrides: Partial<State> = {}): State {
    return {
        units: "imperial",
        readline: {} as any,
        registry: {} as any,
        openWeatherMapAPI: {} as any,
        summaryList: {} as any,
        ...overrides,
    };
}

const baseWeather: any = {
    main: {
        temp: 21.2,
        feels_like: 20.7,
        temp_min: 18.0,
        temp_max: 24.9,
        pressure: 1013,
        humidity: 55,
    },
    weather: [{ main: "Clouds", description: "broken clouds", id: 803, icon: "04d" }],
    wind: { speed: 5, deg: 90, gust: 8 },
    clouds: { all: 60 },
    visibility: 10000,
    sys: { sunrise: 1_700_000_000, sunset: 1_700_036_000, country: "GB" },
    timezone: 0,
    coord: { lon: 0, lat: 51 },
    base: "stations",
    dt: 1_700_000_000,
    id: 1,
    name: "London",
    cod: 200,
};

describe("formatWeatherReport", () => {
    test("shows location header with state code", () => {
        const result = strip(formatWeatherReport(createTestState(), "London", "GB", baseWeather, "ENG"));
        expect(result).toContain("LOCATION : LONDON, ENG, GB");
    });

    test("shows location header without state code", () => {
        const result = strip(formatWeatherReport(createTestState(), "Oslo", "NO", baseWeather));
        expect(result).toContain("LOCATION : OSLO, NO");
    });

    test("shows temperature and feels-like in imperial", () => {
        const result = strip(formatWeatherReport(createTestState({ units: "imperial" }), "London", "GB", baseWeather));
        expect(result).toContain("21.2°F");
        expect(result).toContain("20.7°F");
    });

    test("shows temperature and feels-like in metric", () => {
        const result = strip(formatWeatherReport(createTestState({ units: "metric" }), "London", "GB", baseWeather));
        expect(result).toContain("21.2°C");
        expect(result).toContain("20.7°C");
    });

    test("shows condition uppercased", () => {
        const result = strip(formatWeatherReport(createTestState(), "London", "GB", baseWeather));
        expect(result).toContain("CLOUDS");
        expect(result).toContain("broken clouds");
    });

    test("shows wind speed, direction, and gust", () => {
        const result = strip(formatWeatherReport(createTestState(), "London", "GB", baseWeather));
        expect(result).toContain("5 mph E");
        expect(result).toContain("gust 8 mph");
    });

    test("shows humidity, pressure, cloud cover, and visibility", () => {
        const result = strip(formatWeatherReport(createTestState(), "London", "GB", baseWeather));
        expect(result).toContain("55%");
        expect(result).toContain("1013 hPa");
        expect(result).toContain("60%");
        expect(result).toContain("10.0 km");
    });

    test("shows sunrise and sunset", () => {
        const result = strip(formatWeatherReport(createTestState(), "London", "GB", baseWeather));
        expect(result).toMatch(/SUNRISE\s+▸\s+(?!N\/A)/);
        expect(result).toMatch(/SUNSET\s+▸\s+(?!N\/A)/);
    });

    test("falls back gracefully when optional fields are missing", () => {
        const minimal: any = {
            main: { temp: 70, feels_like: 72, temp_min: 68, temp_max: 75, pressure: 1000, humidity: 40 },
        };
        const result = strip(formatWeatherReport(createTestState(), "Somewhere", "US", minimal));
        expect(result).toContain("LOCATION : SOMEWHERE, US");
        expect(result).toContain("UNKNOWN");
        expect(result).toContain("0 mph N");
        expect(result).toContain("0.0 km");
        expect(result).toContain("N/A");
    });
});

describe("colorTemp", () => {
    test("cyan for freezing (<=0°C / 32°F)", () => {
        expect(colorTemp(32, "imperial")).toContain("32.0");
        expect(colorTemp(0,  "metric")).toContain("0.0");
    });

    test("blue for cool (1–15°C)", () => {
        expect(colorTemp(50, "imperial")).toContain("50.0"); // ~10°C
        expect(colorTemp(10, "metric")).toContain("10.0");
    });

    test("yellow for warm (16–27°C)", () => {
        expect(colorTemp(72, "imperial")).toContain("72.0"); // ~22°C
        expect(colorTemp(22, "metric")).toContain("22.0");
    });

    test("red for hot (>27°C)", () => {
        expect(colorTemp(90, "imperial")).toContain("90.0"); // ~32°C
        expect(colorTemp(30, "metric")).toContain("30.0");
    });
});

describe("colorCondition", () => {
    test("uppercases the condition text", () => {
        expect(strip(colorCondition("Clear"))).toBe("CLEAR");
        expect(strip(colorCondition("Rain"))).toBe("RAIN");
        expect(strip(colorCondition("Thunderstorm"))).toBe("THUNDERSTORM");
        expect(strip(colorCondition("Snow"))).toBe("SNOW");
    });
});

describe("degToCompass", () => {
    test.each([
        { deg: 0,   expected: "N"  },
        { deg: 90,  expected: "E"  },
        { deg: 180, expected: "S"  },
        { deg: 270, expected: "W"  },
        { deg: 45,  expected: "NE" },
        { deg: 315, expected: "NW" },
    ])("$deg° → $expected", ({ deg, expected }) => {
        expect(degToCompass(deg)).toBe(expected);
    });
});
