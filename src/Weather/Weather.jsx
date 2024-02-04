import React, { useState, useEffect } from "react";
import "./Weather.css";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CloudIcon from '@mui/icons-material/Cloud';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AirIcon from '@mui/icons-material/Air';
import WbTwilightOutlinedIcon from '@mui/icons-material/WbTwilightOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DehazeIcon from '@mui/icons-material/Dehaze';
import AcUnitIcon from '@mui/icons-material/AcUnit';
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 10);
    return maxDate.toISOString().split('T')[0];
  };

  // Debounce function to limit API requests
  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedFetchData = debounce(fetchData, 500);

  async function fetchData() {
    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=f`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3150ddf5f0mshb0a68ea71f1ee45p1cf02ajsn1f084f7d085a',
        'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setWeatherData(result);
      console.log(result);
    } catch (error) {
      console.error(error);
      setWeatherData({ message: 'Internal Server Error' });
    }
  }

  const handleInputChange = (event) => {
    setCity(event.target.value || '');
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filterForecastsByDate = () => {
    if (!weatherData || !startDate || !endDate) {
      return [];
    }

    const startTimestamp = new Date(startDate).getTime() / 1000;
    const endTimestamp = new Date(endDate).getTime() / 1000;

    return weatherData.forecasts.filter(
      (forecast) => forecast.date >= startTimestamp && forecast.date <= endTimestamp
    );
  };

  return (
    <div className="Weather">
      <div className="header">
        <span id="h1" ><b><span className="w">W</span>eatherly</b></span>
        <div>
          <input
            type="text"
            id="input"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
          />
          <input
            type="date"
            id="input"
            value={startDate}
            onChange={handleStartDateChange}
            max={getMaxDate()}
          />
          <input
            type="date"
            id="input"
            value={endDate}
            onChange={handleEndDateChange}
            max={getMaxDate()} 
          />
          <button id="search" onClick={debouncedFetchData}>Search</button>
        </div>
      </div>

      {weatherData && <div className="name">
        <div className="city">{weatherData && weatherData.location.city} </div>
        <div className="country"><span> , </span>{weatherData && weatherData.location.country}</div>
      </div>}
      {weatherData && <div className="name">
        <div className="icon">{weatherData && weatherData.current_observation.condition.text === "Sunny" ? <WbSunnyIcon /> :  (weatherData.current_observation.condition.text).includes('Cloudy')? <CloudIcon /> :  weatherData.current_observation.condition.text.includes("Riany") || weatherData.current_observation.condition.text == "Showers" || weatherData.current_observation.condition.text == "Thunderstorms"? <ThunderstormIcon /> : weatherData.current_observation.condition.text == "Haze" ? <DehazeIcon />: weatherData.current_observation.condition.text == "Snow" ? <AcUnitIcon /> : <NightsStayIcon /> } </div>
        <div className="city">{weatherData && ((weatherData.current_observation.condition.temperature -32)*5/9).toFixed(2) }<span> C</span></div>
      </div>}
      {weatherData && <div className="class">
        <div className="country">{weatherData && weatherData.current_observation.condition.text}</div>
      </div>}

      <div className="row">
        <div className="part">
            <div className="heading">SunRise</div>
            <div className="component">
                <div className="icon"><WbSunnyIcon /></div>
                <div className="value">{weatherData ? weatherData.current_observation.astronomy.sunrise : '-'}</div>
            </div>
        </div>
        <div className="part">
            <div className="heading">Sunset</div>
            <div className="component">
                <div className="icon"><WbTwilightOutlinedIcon /></div>
                <div className="value">{weatherData ? weatherData.current_observation.astronomy.sunset : '-'}</div>
            </div>
        </div>
        <div className="part">
            <div className="heading">Humidity</div>
            <div className="component">
                <div className="icon"><WaterDropOutlinedIcon /></div>
                <div className="value">{weatherData ? weatherData.current_observation.atmosphere.humidity : '-'}</div>
            </div>
        </div>
        <div className="part">
            <div className="heading">Wind</div>
            <div className="component">
                <div className="icon"><AirIcon /></div>
                <div className="value">{weatherData ? ((weatherData.current_observation.wind.chill-32)*5/9).toFixed(2) : '-'}<span>°C</span></div>
            </div>
        </div>
        <div className="part">
            <div className="heading">Pressure</div>
            <div className="component">
                <div className="icon"><CompareArrowsOutlinedIcon /></div>
                <div className="value">{weatherData ? weatherData.current_observation.atmosphere.pressure : '-'}<span>Pa</span></div>
            </div>
        </div>
      </div>

      <div className="name">Next 10 days Forecast</div>
      <div className="days">
        {weatherData && filterForecastsByDate().map((forecast, index) => (
          <div className="day" key={index}>
            <div className="nameofday">{forecast.day}</div>
            <div className="nameofday">{formatDate(forecast.date)}</div>
            <div className="values">
              <div className="high">
                <div className="name">High</div>
                <div className="component">
                  <div className="value">{weatherData ? ((forecast.high-32)*5/9).toFixed(0) : '-'}<span>°C</span></div>
                </div>
              </div>
              <div className="low">
                <div className="name">Low</div>
                <div className="component">
                  <div className="value">{weatherData ? ((forecast.low-32)*5/9).toFixed(0) : '-'}<span>°C</span></div>
                </div>
              </div>
            </div>
            <div className="name">{forecast.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
