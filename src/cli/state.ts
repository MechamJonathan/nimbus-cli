import { createInterface, type Interface } from "readline";
import { getCommands } from "../commands/commands.js";
import { OpenWeatherMapAPI } from "../api/open_weather_map_api.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => void;
};

export type State = {
    readline: Interface;
    registry: Record<string, CLICommand>,
    openWeatherMapAPI: OpenWeatherMapAPI,
    units: "metric" | "imperial";

};

export function initState(cacheInterval: number): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "NimbusCLI > "
    });

    const commands = getCommands();

    return {
        readline: rl,
        registry: commands,
        openWeatherMapAPI: new OpenWeatherMapAPI(cacheInterval),
        units: "imperial",
    };
};