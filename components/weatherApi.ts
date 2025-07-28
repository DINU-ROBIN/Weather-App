// Weather_App/components/weatherApi.ts

const API_KEY = '';

export async function fetchCurrentWeather(city: string) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error('City not found');
  return response.json();
}

export async function fetchForecast(city: string) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error('City not found');
  return response.json();
}


export async function fetchCitySuggestions(query: string) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Error fetching city suggestions');
  return response.json();
}
