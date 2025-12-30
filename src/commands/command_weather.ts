import { parseCityFromTokens } from "../utils/parseCity.js";
import { State } from "../cli/state.js";
import { formatWeatherReport } from "../utils/formatWeatherReport.js";

export async function commandWeather(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("you must provide a location name");
        return;
    }

    const { city, state: st, country } = parseCityFromTokens(args);
    try{
        const { location, weather } = await state.openWeatherMapAPI.fetchWeatherByCity(city, st, country, state.units);

        console.log();
        console.log(formatWeatherReport(state, location.name, location.country, weather, location.state));
        console.log();
    } catch (err) {
        console.log(`Could not find weather for "${city}"`, err);
    }
}