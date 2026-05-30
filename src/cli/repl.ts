import { State } from "./state.js";

export function startREPL(state: State) {
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
