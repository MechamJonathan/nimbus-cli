import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";
import { OpenWeatherMapAPI } from "./open_weather_map_api.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => void;
}

export type State = {
    readline: Interface;
    registry: Record<string, CLICommand>,
    openWeatherMapAPI: OpenWeatherMapAPI,
}

export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "NimbusCLI > "
    })

    const commands = getCommands();

    return {
        readline: rl,
        registry: commands,
        openWeatherMapAPI: new OpenWeatherMapAPI(),
    }
}