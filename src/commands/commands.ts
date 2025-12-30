import { commandWeather } from "./command_weather.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { CLICommand } from "../cli/state.js";
import { commandUnits } from "./command_units.js";
import { commandAdd } from "./command_add.js";
import { commandSummary } from "./command_summary.js";
import { commandRemove } from "./command_remove.js";

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
        weather Salt Lake City UT US`,
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
        },
        add: {
            name: "add",
            description: `add location to summary list.
    Usage: add <city> [state] [country]
        Examples:
        add Oslo
        add Salt Lake City UT US`,
            callback: commandAdd,
        },
        remove: {
            name: "remove",
            description: `remove location from summary list.
    Usage: remove <city> [state] [country]
        Examples:
        remove Oslo
        remove Salt Lake City UT US`,
            callback: commandRemove,
        },
        summary: {
            name: "summary",
            description: `Display summary list weather report
    Usage: summary`,
            callback: commandSummary,
        }

    }
}