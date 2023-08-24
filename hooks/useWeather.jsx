"use client";
import { useContext } from "react";
import { WeatherContext } from "@contexts/WeatherContext";

export const useWeather = () => {
  return useContext(WeatherContext);
};
