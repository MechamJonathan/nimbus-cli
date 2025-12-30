
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
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number,
        grnd_level: number,
    }

}