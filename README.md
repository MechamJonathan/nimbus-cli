# NimbusCLI

NimbusCLI is a Node.js command-line weather assistant that uses the OpenWeather API to fetch current conditions and forecasts. It runs as an interactive REPL, supports caching, and lets you customize units and location.

## Features

- Interactive REPL interface (`NimbusCli > ` prompt)
- Current weather by city (and optionally by state and/or country)
- Configurable units: metric or imperial
- Summary list of saved locations
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
  - show available commands and usage examples

- ```weather <city> [state] [country]```
  - Get current weather for a city.

- ```units <c|f>```
  - Set preferred units for furture calls

- ```add <city> [state] [country]```
  - add city to summary list

- ```remove <city> [state] [country]```
  - remove city from summary list
 
- ```summary```
  - Get current weather for all locations in summary list
 
### Testing
```npm test```

## Future Improvements
- 5‑day forecast by city
- Improve colored/pretty CLI output
- Add more test coverage for commands and error cases
- Add support for air quality and weather alerts
    
  
