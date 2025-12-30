import { parseCityFromTokens } from "../utils/parseCity.js";
import { WeatherReport } from "../types/weather.js";
import { State } from "../cli/state.js";

export async function commandWeather(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("you must provide a location name");
        return;
    }

    const { city, state: st, country } = parseCityFromTokens(args);
    try{
        const { location, weather } = await state.openWeatherMapAPI.fetchWeatherByCity(city, st, country);

        console.log();
        console.log(formatCurrentWeather(location.name, location.country, weather, location.state));
        console.log();
    } catch (err) {
        console.log(`Could not find weather for "${city}"`, err);
    }
}

export function formatCurrentWeather(
    city: string,
    country: string,
    weather: WeatherReport,
    state?: string
): string {
    const {temp, feels_like, temp_min, temp_max, pressure, humidity } =
    weather.main;
    const headerLine = state ? `Weather in ${city}, ${state}, ${country}` : `Weather in ${city}, ${country}`;

    return `
${headerLine}
────────────────────────────
Temperature : ${temp.toFixed(1)}°C (feels like ${feels_like.toFixed(1)}°C)
Low / High  : ${temp_min.toFixed(1)}°C / ${temp_max.toFixed(1)}°C
Humidity    : ${humidity}%
Pressure    : ${pressure} hPa
`.trim();
}