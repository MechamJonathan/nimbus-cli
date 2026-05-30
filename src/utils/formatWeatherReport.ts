import { State } from "../cli/state.js";
import { WeatherReport } from "../types/weather.js";
import pc from "picocolors";

// ─── color helpers ────────────────────────────────────────────────────────────

export function colorTemp(temp: number, units: "metric" | "imperial"): string {
    const c = units === "metric" ? temp : (temp - 32) * 5 / 9;
    const s = `${temp.toFixed(1)}`;
    if (c <= 0)  return pc.cyan(s);
    if (c <= 15) return pc.blue(s);
    if (c <= 27) return pc.yellow(s);
    return pc.red(s);
}

export function colorCondition(main: string): string {
    const m = main.toLowerCase();
    if (m.includes("thunder"))              return pc.red(main.toUpperCase());
    if (m.includes("rain") || m.includes("drizzle")) return pc.cyan(main.toUpperCase());
    if (m.includes("snow"))                 return pc.bold(pc.white(main.toUpperCase()));
    if (m.includes("clear"))                return pc.yellow(main.toUpperCase());
    if (m.includes("cloud"))                return pc.white(main.toUpperCase());
    return pc.green(main.toUpperCase());
}

// ─── main formatter ───────────────────────────────────────────────────────────

export function formatWeatherReport(
    state: State,
    city: string,
    country: string,
    weather: WeatherReport,
    stateCode?: string
): string {
    const { temp, feels_like, temp_min, temp_max, pressure, humidity } = weather.main;
    const condition    = weather.weather?.[0]?.main ?? "Unknown";
    const description  = weather.weather?.[0]?.description ?? "";
    const { speed: windSpeed = 0, deg: windDeg = 0, gust: windGust = 0 } = weather.wind ?? {};
    const { all: clouds = 0 }  = weather.clouds ?? {};
    const visibility   = weather.visibility ?? 0;
    const { sunrise, sunset }  = weather.sys ?? {};
    const timezoneOffset       = weather.timezone ?? 0;

    const tempUnit  = state.units === "metric" ? "°C" : "°F";
    const speedUnit = state.units === "metric" ? "m/s" : "mph";

    const location = stateCode
        ? `${city.toUpperCase()}, ${stateCode.toUpperCase()}, ${country.toUpperCase()}`
        : `${city.toUpperCase()}, ${country.toUpperCase()}`;

    const sunriseStr = formatLocalTime(sunrise, timezoneOffset);
    const sunsetStr  = formatLocalTime(sunset,  timezoneOffset);

    const arrow = pc.green("▸");
    const label = (s: string) => pc.dim(pc.green(s.padEnd(11)));
    const muted = (s: string) => pc.dim(s);

    const rows = [
        `  ${label("STATUS")}  ${arrow} ${colorCondition(condition)}  ${muted(`(${description})`)}`,
        `  ${label("TEMPERATURE")}  ${arrow} ${colorTemp(temp, state.units)}${tempUnit}  ${muted(`[ feels like ${colorTemp(feels_like, state.units)}${tempUnit} ]`)}`,
        `  ${label("RANGE")}  ${arrow} ${colorTemp(temp_min, state.units)}${tempUnit} ${muted("—")} ${colorTemp(temp_max, state.units)}${tempUnit}`,
        `  ${label("HUMIDITY")}  ${arrow} ${humidity}%`,
        `  ${label("PRESSURE")}  ${arrow} ${pressure} hPa`,
        `  ${label("WIND")}  ${arrow} ${windSpeed} ${speedUnit} ${degToCompass(windDeg)}  ${muted(`[ gust ${windGust} ${speedUnit} ]`)}`,
        `  ${label("CLOUD COVER")}  ${arrow} ${clouds}%`,
        `  ${label("VISIBILITY")}  ${arrow} ${(visibility / 1000).toFixed(1)} km`,
        `  ${label("SUNRISE")}  ${arrow} ${pc.yellow(sunriseStr)}`,
        `  ${label("SUNSET")}  ${arrow} ${pc.yellow(sunsetStr)}`,
    ];

    const targetLine = `  ${pc.dim(pc.green("TARGET :"))} ${pc.bold(pc.cyan(location))}`;
    const divider    = pc.dim(pc.green("  " + "─".repeat(44)));
    const body       = rows.join("\n");
    const footer     = pc.dim(pc.green(`${"─".repeat(4)} TRANSMISSION ENDS ${"─".repeat(4)}`));

    return [targetLine, divider, "", body, "", `  ${footer}`].join("\n");
}

// ─── utilities ────────────────────────────────────────────────────────────────

export function degToCompass(num: number): string {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return arr[val % 16];
}

export function formatLocalTime(timestamp?: number, timezoneOffset?: number): string {
    if (!timestamp || timezoneOffset === undefined) return "N/A";
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toUTCString().slice(-12, -4);
}
