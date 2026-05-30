import { State } from "../cli/state.js";
import { saveConfig } from "../utils/configStore.js";

export async function commandUnits(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log(`Current units: ${state.units} (${state.units === "metric" ? "Celsius" : "Fahrenheit"})`);
        return;
    }

    const input = args[0];
    if (input === "c" || input === "celsius") {
        state.units = "metric";
        console.log("Units set to Celsius");
    } else if (input === "f" || input === "fahrenheit") {
        state.units = "imperial";
        console.log("Units set to Fahrenheit");
    } else {
        console.log("Unknown units. Use 'c'/'celsius' or 'f'/'fahrenheit'");
        return;
    }
    saveConfig({ units: state.units, summaryList: state.summaryList });
}