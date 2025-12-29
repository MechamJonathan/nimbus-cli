
export class OpenWeatherMapAPI {
    private static readonly apiKey = ""
    private static readonly baseURL = "https://api.openweathermap.org/data/2.5/weather?";
    private static readonly baseGeoCodeURL = "http://api.openweathermap.org/geo/1.0/direct?"

    constructor() {}

    async fetchLocation(city: string): Promise<Location> {
        const fullURL = OpenWeatherMapAPI.baseGeoCodeURL + `q=${city}&limit=5&appid=${OpenWeatherMapAPI.apiKey}`;
        console.log(fullURL);

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            const data = (await resp.json()) as Location[];
            return data[0];
        } catch (err) {
            throw new Error(`Error fetching location: ${(err as Error).message}`);
        }
    }

    async fetchWeather(location: Location) {
        const fullURL = OpenWeatherMapAPI.baseURL + 
            `lat=${location.lat}&lon=${location.lon}&appid=${OpenWeatherMapAPI.apiKey}`;

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            const data = (await resp.json()) as WeatherReport;
            return data;
        } catch (err) {
            throw new Error(`Error fetching weather report: ${(err as Error).message}`);
        }
    }
}

export type Location = {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

export type WeatherReport = {
    name: string;
    id: number;
    visibility: number,
    rain: {
        "1h": number,
    }
}