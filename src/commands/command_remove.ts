import { State } from "../cli/state.js";
import { parseCityFromTokens } from "../utils/parseCityFromTokens.js";
import { makeLocationKey } from "../utils/makeLocationKey.js";
import { saveConfig } from "../utils/configStore.js";

export async function commandRemove(state: State, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        console.log("You must provide a location name to remove");
        return;
    }

    const { city, state: stateCode, country } = parseCityFromTokens(args);

    let location;
    try {
        location = await state.openWeatherMapAPI.fetchLocation(
            city,
            stateCode,
            country
        );
    } catch (err) {
        console.log(`Could not fetch location "${city}": ${(err as Error).message}`);
        return;
    }

    const key = makeLocationKey(location.name, location.state, location.country);

    if (!state.summaryList[key]) {
        console.log(
            `${location.name}${location.state ? ", " + location.state : ""}, ${location.country} is not in the summary list.`
        );
        return;
    }

    delete state.summaryList[key];
    state.summaryOrder = state.summaryOrder.filter(k => k !== key);
    saveConfig({ units: state.units, summaryList: state.summaryList, summaryOrder: state.summaryOrder, defaultCity: state.defaultCity });

    console.log(
        `${location.name}${location.state ? ", " + location.state : ""}, ${location.country} removed from summary list.`
    );
}