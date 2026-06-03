import pc from "picocolors";
import { State } from "../cli/state.js";
import { parseCityFromTokens } from "../utils/parseCityFromTokens.js";
import { saveConfig } from "../utils/configStore.js";
import { Spinner } from "../utils/spinner.js";
import { parseApiError } from "../utils/parseApiError.js";

export async function commandDefault(state: State, ...args: string[]): Promise<void> {
    // "default" with no args — show current default
    if (args.length === 0) {
        if (state.defaultCity) {
            const parts = [state.defaultCity.name, state.defaultCity.state, state.defaultCity.country]
                .filter(Boolean)
                .join(", ");
            console.log(`Default city: ${pc.cyan(pc.bold(parts))}`);
        } else {
            console.log("No default city set. Use: default <city> [state] [country]");
        }
        return;
    }

    // "default unset" — clear default
    if (args[0] === "unset") {
        state.defaultCity = null;
        saveConfig({
            units: state.units,
            summaryList: state.summaryList,
            summaryOrder: state.summaryOrder,
            defaultCity: null,
        });
        console.log("Default city cleared.");
        return;
    }

    // "default <city>" — resolve and save
    const { city, state: stateCode, country } = parseCityFromTokens(args);
    const spinner = new Spinner(`Resolving location for ${city}...`);
    spinner.start();
    try {
        const { location } = await state.openWeatherMapAPI.fetchWeatherByCity(city, stateCode, country, state.units);
        spinner.stop();
        state.defaultCity = location;
        saveConfig({
            units: state.units,
            summaryList: state.summaryList,
            summaryOrder: state.summaryOrder,
            defaultCity: location,
        });
        const parts = [location.name, location.state, location.country].filter(Boolean).join(", ");
        console.log(`Default city set to ${pc.cyan(pc.bold(parts))}.`);
    } catch (err) {
        spinner.stop();
        console.log(parseApiError(err, city));
    }
}
