# NimbusCLI

NimbusCLI is a Node.js command-line weather assistant that uses the OpenWeather API to fetch current conditions and 5-day forecasts. It runs as an interactive REPL, supports caching, and lets you customize units and location.

## Features

- Interactive REPL interface (`NimbusCli > ` prompt)
- Current weather by city (and optionally by state and/or country)
- Configurable units: metric or imperial
- 5-day weather forecast by city
- Summary list of saved locations, persisted across sessions in `~/.nimbus-cli/config.json`
- Colored spy-briefing style output
- In‑memory caching with TTL to reduce API calls
- Helpful `help` command with usage info
- Graceful error handling and input validation
- Modular architecture (REPL, services, cache, utils)

## Tech Stack

- Node.js
- OpenWeather API
- Built‑in `readline` for the REPL
- Vitest for testing
- dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- An OpenWeather API key:  
  https://openweathermap.org/api

### Installation

```bash
git clone https://github.com/MechamJonathan/nimbus-cli.git
cd nimbus-cli
npm install
```

Create a .env file in the project root:
```bash
OPENWEATHER_API_KEY=your_api_key_here
```

### Running the App

```bash
npm start
```
you should see a prompt like:
```bash
NimbusCLI >
```

### Usage

Type commands at the ```NimbusCLI >``` prompt.

### Core Commands
- ```help```
  - Show available commands and usage examples.

- ```weather <city> [state] [country]```
  - Get current weather for a city.
  ```
  weather Oslo
  weather Salt Lake City UT US
  ```

- ```forecast <city> [state] [country]```
  - Get a 5-day forecast for a city, grouped by day with lo/hi temps and 3-hour slots.
  ```
  forecast Oslo
  forecast Salt Lake City UT US
  ```

- ```units <c|f>```
  - Set preferred temperature units (Celsius or Fahrenheit). Persisted across sessions.
  ```
  units c
  units f
  ```

- ```add <city> [state] [country]```
  - Add a city to the summary list. Order is preserved.

- ```remove <city> [state] [country]```
  - Remove a city from the summary list.

- ```summary```
  - Show current weather for all saved locations in the order they were added.

- ```clear```
  - Remove all locations from the summary list at once.

> **Note:** your summary list and unit preference are saved to `~/.nimbus-cli/config.json` and restored automatically each time you start NimbusCLI.
 
### Testing
```npm test```

## Future Improvements
- Add support for air quality and weather alerts
- Spinner/loading indicator for API calls
- Smarter error messages (rate limit, invalid key, network down)
    
  
