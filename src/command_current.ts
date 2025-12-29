import { State } from "./state";

export async function commandCurrent(state: State, ...args: string[]): Promise<void> {
    const city = args.join(" ");

    if (args.length < 1) {
        console.log("you must provide a location name");
        return;
    }

    try{
        const location = await state.openWeatherMapAPI.fetchLocation(city);
        const locationWeather = await state.openWeatherMapAPI.fetchWeather(location);

        console.log(`fetching weather in ${city}...`);
        console.log("Current weather:")
        console.log(locationWeather.name);
        console.log(locationWeather.rain);
        console.log(locationWeather.visibility);
    } catch (err) {
        console.log(`Could not find weather for "${city}"`)
    }
    
}