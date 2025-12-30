import { commandWeather } from "./command_weather.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { CLICommand } from "../cli/state.js";
import { commandUnits } from "./command_units.js";

export function getCommands(): Record<string, CLICommand> {
    return {
        exit: {
            name: "exit",
            description: "Exits the CLI application.",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Displays a list of available commands and their usage.",
            callback: commandHelp,
        },
        weather: {
            name: "weather",
            description: `Displays current weather for a city 
    Usage: weather <city> [state] [country]
        Examples:
        weather Oslo
        weather Nashville TN US`,
            callback: commandWeather,
        },
        units: {
            name: "units",
            description: `Sets the temperature units for weather reports. 
    Usage: units <c|f>
        Examples:
        units c      # Celsius
        units f      # Fahrenheit
    To see the current units, run 'units' without arguments.`,
            callback: commandUnits,
        }
    }
}