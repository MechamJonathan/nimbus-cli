import { Cache } from "./cache.js";
import { Location, WeatherReport } from "../types/weather.js";
import 'dotenv/config';

export class OpenWeatherMapAPI {
    private readonly apiKey: string;
    private static readonly baseURL = "https://api.openweathermap.org/data/2.5/weather?";
    private static readonly baseGeoCodeURL = "http://api.openweathermap.org/geo/1.0/direct?"
    private cache: Cache;

    constructor(cacheInterval: number) {
        const key = process.env.OPENWEATHERMAP_API_KEY;
        if (!key) 
            throw new Error("OPENWEATHERMAP_API_KEY is not set in environment variable.");
        this.apiKey = key;
        this.cache = new Cache(cacheInterval);
    }

    closeCache() {
        this.cache.stopReapLoop();
    }

    private async fetchLocation( 
        city: string, 
        state?: string,
        country?: string
    ): Promise<Location> {
        const queryParts = [city];
        if (state) queryParts.push(state);
        if (country) queryParts.push(country);

        const query = queryParts.join(",");

        const cacheKey = `location:${query.toLowerCase()}`;
        const cached = this.cache.get<Location>(cacheKey);
        if (cached) {
            return cached;
        }

        const fullURL = OpenWeatherMapAPI.baseGeoCodeURL + 
            `q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`;

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            const data = (await resp.json()) as Location[];
            const location = data[0]

            this.cache.add<Location>(cacheKey, location);
            return location;
        } catch (err) {
            throw new Error(`Error fetching location: ${(err as Error).message}`);
        }
    }

    private async fetchWeather(location: Location) {
        const cacheKey = `weather:${location.lat},${location.lon}`;
        const cached = this.cache.get<WeatherReport>(cacheKey);
        if (cached) {
            return cached;
        }

        const fullURL = OpenWeatherMapAPI.baseURL + 
            `lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}`;

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            const data = (await resp.json()) as WeatherReport;
            this.cache.add(cacheKey, data);
            return data;
        } catch (err) {
            throw new Error(`Error fetching weather report: ${(err as Error).message}`);
        }
    }

    async fetchWeatherByCity(
        city: string, 
        state?: string, 
        country?: string
    ): Promise<{
        location: Location;
        weather: WeatherReport;
        }> {
        const location = await this.fetchLocation(city, state, country);
        const weather = await this.fetchWeather(location)

        return { location, weather};
    }
}