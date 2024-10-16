import React, { useState, useEffect, useRef } from "react";
import "./weatherapp.css";
import { Logo, SALogo, CompanyLogo, Search, CalendarIcon, LocationPin, LocateFixed, Thermometer, VisibilityOn, VisibilityOff, UVIndex, Pollen, Sunrise, Sunset, Humidity, Barometer, Loading, AQI, AQI2, AQI3, AQI4, AQI5, AQI6, Wind, Celsius, Fahrenheit } from '../../assets/index';
import { fetchData, url, setUnitChoice } from '../js/api';
import Error from '../error/Error';
import { getDate, getTime, mps_to_kmh, aqiText, weatherIcons, getUVIndexText, date, dailyMinMaxTemps, weekDayNames, tempIcon} from '../js/module'; 

const WeatherApp = () => {
  const [location, setLocation] = useState({ lat: 28.73325253343566, lon: 77.29813920631982 });
  const [airPollutionData, setAirPollutionData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('C'); 
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    const timeoutDuration = 8000;
    const timeout = setTimeout(() => {
      setLoading(false);
      if (!weatherData || !forecastData || !airPollutionData) {
        setError("Request timed out. Please try again.");
      }
    }, timeoutDuration);

    const handleDataFetch = (data, setter) => {
      if (data) {
        setter(data);
      } else {
        setError("Failed to fetch data.");
      }
      clearTimeout(timeout);
      setLoading(false);
    };

    fetchData(url.currentWeather(location.lat, location.lon), data => handleDataFetch(data, setWeatherData), setError);
    fetchData(url.forecast(location.lat, location.lon), data => handleDataFetch(data, setForecastData), setError);
    fetchData(url.airPollution(location.lat, location.lon), data => handleDataFetch(data, setAirPollutionData), setError);
  };

  useEffect(() => {
    fetchWeather();
  }, [location, isCelsius, unit]);

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    setUnitChoice(newUnit); 
    fetchData();   
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(url.geo(query), (data) => {
      if (data.length > 0) {
        setLocation({ lat: data[0].lat, lon: data[0].lon });
        setError(null);
      } else {
        setError("City not found");
      }
      setLoading(false);
    }, setError);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        setError(null);
        setLoading(false);
      }, () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      });
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const isDayTime = () => {
    const currentTime = weatherData.dt;
    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    return currentTime >= sunrise && currentTime < sunset;
  };

  const getWeatherIcon = () => {
    const mainCondition = weatherData.weather[0].main;
    if (mainCondition === "Clear") {
      return isDayTime() ? weatherIcons.Clear : weatherIcons.ClearNight;
    } else if (mainCondition === "Clouds" && weatherData.weather[0].description === "few clouds") {
      return isDayTime() ? weatherIcons.FewCloudsDay : weatherIcons.FewCloudsNight;
    } else {
      return weatherIcons[mainCondition] || weatherIcons.SunIcon; 
    }
  };

  const getAQIIcon = () => {
    const aqiValue = airPollutionData.list[0].main.aqi;
    return aqiText[aqiValue]?.aqiIcon || aqiText[1].aqiIcon; 
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${weekDayNames[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (error) {
    return <Error message={error} onRetry={() => fetchWeather()} />;
  }

  if (loading || !weatherData || !forecastData || !airPollutionData) {
    return (
      <div className="loading-container">
        <img src={Loading} alt="Loading" height={100} width={100} className="Loading" />
        <div className="loading-text">𝕷𝖔𝖆𝖉𝖎𝖓𝖌...</div>
      </div>
    );
  }

  const aqi = airPollutionData.list[0].main.aqi;

  const displayedIcon = weatherData ? tempIcon(unit) : null;
  const temperature = weatherData ? weatherData.main.temp : null;

  return (
    <div className={`container ${isDayTime() ? 'day' : 'night'} ${isCelsius ? 'metric' : 'imperial'}`}>
      <header className="header">
        <div className="logo-container">
          <img src={Logo} alt="weatherio" className="logo" />
        </div>
        <div className="search-container">
          <form onSubmit={handleSearch}>
          <button onClick={toggleUnit} className="selectorButton">
          <img src={displayedIcon} alt={unit === 'C' ? 'Celsius' : 'Fahrenheit'} height={35} width={35}/>
          </button>
            <input
              type="search"
              placeholder="Search city..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            /><button className="search-button" type="submit">
              <img src={Search} height={35} width={25} alt="Search-icon" />
          </button>
          </form>
        </div>
        <button className="location-button" onClick={handleLocation}>
          <img src={LocateFixed} alt="LocateFixed" />
          <span>Current Location</span>
        </button>
      </header>

      <main className="main-content">
  <div className="current-weather">
    <h2 className="title-2 card-title">Now</h2>
    <div className="temperature">
      {weatherData.main.temp}<sup>°{unit}</sup>
    </div>
    <img
      src={getWeatherIcon()}
      width="50"
      height="50"
      alt={weatherData.weather[0].description}
      className="weather-icon-sun"
    />
    <p className="body-3">{weatherData.weather[0].description}</p>
    <hr className="divider" />
    <div className="date">
      <img
        src={CalendarIcon}
        width="20"
        height="20"
        alt="Date"
        className="weather-icon"
      />
      {getDate(weatherData.dt, weatherData.timezone)}
    </div>
    <div className="location">
      <img
        src={LocationPin}
        width="20"
        height="20"
        alt="Location"
        className="weather-icon"
      />
      {weatherData.name}, {weatherData.sys.country}
    </div>
  </div>

  <div className="highlights">
    <h2 className="highlights-title">Today's Highlights</h2>
    <div className="highlights-container1">
      <div className="highlight">
        <div className="highlight-title">Air Quality Index</div>
        <div className="content">
          <img src={getAQIIcon()} width="50" height="50" alt="AQI" className="AQI-icon" />
          <div className="list">
            <div className="highlight-title">
              PM<sub>2.5</sub>
            </div>
            <div className="highlight-value">{airPollutionData.list[0].components.pm2_5}</div>
          </div>
          <div className="list">
            <div className="highlight-title">SO2</div>
            <div className="highlight-value">{airPollutionData.list[0].components.so2}</div>
          </div>
          <div className="list">
            <div className="highlight-title">NO2</div>
            <div className="highlight-value">{airPollutionData.list[0].components.no2}</div>
          </div>
          <div className="list">
            <div className="highlight-title">O3</div>
            <div className="highlight-value">{airPollutionData.list[0].components.o3}</div>
          </div>
          <div className="highlight-status" style={aqiText[airPollutionData.list[0].main.aqi]?.style}>
            {aqiText[airPollutionData.list[0].main.aqi]?.level || "Unknown"}
          </div>
        </div>
      </div>
      <br />
      <div className="highlight2">
        <div className="container1">
          <div className="content">
            <img src={UVIndex} width="50" height="50" alt="UV Index" className="weather-icon"/>
            <div className="highlight-value">{getUVIndexText(weatherData.uvi).level}</div>
            <div className="highlight-status">UVIndex</div>
          </div>
        </div>
        <div className="container1">
          <div className="content">
            <img src={Pollen} width="50" height="50" alt="Pollen" className="weather-icon"/>
            <div className="highlight-value">low</div>
            <div className="highlight-status">Pollen</div>
          </div>
        </div>
        <div className="container1">
          <div className="content">
            <img src={Sunrise} width="50" height="50" alt="Sunrise" className="weather-icon"/>
            <div className="highlight-title">Sunrise</div>
            <div className="highlight-value">{getTime(weatherData.sys.sunrise, weatherData.timezone)}</div>
          </div>
        </div>
        <div className="container1">
          <div className="content">
            <img
              src={Sunset}
              width="50"
              height="50"
              alt="Sunset"
              className="weather-icon"
            />
            <div className="highlight-title">Sunset</div>
            <div className="highlight-value">{getTime(weatherData.sys.sunset, weatherData.timezone)}</div>
          </div>
        </div>
      </div>
    </div>

    <div className="highlights-container3">
      <div className="highlight1">
        <div className="highlight-title">Humidity</div>
        <img
          src={Humidity}
          width="50"
          height="50"
          alt="Humidity"
          className="weather-icon"
        />
        <div className="highlight-value">{weatherData.main.humidity}%</div>
      </div>
      <br />
      <div className="highlight1">
        <div className="highlight-title">Atmospheric</div>
        <div className="highlight-title">Pressure</div>
        <img
          src={Barometer}
          width="50"
          height="50"
          alt="Pressure"
          className="weather-icon"
        />
        <div className="highlight-value">{weatherData.main.pressure} hPa</div>
      </div>
      <br />
      <div className="highlight1">
        <div className="highlight-title">Visibility</div>
        <img
          src={weatherData.visibility / 1000 < 2 ? VisibilityOff : VisibilityOn}
          width="50"
          height="50"
          alt="Visibility"
          className="weather-icon"
        />
        <div className="highlight-value">{(weatherData.visibility / 1000).toFixed(2)} km</div>
      </div>
      <br />
      <div className="highlight1">
        <div className="highlight-title">Feels Like</div>
        <img src={Thermometer} width="50" height="50" alt="Feels Like" className="weather-icon"/>
        <div className="highlight-value">{weatherData.main.feels_like}°{unit}</div>
      </div>
    </div>
  </div>

  {/* Forecast Section */}
  <div className="forecast">
          <h2 className="forecast-title">5 Days Forecast</h2>
          <div className="forecast-grid">
            {forecastData.list.filter((item, index) => index % 8 === 0).map((dayData, index) => (
              <div key={index} className="forecast-item">
                <h3>{formatDay(dayData.dt)}</h3>
                <img src={weatherIcons[dayData.weather[0].main] || weatherIcons.SunIcon} width="50" height="50" alt={dayData.weather[0].description} className="forecast-weather-icon" />
                <p>{Math.round(dayData.main.temp_min)}°{unit}</p>
                <p>{Math.round(dayData.main.temp_max)}°{unit}</p>
              </div>
            ))}
          </div>
        </div> 

  <div className="hourly-forecast">
    <h2 className="hourly-forecast-title">Today's Weather</h2>
    <div className="hourly-forecast-grid">
      {forecastData.list.slice(0, 8).map((item, index) => (
        <div className="hourly-forecast-item" key={index}>
          <div className="hour">{getTime(item.dt, weatherData.timezone).slice(0, -3)}</div>
          <img
            src={weatherIcons[item.weather[0].main] || weatherIcons.SunIcon}
            width="50"
            height="50"
            alt={item.weather[0].description}
            className="weather-icon"
          />
          <div className="hour-temp">{Math.round(item.main.temp)}°{unit}</div>
        </div>
      ))}
    </div>
    <br />
    <br />
    <div className="hourly-forecast-grid">
      {forecastData.list.slice(0, 8).map((item, index) => (
        <div className="hourly-forecast-item" key={index}>
          <div className="hour">{getTime(item.dt, weatherData.timezone).slice(0, -3)}</div>
          <img
            src={Wind}
            width="50"
            height="50"
            alt="Wind"
            className="weather-icon"
          />
          <div className="hour-temp">{mps_to_kmh(item.wind.speed).toFixed(2)} km/h</div>
        </div>
      ))}
    </div>
  </div>
</main>
    
      <footer className="footer">
      <div className="col1">
        <img src={SALogo} loading="lazy" alt="Logo" className="SALogo" />
        <p>&copy; 2024 Sudhanshu Ambastha. All Rights Reserved.</p>
      </div>
      <div className="col2">
        <p>Powered By{" "} 
          <a href="https://jopenweathermap.org.api" title="Free Openweather Api" target="_blank" rel="noopener" className="inline-block">
            <img src={CompanyLogo} width="150" height="30" loading="lazy" alt="OpenWeather Logo" className="inline-block"/>
          </a>
        </p>
      </div>
    </footer>
    </div>
  );
};

export default WeatherApp;
