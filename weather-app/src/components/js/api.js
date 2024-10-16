const api_key = process.env.REACT_APP_OPENWEATHER_API_KEY;
console.log(`API Key: ${api_key}`);

if (!api_key) {
    console.error('API Key is not defined or found OR expired. Please check your .env file.');
}
/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {Function} callback Callback function to handle the response data
 * @param {Function} [onError] Optional callback to handle errors
 */
export const fetchData = async function(URL, callback, onError) {
    try {
        if (!api_key) throw new Error('API key is missing or expired.');
        
        const urlWithApiKey = `${URL}&appid=${api_key}`;
        console.log(`Fetching from: ${urlWithApiKey}`); // Log the URL with the API key
        const response = await fetch(urlWithApiKey);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        callback(data);
    } catch (error) {
        if (onError) {
            onError(error.message);
        } else {
            console.error(error);
        }
    }
};

// Define the URL functions with the API key appended
let unitChoice = 'metric'; // Default to Celsius; change this based on user selection ('metric' for Celsius, 'imperial' for Fahrenheit)

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unitChoice}`;
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unitChoice}`;
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
    },
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    }
};

// Function to toggle between Celsius and Fahrenheit
export const setUnitChoice = (unit) => {
    unitChoice = (unit === 'C') ? 'metric' : 'imperial';
};
