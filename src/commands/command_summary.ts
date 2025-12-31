import { State } from "../cli/state.js";
import { formatWeatherReport } from "../utils/formatWeatherReport.js";

export async function commandSummary(state: State) {
    const locations = Object.values(state.summaryList);
    if (locations.length === 0) {
        console.log("Summary list is empty.");
        return;
    }

    for (const loc of locations) {
        try{
            const { weather } = await state.openWeatherMapAPI.fetchWeatherByCity(loc.name, loc.state, loc.country, state.units);
            console.log();
            console.log(formatWeatherReport(state, loc.name, loc.country, weather, loc.state));
            console.log();
        } catch (err) {
            console.log(`Could not fetch weather for ${loc.name}: ${(err as Error).message}`);

        }
    }
}