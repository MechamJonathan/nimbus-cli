import { State } from "../cli/state.js";
import { WeatherReport } from "../types/weather.js";
import pc from "picocolors";

export function formatWeatherReport(
    state: State,
    city: string,
    country: string,
    weather: WeatherReport,
    stateCode?: string
): string {
    const { temp, feels_like, temp_min, temp_max, pressure, humidity } =
        weather.main;

    const condition = weather.weather?.[0]?.main ?? "Unknown";
    const description = weather.weather?.[0]?.description ?? "";
    const { speed: windSpeed = 0, deg: windDeg = 0, gust: windGust = 0 } = weather.wind ?? {};
    const { all: clouds = 0 } = weather.clouds ?? {};
    const visibility = weather.visibility ?? 0;

    const { sunrise, sunset } = weather.sys ?? {};
    const timezoneOffset = weather.timezone ?? 0;

    const tempUnit = state.units === "metric" ? "°C" : "°F";
    const speedUnit = state.units === "metric" ? "m/s" : "mph";

    const headerLine = stateCode
        ? `Weather in ${city}, ${stateCode}, ${country}`
        : `Weather in ${city}, ${country}`;

    const sunriseStr = formatLocalTime(sunrise, timezoneOffset);
    const sunsetStr = formatLocalTime(sunset, timezoneOffset);

    const tempStr = colorTemp(temp, state.units);
    const feelsStr = colorTemp(feels_like, state.units);
    const minStr = colorTemp(temp_min, state.units);
    const maxStr = colorTemp(temp_max, state.units);

    const label = (s: string) => pc.dim(s);
    const divider = pc.dim("────────────────────────────");

    return [
        pc.bold(pc.cyan(headerLine)),
        divider,
        `${label("Condition   :")} ${pc.yellow(condition)} ${pc.dim(`(${description})`)}`,
        `${label("Temperature :")} ${tempStr}${tempUnit} ${pc.dim(`(feels like ${feelsStr}${tempUnit})`)}`,
        `${label("Low / High  :")} ${minStr}${tempUnit} ${pc.dim("/")} ${maxStr}${tempUnit}`,
        `${label("Humidity    :")} ${humidity}%`,
        `${label("Pressure    :")} ${pressure} hPa`,
        `${label("Wind        :")} ${windSpeed} ${speedUnit} ${degToCompass(windDeg)} ${pc.dim(`(gust ${windGust} ${speedUnit})`)}`,
        `${label("Cloudiness  :")} ${clouds}%`,
        `${label("Visibility  :")} ${(visibility / 1000).toFixed(1)} km`,
        `${label("Sunrise     :")} ${pc.yellow(sunriseStr)}`,
        `${label("Sunset      :")} ${pc.yellow(sunsetStr)}`,
    ].join("\n");
}

export function colorTemp(temp: number, units: "metric" | "imperial"): string {
    const t = units === "metric" ? temp : (temp - 32) * 5 / 9; // normalize to °C
    const str = temp.toFixed(1);
    if (t <= 0)  return pc.cyan(str);
    if (t <= 15) return pc.blue(str);
    if (t <= 27) return pc.yellow(str);
    return pc.red(str);
}

export function degToCompass(num: number) {
        const val = Math.floor((num / 22.5) + 0.5);
        const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
        return arr[val % 16];
}

export function formatLocalTime(timestamp?: number, timezoneOffset?: number): string {
    if (!timestamp || timezoneOffset === undefined) return "N/A";

    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toUTCString().slice(-12, -4);
}
