import pc from "picocolors";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

export class Spinner {
    #timer: NodeJS.Timeout | undefined;
    #frame = 0;
    #message: string;

    constructor(message: string) {
        this.#message = message;
    }

    start() {
        if (!process.stdout.isTTY) return;
        process.stdout.write("\x1b[?25l"); // hide cursor
        this.#timer = setInterval(() => {
            const frame = pc.green(FRAMES[this.#frame % FRAMES.length]);
            process.stdout.write(`\r${frame}  ${pc.dim(this.#message)}`);
            this.#frame++;
        }, INTERVAL_MS);
    }

    stop() {
        if (!process.stdout.isTTY) return;
        clearInterval(this.#timer);
        process.stdout.write("\r\x1b[2K"); // clear the spinner line
        process.stdout.write("\x1b[?25h"); // restore cursor
    }
}
