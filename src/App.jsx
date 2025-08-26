import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }
    if (city.length < 3) {
      setError("Invalid input, please type at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found, please check spelling");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: `${name}, ${country}`,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
      });
    } catch (err) {
      setError("Failed to fetch weather. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
        🌤 Weather App
      </h1>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          onClick={fetchWeather}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 w-full"
        >
          Get Weather
        </button>

        {loading && <p className="mt-4 text-white">Loading...</p>}
        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

        {weather && (
          <div className="mt-6 p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {weather.city}
            </h2>
            <p className="text-gray-700 mt-2">🌡 Temperature: {weather.temp}°C</p>
            <p className="text-gray-700">💨 Wind Speed: {weather.wind} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}
