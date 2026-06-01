export function parseApiError(err: unknown, subject: string): string {
    const msg = (err as Error).message ?? "";

    if (msg.includes("401"))
        return `Invalid API key. Check OPENWEATHERMAP_API_KEY in your .env file.`;
    if (msg.includes("429"))
        return `Rate limit reached. Too many requests — wait a moment and try again.`;
    if (msg.includes("not found") || msg.includes("404"))
        return `Location "${subject}" not found. Try a different city name or add a country code.`;
    if (msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED") || msg.includes("fetch"))
        return `Network error. Check your internet connection and try again.`;

    return `Could not fetch data for "${subject}": ${msg}`;
}
