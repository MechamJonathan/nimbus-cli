import { State } from "src/cli/state.js";
import { parseCityFromTokens } from "../utils/parseCity.js";
import { makeLocationKey } from "../utils/makeLocationKey.js"; 

export async function commandRemove(state: State, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        console.log("You must provide a location name to remove");
        return;
    }

    const { city, state: stateCode, country } = parseCityFromTokens(args);
    const key = makeLocationKey(city, stateCode, country);

    if (state.summaryList[key]) {
        delete state.summaryList[key];
        console.log(`${city}${stateCode ? ", " + stateCode : ""}${country ? ", " + country : ""} removed from summary list.`);
    } else {
        console.log(`${city} not found in summary list.`);
    }
}