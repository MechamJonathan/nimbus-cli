import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { Location } from "../types/weather.js";

const CONFIG_DIR = join(homedir(), ".nimbus-cli");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export type Config = {
    units: "metric" | "imperial";
    summaryList: Record<string, Location>;
};

const DEFAULT_CONFIG: Config = {
    units: "imperial",
    summaryList: {},
};

export function loadConfig(): Config {
    try {
        const raw = readFileSync(CONFIG_FILE, "utf-8");
        const parsed = JSON.parse(raw) as Partial<Config>;
        return { ...DEFAULT_CONFIG, ...parsed };
    } catch {
        return { ...DEFAULT_CONFIG };
    }
}

export function saveConfig(config: Config): void {
    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
