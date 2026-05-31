import { createInterface, type Interface } from "node:readline";
import { getCommands } from "../commands/commands.js";
import { OpenWeatherMapAPI } from "../api/open_weather_map_api.js";
import { Location } from "../types/weather.js";
import { loadConfig } from "../utils/configStore.js";

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
    summaryList: Record<string, Location>;
    summaryOrder: string[];
};

export function initState(cacheInterval: number): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "NimbusCLI > "
    });

    const commands = getCommands();
    const config = loadConfig();

    return {
        readline: rl,
        registry: commands,
        openWeatherMapAPI: new OpenWeatherMapAPI(cacheInterval),
        units: config.units,
        summaryList: config.summaryList,
        summaryOrder: config.summaryOrder,
    };
};