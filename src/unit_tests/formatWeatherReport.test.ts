import { describe, expect, test } from "vitest";
import { formatWeatherReport } from "../utils/formatWeatherReport.js";
import { State } from "../cli/state.js";

function createTestState(overrides: Partial<State> = {}): State {
  return {
    units: "metric",
    readline: {} as any,
    registry: {} as any,
    openWeatherMapAPI: {} as any,
    summaryList: {} as any,
    ...overrides,
  };
}

describe("formatWeatherReport", () => {
  test("formats a full weather report in metric units", () => {
    const state = createTestState({ units: "imperial" });

    const weather = {
      main: {
        temp: 21.234,
        feels_like: 20.7,
        temp_min: 18.0,
        temp_max: 24.9,
        pressure: 1013,
        humidity: 55,
      },
      weather: [
        {
          main: "Clouds",
          description: "broken clouds",
        },
      ],
      wind: {
        speed: 5,
        deg: 90,
        gust: 8,
      },
      clouds: { all: 60 },
      visibility: 10000,
      sys: {
        sunrise: 1_700_000_000,
        sunset: 1_700_036_000,
        country: "GB",
      },
      timezone: 0, 
    } as any; 

    const result = formatWeatherReport(
      state,
      "London",
      "GB",
      weather,
      "ENG"
    );

    expect(result).toContain("Weather in London, ENG, GB");

    expect(result).toContain("Temperature : 21.2°F (feels like 20.7°F)");
    expect(result).toContain("Low / High  : 18.0°F / 24.9°F");

    expect(result).toContain("Condition   : Clouds (broken clouds)");

    expect(result).toContain("Wind        : 5 mph E (gust 8 mph)");

    expect(result).toContain("Cloudiness  : 60%");
    expect(result).toContain("Visibility  : 10.0 km");

    expect(result).toMatch(/Sunrise\s+:\s+(?!N\/A)/);
    expect(result).toMatch(/Sunset\s+:\s+(?!N\/A)/);
  });

  test("falls back to Unknown/N/A when fields are missing", () => {
    const state = createTestState({ units: "imperial" });

    const weather = {
      main: {
        temp: 70,
        feels_like: 72,
        temp_min: 68,
        temp_max: 75,
        pressure: 1000,
        humidity: 40,
      },
    } as any;

    const result = formatWeatherReport(
      state,
      "Somewhere",
      "US",
      weather
    );

    expect(result).toContain("Weather in Somewhere, US");
    expect(result).toContain("Condition   : Unknown ()");
    expect(result).toContain("Temperature : 70.0°F (feels like 72.0°F)");
    expect(result).toContain("Wind        : 0 mph N (gust 0 mph)");
    expect(result).toContain("Cloudiness  : 0%");
    expect(result).toContain("Visibility  : 0.0 km");
    expect(result).toContain("Sunrise     : N/A");
    expect(result).toContain("Sunset      : N/A");
  });
});