
export type Location = {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    local_names?: Record<string, string>;
};

export type ForecastEntry = {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    weather: { id: number; main: string; description: string; icon: string }[];
    wind?: { speed?: number; deg?: number };
    clouds?: { all: number };
    rain?: { "3h"?: number };
    snow?: { "3h"?: number };
};

export type ForecastResponse = {
    list: ForecastEntry[];
    city: { name: string; country: string; timezone: number };
};

export type WeatherReport = {
    coord: { lon: number; lat: number };
    weather: { id: number; main: string; description: string; icon: string }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility?: number;
    wind?: { speed?: number; deg?: number; gust?: number };
    rain?: { "1h"?: number; "3h"?: number };
    snow?: { "1h"?: number; "3h"?: number };
    clouds?: { all: number };
    dt: number;
    sys?: { type?: number; id?: number; country: string; sunrise: number; sunset: number };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}