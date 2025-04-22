// App.jsx
import React, { useEffect, useState } from "react";
import MoodForm from "./components/MoodForm/MoodForm";
import CalendarView from "./components/CalendarView/CalendarView";
import MoodGraph from "./components/MoodGraph/MoodGraph";
import AllNotes from "./components/AllNotes/AllNotes";
import { exportToCSV, exportToPDF } from "./utils/export";
import { fetchWeatherData } from "./utils/weather";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );
  const [weather, setWeather] = useState(null);
  const [moodTheme, setMoodTheme] = useState("#fff");

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  useEffect(() => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const data = await fetchWeatherData(pos.coords.latitude, pos.coords.longitude);
        setWeather(data);
      });
    }, []);
  const handleExport = (type) => {
    const data = JSON.parse(localStorage.getItem("journal") || "[]");
    if (type === "csv") exportToCSV(data);
    else exportToPDF(data);
  };

  const handleMoodTheme = (mood) => {
    const moodColors = {
      Happy: "#FFF7D6",
      Neutral: "#F0F0F0",
      Sad: "#D6E4F7",
      Angry: "#FDDCDC",
      Tired: "#E2F5F0",
    };
    setMoodTheme(moodColors[mood] || "#fff");
  };

  return (
    <div className="container" style={{ backgroundColor: moodTheme }}>
      <header className="header">
        <h1>Mood Mate</h1>
        <div>
        <span className="weather">
          {weather ? `${weather.temp}°C ${weather.icon}` : "Loading..."}
        </span>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => handleExport("csv")}>Export CSV</button>
          <button onClick={() => handleExport("pdf")}>Export PDF</button>
        </div>
      </header>
      <MoodForm setMoodTheme={handleMoodTheme} />
      
      <MoodGraph />
      
      <AllNotes />
    </div>
  );
}
