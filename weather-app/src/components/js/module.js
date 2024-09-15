import { SunIcon, Night, Cloudy, CloudyDay, CloudyNight, Rain, ThunderStormDay, ThunderStormNight, ThunderStormRain,
  ThunderStormNightRain, ThunderStormSnow, ThunderStormNightSnow, Snow, Sleet, Tornado, Hail, Hurricane, Fog, Haze,
  Mist, Wind, Smoke, Dust, AQI, AQI2, AQI3, AQI4, AQI5, AQI6,} from '../../assets/index.js';

export const weekDayNames = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];

export const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * @param {number} dateUnix Unix date in seconds 
 * @param {number} timezone Timezone shift from UTC in seconds
 * @return {string} Date String format: "Sunday 10, Jan"
 */
export const getDate = function(dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. Format: "HH:MM AM/PM"
 */
export const getTime = function(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    // Add leading zero to minutes if necessary
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours % 12 || 12}:${formattedMinutes} ${period}`;
};


/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. Format: "HH AM/PM"
 */
export const getHours = function(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
};

/**
 * @param {number} mps Meters per second 
 * @returns {number} Kilometers per hour
 */
export const mps_to_kmh = mps => {
    return (mps * 3600) / 1000;
};

export const aqiText = {
    1: {
        aqiIcon: AQI,
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
        style: {
            backgroundColor: '#89e589',
            color: '#1f331f'
        }
    },
    2: {
        aqiIcon: AQI2,
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
        style: {
            backgroundColor: '#ffff00',
            color: '#6e5504'
        }
    },
    3: {
        aqiIcon: AQI3,
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
        style: {
            backgroundColor: '#ffa200',
            color: '#5f3d04',
            width: '74px',
        }
    },
    4: {
        aqiIcon: AQI4,
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
        style: {
            backgroundColor: '#ed6a50',
            color: '#850606'
        }
    },
    5: {
        aqiIcon: AQI5,
        level: "Inclement",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
        style: {
            backgroundColor: '#85caed',
            color: '#402bfb',
            width:'80px',
        }
    },
    6: {
        aqiIcon: AQI6,
        level: "Severe",
        message: "Health alert: everyone may experience more serious health effects. The entire population is more likely to be affected.",
        style: {
            backgroundColor: '#d685f6',
            color: '#72066d'
        }
    }
};

export const getUVIndexText = (uvIndex) => {
  if (uvIndex <= 2) {
    return { level: "Low", message: "Low risk of harm from UV rays." };
  } else if (uvIndex <= 5) {
    return { level: "Moderate", message: "Moderate risk. Wear SPF 30+." };
  } else if (uvIndex <= 7) {
    return { level: "High", message: "High risk! Protect skin." };
  } else if (uvIndex <= 10) {
    return { level: "Very High", message: "Very high risk. Seek shade." };
  } else {
    return { level: "Extreme", message: "Extreme risk! Avoid sun exposure." };
  }
};

/**
 * Function to extract the min and max temperatures for each day in the forecast.
 * @param {Array} forecastData - The array of forecast data.
 * @returns {Array} - Array of objects with day, minTemp, and maxTemp for each day.
 */

export const dailyMinMaxTemps = (forecastData) => {
  return forecastData.list.reduce((acc, curr) => {
    const date = new Date(curr.dt * 1000).toLocaleDateString('en-US');
    if (!acc[date]) {
      acc[date] = { minTemp: curr.main.temp_min, maxTemp: curr.main.temp_max };
    } else {
      acc[date].minTemp = Math.min(acc[date].minTemp, curr.main.temp_min);
      acc[date].maxTemp = Math.max(acc[date].maxTemp, curr.main.temp_max);
    }
    return acc;
  }, {});
};

export function getMinMaxTemperatures(forecastData) {
    if (!Array.isArray(forecastData)) {
        console.error("forecastData is not an array", forecastData);
        return [];
    }
  }

// export const getPollenLevelText = (pollenCount) => {
//   if (pollenCount <= 50) {
//     return { level: "Low", message: "Low pollen levels. Enjoy outdoors." };
//   } else if (pollenCount <= 100) {
//     return { level: "Moderate", message: "Moderate pollen levels." };
//   } else if (pollenCount <= 200) {
//     return { level: "High", message: "High pollen levels. Allergy risk." };
//   } else {
//     return { level: "Very High", message: "Very high pollen levels. Limit outdoor activity." };
//   }
// };


export const weatherIcons = {
  'Clear': SunIcon,                // Clear Sky (Day)
  'ClearNight': Night,             // Clear Sky (Night)
  'Clouds': Cloudy,                // Cloudy Weather
  'FewCloudsDay': CloudyDay,       // Partly Cloudy Day
  'FewCloudsNight': CloudyNight,   // Partly Cloudy Night
  'Rain': Rain,                    // Rainy Weather
  'ThunderStormDay': ThunderStormDay, // Thunderstorm (Day)
  'ThunderStormNight': ThunderStormNight, // Thunderstorm (Night)
  'ThunderStormRain': ThunderStormRain,
  'ThunderStormNightRain': ThunderStormNightRain,
  'ThunderStormSnow': ThunderStormSnow,
  'ThunderStormNightSnow': ThunderStormNightSnow,
  'Snow': Snow,                    // Snowy Weather
  'Sleet': Sleet,
  'Tornado': Tornado,              // Tornado
  'Hail': Hail,
  'Hurricane': Hurricane,
  'Fog': Fog,                      // Foggy Weather
  'Haze': Haze,
  'Mist': Mist,
  'Wind': Wind,                    // Windy Weather
  'Smoke': Smoke,                  // Smoke Conditions
  'Dust': Dust                     // Dust Conditions
};
