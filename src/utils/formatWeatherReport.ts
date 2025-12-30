import { State } from "src/cli/state.js";
import { WeatherReport } from "src/types/weather.js";

export function formatWeatherReport(
    state: State,
    city: string,
    country: string,
    weather: WeatherReport,
    stateCode?: string
): string {
    const {temp, feels_like, temp_min, temp_max, pressure, humidity } =
    weather.main;

    const condition = weather.weather?.[0]?.main ?? "Unknown";
    const description = weather.weather?.[0]?.description ?? "";
    const { speed: windSpeed = 0, deg: windDeg = 0, gust: windGust = 0 } = weather.wind ?? {};
    const { all: clouds = 0 } = weather.clouds ?? {};
    const visibility = weather.visibility ?? 0;

    const {sunrise, sunset, country: sysCountry } = weather.sys ?? {};
    const timezoneOffset = weather.timezone ?? 0;

    const tempUnit = state.units === "metric" ? "°C" : "°F";
    const speedUnit = state.units === "metric" ? "m/s" : "mph";
    const headerLine = stateCode 
        ? `Weather in ${city}, ${stateCode}, ${country}` 
        : `Weather in ${city}, ${country}`;

    const sunriseStr = formatLocalTime(sunrise, timezoneOffset);
    const sunsetStr = formatLocalTime(sunset, timezoneOffset);


    return `
${headerLine}
────────────────────────────
Condition   : ${condition} (${description})
Temperature : ${temp.toFixed(1)}${tempUnit} (feels like ${feels_like.toFixed(1)}${tempUnit})
Low / High  : ${temp_min.toFixed(1)}${tempUnit} / ${temp_max.toFixed(1)}${tempUnit}
Humidity    : ${humidity}%
Pressure    : ${pressure} hPa
Wind        : ${windSpeed} ${speedUnit} ${degToCompass(windDeg)} (gust ${windGust} ${speedUnit})
Cloudiness  : ${clouds}%
Visibility  : ${(visibility / 1000).toFixed(1)} km
Sunrise     : ${sunriseStr}
Sunset      : ${sunsetStr}
`.trim();
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
