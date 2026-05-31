import { Cache } from "./cache.js";
import { Location, WeatherReport, ForecastResponse } from "../types/weather.js";
import 'dotenv/config';

export class OpenWeatherMapAPI {
    private readonly apiKey: string;
    private static readonly baseURL = "https://api.openweathermap.org/data/2.5/weather?";
    private static readonly baseForecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
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

    async fetchLocation( 
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
            if (data.length === 0) {
                throw new Error(`Location "${query}" not found`);
            }
            const location = data[0];

            this.cache.add<Location>(cacheKey, location);
            return location;
        } catch (err) {
            throw new Error(`Error fetching location: ${(err as Error).message}`);
        }
    }

    private async fetchWeather(
        location: Location, 
        units: "metric" | "imperial"
    ) {
        const cacheKey = `weather:${location.lat},${location.lon},${units}`;
        const cached = this.cache.get<WeatherReport>(cacheKey);
        if (cached) {
            return cached;
        }

        const fullURL = OpenWeatherMapAPI.baseURL + 
            `lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=${units}`;

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

    async fetchForecastByCity(
        city: string,
        state?: string,
        country?: string,
        units: "metric" | "imperial" = "imperial",
    ): Promise<{ location: Location; forecast: ForecastResponse }> {
        const location = await this.fetchLocation(city, state, country);

        const cacheKey = `forecast:${location.lat},${location.lon},${units}`;
        const cached = this.cache.get<ForecastResponse>(cacheKey);
        if (cached) {
            return { location, forecast: cached };
        }

        const fullURL = OpenWeatherMapAPI.baseForecastURL +
            `lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=${units}`;

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }
            const forecast = (await resp.json()) as ForecastResponse;
            this.cache.add(cacheKey, forecast);
            return { location, forecast };
        } catch (err) {
            throw new Error(`Error fetching forecast: ${(err as Error).message}`);
        }
    }

    async fetchWeatherByCity(
        city: string, 
        state?: string, 
        country?: string,
        units: "metric" | "imperial" = "imperial",
    ): Promise<{
        location: Location;
        weather: WeatherReport;
        }> {
        const location = await this.fetchLocation(city, state, country);
        const weather = await this.fetchWeather(location, units);

        return { location, weather};
    }
}