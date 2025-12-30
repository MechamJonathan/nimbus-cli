import { startREPL } from "./cli/repl.js";
import { initState } from "./cli/state.js";

function main() {
    const state = initState(1000 * 60 * 5); // 5 minutes
    startREPL(state);
}

main();
