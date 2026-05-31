import { ForecastEntry, ForecastResponse } from "../types/weather.js";
import { colorTemp, colorCondition, degToCompass } from "./formatWeatherReport.js";
import pc from "picocolors";

type DayGroup = { date: string; label: string; entries: ForecastEntry[] };

function groupByDay(list: ForecastEntry[], timezoneOffset: number): DayGroup[] {
    const groups = new Map<string, ForecastEntry[]>();

    for (const entry of list) {
        const localMs = (entry.dt + timezoneOffset) * 1000;
        const d = new Date(localMs);
        const date = d.toUTCString().slice(0, 3) + " " +
            String(d.getUTCDate()).padStart(2, "0") + " " +
            d.toUTCString().slice(8, 11).toUpperCase();
        if (!groups.has(date)) groups.set(date, []);
        groups.get(date)!.push(entry);
    }

    return Array.from(groups.entries()).map(([label, entries]) => ({
        date: label,
        label,
        entries,
    }));
}

export function formatForecast(
    city: string,
    country: string,
    forecast: ForecastResponse,
    units: "metric" | "imperial",
    stateCode?: string,
): string {
    const timezoneOffset = forecast.city.timezone;
    const tempUnit  = units === "metric" ? "°C" : "°F";
    const speedUnit = units === "metric" ? "m/s" : "mph";

    const location = stateCode
        ? `${city.toUpperCase()}, ${stateCode.toUpperCase()}, ${country.toUpperCase()}`
        : `${city.toUpperCase()}, ${country.toUpperCase()}`;

    const arrow  = pc.green("▸");
    const muted  = (s: string) => pc.dim(s);
    const divider = pc.dim(pc.green("  " + "─".repeat(44)));

    const header = [
        `  ${pc.dim(pc.green("LOCATION :"))} ${pc.bold(pc.cyan(location))}`,
        `  ${pc.dim(pc.green("FORECAST  :"))} ${pc.dim(pc.green("5-DAY"))}`,
        divider,
    ].join("\n");

    const days = groupByDay(forecast.list, timezoneOffset).slice(0, 5);

    const dayBlocks = days.map(({ label, entries }) => {
        const temps  = entries.map(e => e.main.temp);
        const lo     = Math.min(...temps);
        const hi     = Math.max(...temps);
        const cond   = entries[Math.floor(entries.length / 2)].weather?.[0]?.main ?? "Unknown";

        const dayHeader = `  ${pc.bold(pc.green(label.padEnd(12)))}  ` +
            `${muted("lo")} ${colorTemp(lo, units)}${tempUnit}  ` +
            `${muted("hi")} ${colorTemp(hi, units)}${tempUnit}  ` +
            `${colorCondition(cond)}`;

        const rows = entries.map(entry => {
            const localMs = (entry.dt + timezoneOffset) * 1000;
            const time    = new Date(localMs).toUTCString().slice(-12, -7);
            const temp    = colorTemp(entry.main.temp, units);
            const condition = pc.dim((entry.weather?.[0]?.description ?? "").padEnd(20));
            const wind    = entry.wind?.speed ?? 0;
            const windDir = degToCompass(entry.wind?.deg ?? 0);
            return `    ${muted(time)}  ${temp}${tempUnit}  ${condition}  ${muted(`${wind} ${speedUnit} ${windDir}`)}`;
        });

        return [dayHeader, ...rows].join("\n");
    });

    return [header, "", dayBlocks.join("\n\n")].join("\n");
}
