import { startREPL } from "./cli/repl.js";
import { initState } from "./cli/state.js";

function resizeTerminal(cols: number, rows: number) {
    if (process.stdout.isTTY) {
        process.stdout.write(`\x1b[8;${rows};${cols}t`);
    }
}

async function main() {
    // Snapshot original size before expanding
    const originalCols = process.stdout.columns ?? 80;
    const originalRows = process.stdout.rows ?? 24;

    // 5 days × up to 8 slots + headers + spacing ≈ 60 rows; 120 cols for forecast rows
    resizeTerminal(120, 60);

    // Restore on any exit path — exit event fires for process.exit() and SIGINT
    const restore = () => resizeTerminal(originalCols, originalRows);
    process.on("exit", restore);
    process.on("SIGINT", () => { restore(); process.exit(0); });

    const state = initState(1000 * 60 * 5); // 5 minutes
    await startREPL(state);
}

main();
