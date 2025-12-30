import { State } from "../cli/state.js";

export function commandExit(state: State) {
    console.log("Closing NimbusCLI... Goodbye!");
    state.readline.close();
    process.exit(0);
}