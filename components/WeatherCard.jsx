"use client";
import { useWeather } from "@hooks/useWeather";

const WeatherCard = () => {
  const { location } = useWeather();
  return (
    // <div className="flex gap-0">
    //   {location.temperature && location.weather && (
    //     <>
    //       {location.city.length > 0 ? `${location.city} ` : ""}
    //       {location.weather ? <img src={location.weather.icon} alt="" /> : ""}
    //       <span className="md:block ps-2">
    //         {Math.ceil(location.temperature.temp)}&deg;
    //       </span>
    //     </>
    //   )}
    // </div>
    <button
      type="button"
      className="relative inline-flex items-center p-0 text-bold font-medium text-center primary-orange bg-white rounded-lg bg-transparent"
      disabled
    >
      <span className="orange_gradient gap-2">
        {Math.ceil(location.temperature.temp)}&deg;
      </span>
      <span>
        {location.weather ? <img src={location.weather.icon} alt="" /> : ""}
      </span>
      <div className="absolute inline-flex items-center justify-center w-10 h-10 text-bold text-black bg-white border-white rounded-full -top-3 right-3 bg-transparent">
        {location.city}
      </div>
    </button>
  );
};

export default WeatherCard;
