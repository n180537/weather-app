export default function WeatherCard({ data }) {
  const { city, temp, wind } = data;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
      <h2 className="text-xl font-semibold mb-2">{city}</h2>
      <p className="text-4xl font-bold mb-2">{temp}°C</p>
      <p className="text-gray-600">💨 Wind: {wind} km/h</p>
    </div>
  );
}
