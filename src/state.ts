import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State) => void;
}

export type State = {
    readline: Interface;
    registry: Record<string, CLICommand>,
}

export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > "
    })

    const commands = getCommands();

    return {
        readline: rl,
        registry: commands, 
    }
}