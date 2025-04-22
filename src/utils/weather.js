export const fetchWeatherData = async (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    const temperature = data.current?.temperature_2m || null;
    const code = data.current?.weather_code || null;
  
    return {
      temp: temperature,
      icon: getWeatherEmoji(code),
    };
  };
  
  function getWeatherEmoji(code) {
    if (code === 0) return "☀️"; // Clear sky
    if (code >= 1 && code <= 3) return "🌤️"; // Partly cloudy
    if (code >= 45 && code <= 48) return "🌫️"; // Fog
    if (code >= 51 && code <= 67) return "🌦️"; // Drizzle
    if (code >= 71 && code <= 77) return "❄️"; // Snow
    if (code >= 80 && code <= 82) return "🌧️"; // Rain showers
    if (code >= 95) return "⛈️"; // Thunderstorms
    return "🌡️"; // Default
  }
  