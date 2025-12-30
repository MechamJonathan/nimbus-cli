
export function parseCityFromTokens(tokens: string[]): { 
    city: string; 
    state?: string;
    country?: string 
} {
    if (tokens.length === 0) {
        throw new Error("No location provided");
    }

    let cityTokens = tokens;
    let state: string | undefined;
    let country: string | undefined;

    if (/^[a-z]{2}$/.test(tokens[tokens.length - 1])) {
        country = tokens[tokens.length - 1];
        cityTokens = tokens.slice(0, -1);
    }

    if (country === "us" && cityTokens.length > 1) {
        const possibleState = cityTokens[cityTokens.length - 1];
        if (/^[a-z]{2}$/.test(possibleState)) {
            state = possibleState;
            cityTokens = cityTokens.slice(0, -1);
        }
    }

    return {
        city: cityTokens.join(" "),
        state,
        country,
    };
}