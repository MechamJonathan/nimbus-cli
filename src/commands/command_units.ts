import { State } from "src/cli/state";

export async function commandUnits(state: State, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log(`Current units: ${state.units} (${state.units === "metric" ? "Celsius" : "Fahrenheit"})`);
        return;
    }

    const input = args[0];
    if (input === "c" || input === "celcius") {
        state.units = "metric";
        console.log("Units set to Celcius");
    } else if (input === "f" || input === "fahrenheit") {
        state.units = "imperial";
        console.log("Units set to Fahrenheit");
    } else {
        console.log("Unkown units. Use 'c'/'celcius' or 'f'/fahrenheit'");
    }
}