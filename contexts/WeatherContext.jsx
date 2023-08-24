"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Ref: https://www.pakainfo.com/get-location-name-from-latitude-and-longitude-javascript/
// Ref: https://fcc-weather-api.glitch.me/
// Ref: https://geolocation-db.com/json/

export const WeatherContext = createContext();

const WeatherContextProvider = ({ children }) => {
  // const baseURL = "https://api.bigdatacloud.net/data/reverse-geocode-client"; //more informative
  const weatherUrl = "https://fcc-weather-api.glitch.me/api/current?";

  const [location, setLocation] = useState({
    city: "",
    country: "",
    error: "",
    latitude: "",
    longitude: "",
    status: "",
    temperature: {},
    weather: {},
  });

  const success = async (position) => {
    try {
      const weatherResponse = await axios.get(
        `${weatherUrl}lat=${position.latitude}&lon=${position.longitude}`
      );

      const { main, weather } = weatherResponse.data;

      setLocation({
        city: position.city,
        country: position.country_name,
        error: "",
        latitude: position.latitude,
        longitude: position.longitude,
        status: "success",
        temperature: main,
        weather: weather.length > 0 ? weather[0] : {},
      });
    } catch (err) {
      error(err);
    }
  };

  const error = (err) => {
    setLocation({
      city: "",
      locality: "",
      country: "",
      error: err,
      latitude: "",
      longitude: "",
      status: "failure",
    });
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await axios.get(
          "https://api.bigdatacloud.net/data/reverse-geocode-client"
        );
        const position = response.data;
        success(position);
      } catch (err) {
        error(err);
      }
    };

    getLocation();
    // eslint-disable-next-line
  }, []);

  return (
    <WeatherContext.Provider value={{ location }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContextProvider;
