import { State } from "./state.js";
import { formatWeatherReport } from "../utils/formatWeatherReport.js";
import { Spinner } from "../utils/spinner.js";
import { parseApiError } from "../utils/parseApiError.js";

export async function startREPL(state: State) {
    // Auto-fetch weather for the default city on startup
    if (state.defaultCity) {
        const loc = state.defaultCity;
        const spinner = new Spinner(`Fetching weather for ${loc.name}...`);
        spinner.start();
        try {
            const { weather } = await state.openWeatherMapAPI.fetchWeatherByCity(
                loc.name, loc.state, loc.country, state.units
            );
            spinner.stop();
            console.log();
            console.log(formatWeatherReport(state, loc.name, loc.country, weather, loc.state));
            console.log();
        } catch (err) {
            spinner.stop();
            console.log(parseApiError(err, loc.name));
        }
    }

    state.readline.prompt();

    state.readline.on('line', async (input) => {
        const received = cleanInput(input);

        if (received.length === 0) {
            state.readline.prompt();
            return;
        }

        if (received[0] in state.registry) {
            const cmd = state.registry[received[0]];
            const args = received.slice(1);
            await cmd.callback(state, ...args);
        } else {
            console.log("Unknown command")
        }
        
        state.readline.prompt();
    });
}


export function cleanInput(input: string): string[] {
  return input
  .toLowerCase()
  .trim()
  .split(" ")
  .filter((word) => word.length > 0);
}
