import { startREPL } from "./cli/repl.js";
import { initState } from "./cli/state.js";

function resizeTerminal(cols: number, rows: number) {
    if (process.stdout.isTTY) {
        process.stdout.write(`\x1b[8;${rows};${cols}t`);
    }
}

function main() {
    resizeTerminal(120, 40);
    const state = initState(1000 * 60 * 5); // 5 minutes
    startREPL(state);
}

main();
