import { State } from "../cli/state.js";

export async function commandHelp(state: State) {
    console.log();
    console.log("Welcome to Nimbus CLI!");
    console.log("Usage:");
    console.log();

    const commands = state.registry;

    for (const cmd of Object.values(commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
        console.log();
    }
    console.log();
}