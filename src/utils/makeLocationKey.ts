

export function makeLocationKey(city: string, state?: string, country?: string): string {
    const normalizedCity = city.trim().replace(/\s+/g, " ").toLowerCase();
    const normalizedState = state?.trim().toLowerCase();
    const normalizedCountry = country?.trim().toLowerCase();

    return [normalizedCity, normalizedState, normalizedCountry].filter(Boolean).join(",");
}