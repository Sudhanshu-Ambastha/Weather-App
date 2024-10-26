# Weather App

A weather forecasting web application built with React, CSS, and the OpenWeatherMap API. It provides real-time weather information, 5-day forecasts, air quality data, and supports geolocation to display weather based on the user's current location.

<picture><img src = "./Weather App.gif" width = 100%></picture>

## Table of Contents
- [Weather App](#weather-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Routing](#routing)
  - [Error Handling](#error-handling)
  - [Dependencies](#dependencies)
  - [Live Demo](#live-demo)

## Introduction

This Weather App allows users to search for weather conditions by city name or use geolocation to fetch current weather, air quality index (AQI), humidity, UV index, and 5-day forecasts. The app leverages the OpenWeatherMap API for weather data and includes error handling for failed requests.

## Features
- Real-time weather information with temperature, weather conditions, and icons.
- Celsius and Fahrenheit toggle to switch between temperature units.
- Air Quality Index (AQI) display with pollutant breakdown (PM2.5, NO2, SO2, etc.).
- 5-day weather forecast showing min/max temperatures.
- Hourly forecast with wind speed, temperature, and weather conditions.
- Sunrise/sunset times and UV index.
- **Geolocation Support:** The app can fetch weather based on the user's current location, making it easy to see local weather conditions without manual input. If location access is denied, a fallback location (Ghaziabad, Uttar Pradesh, India) is used.
- Error handling for API errors and location retrieval issues.

## Installation

To install and run the app locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone "https://github.com/Sudhanshu-Ambastha/Weather-App"
   ```

2. Navigate to the project directory:
   ```
   cd weather-app
   ```

3. Install dependencies:
   ```
   npm install  
   ```

4. Create a .env file in the root directory and add your OpenWeatherMap API key:
   ```
   REACT_APP_OPENWEATHER_API_KEY=your_api_key
   ```

5. Start the development server:
   ```
   npm start    
   ```
6. Start the development server instantly with:
   ```
   cd weather-app && npm start    
   ```
##  Usage

- **Search by City:** Use the search bar to find weather data for any city.
- **Geolocation:** Click "Current Location" to fetch weather based on your current geographical coordinates.
- **Weather Data:** The app displays current weather conditions, including temperature, AQI, wind speed, UV index, and sunrise/sunset times.
- **Temperature Toggle:** Users can switch between Celsius and Fahrenheit for temperature readings.
- **Forecast:** View the 5-day forecast and hourly forecast for the current day.

## Configuration

**API Key:** To fetch weather data, you'll need an API key from [Open Weather Map API](https://openweathermap.org/api). Add it to your .env file:
- Open weather map => go to my api keys => use the available api key or create a new one

## Routing
The app uses hash-based routing to manage different views and features:

- `#/current-location`: Fetches the weather data for the user's current geolocation using the browser's geolocation API.
- `#/weather?lat=<latitude>&lon=<longitude>`: Displays weather data for a specific location based on latitude and longitude.

Routing logic is handled in `components/js/route.js`, which includes:
- Geolocation-based routing for fetching the user's current weather.
- URL-based routing to allow searching for weather data based on query parameters (latitude and longitude).
- Hash change event handling to update the view when the URL changes.
  
## Error Handling
The app includes robust error handling for both geolocation and API errors. If an error occurs, a fallback location (Ghaziabad, Uttar Pradesh, India) is used. Users can retry API requests if needed.

- **Error Handling in Geolocation:** If the user's location cannot be retrieved, the app defaults to a pre-defined location.
- **API Errors:** When API calls fail (e.g., due to a missing or invalid API key), an error message is displayed along with a retry option.
Error components are located in `components/error/Error.jsx` and styled with `error.css`.

## Dependencies
- **React:** For building the user interface.
- **OpenWeatherMap API:** Used to fetch real-time weather data, 5-day forecasts, and air quality information.
- **Postman:** For API testing and validation.

[Auto Import - ES6, TS, JSX, TSX](https://marketplace.visualstudio.com/items?itemName=NuclleaR.vscode-extension-auto-import)

[Postman DB Link](https://web.postman.co/workspace/My-Workspace~b124c25d-b089-4adf-8f43-af70c1b5b9eb/request/29725199-7607ae0d-cf27-49dc-97df-26778dab9c63)

## Live Demo
Check out the deployed model at the following link:[Weather App](https://671cfeda728879fd92d0b20a--stately-belekoy-fd3a0e.netlify.app/)
