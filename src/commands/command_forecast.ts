import { State } from "../cli/state.js";
import { parseCityFromTokens } from "../utils/parseCityFromTokens.js";
import { formatForecast } from "../utils/formatForecast.js";

export async function commandForecast(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("You must provide a location name.");
        return;
    }

    const { city, state: stateCode, country } = parseCityFromTokens(args);

    try {
        const { location, forecast } = await state.openWeatherMapAPI.fetchForecastByCity(
            city, stateCode, country, state.units
        );
        console.log();
        console.log(formatForecast(location.name, location.country, forecast, state.units, location.state));
        console.log();
    } catch (err) {
        console.log(`Could not fetch forecast for "${city}": ${(err as Error).message}`);
    }
}
