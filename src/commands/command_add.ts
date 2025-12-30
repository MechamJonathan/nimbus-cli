import { State } from "../cli/state.js";
import { parseCityFromTokens } from "../utils/parseCity.js";
import { makeLocationKey } from "../utils/makeLocationKey.js"; 


export async function commandAdd(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("you must provide a location name");
        return;
    }

    const { city, state: stateCode, country} = parseCityFromTokens(args);

    let location;
    try {
        location = await state.openWeatherMapAPI.fetchLocation(city, stateCode, country);
    } catch (err) {
        console.log(`Could not fetch location "${city}": ${(err as Error).message}`);
        return;
    }

    const key = makeLocationKey(location.name, location.state, location.country);

    if (state.summaryList[key]) {
        console.log(`${city}${stateCode ? ", " + stateCode : ""}${country ? ", " + country : ""} is already in the summary list.`);
        return;
    }

    state.summaryList[key] = location;
    console.log(`${location.name}${location.state ? ", " + location.state : ""}, ${location.country} added to summary list.`);
}