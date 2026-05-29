import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { Location } from "../types/weather.js";

const CONFIG_DIR = join(homedir(), ".nimbus-cli");
const CONFIG_FILE = join(CONFIG_DIR, "summary.json");

export function loadSummaryList(): Record<string, Location> {
    try {
        const raw = readFileSync(CONFIG_FILE, "utf-8");
        return JSON.parse(raw) as Record<string, Location>;
    } catch {
        return {};
    }
}

export function saveSummaryList(summaryList: Record<string, Location>): void {
    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(CONFIG_FILE, JSON.stringify(summaryList, null, 2), "utf-8");
}
