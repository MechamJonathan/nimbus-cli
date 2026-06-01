import { State } from "../cli/state.js";
import { formatWeatherReport } from "../utils/formatWeatherReport.js";
import { Spinner } from "../utils/spinner.js";
import { parseApiError } from "../utils/parseApiError.js";

export async function commandSummary(state: State) {
    const locations = Object.values(state.summaryList);
    if (locations.length === 0) {
        console.log("Summary list is empty.");
        return;
    }

    for (const loc of locations) {
        const spinner = new Spinner(`Fetching weather for ${loc.name}...`);
        spinner.start();
        try {
            const { weather } = await state.openWeatherMapAPI.fetchWeatherByCity(loc.name, loc.state, loc.country, state.units);
            spinner.stop();
            console.log();
            console.log(formatWeatherReport(state, loc.name, loc.country, weather, loc.state));
            console.log();
        } catch (err) {
            spinner.stop();
            console.log(parseApiError(err, loc.name));
        }
    }
}