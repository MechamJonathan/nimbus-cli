import { State } from "../cli/state.js";

export async function commandExit(state: State) {
    console.log("Closing NimbusCLI... Goodbye!");
    state.readline.close();
    state.openWeatherMapAPI.closeCache();
    process.exit(0);
}