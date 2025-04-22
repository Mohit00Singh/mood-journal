import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./MoodGraph.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const moodToScore = {
  Happy: 5,
  Excited: 4,
  Calm: 3,
  Neutral: 2,
  Sad: 1,
  Angry: 0,
  Tired: 1,
};

const scoreToMood = {
  5: "Happy",
  4: "Excited",
  3: "Calm",
  2: "Neutral",
  1: "Sad/Tired",
  0: "Angry",
};

export default function MoodGraph({ darkMode }) {
  const [chartOptions, setChartOptions] = useState({});

  const entries = JSON.parse(localStorage.getItem("journal") || "[]");

  // Filter valid entries with weather
  const filteredEntries = entries
    .filter((e) => e.weather && e.weather.temp !== undefined && e.mood)
    .map((e) => ({
      temp: e.weather.temp,
      moodScore: moodToScore[e.mood] || 0,
    }))
    .sort((a, b) => a.temp - b.temp); // Sort by temperature

  const temps = filteredEntries.map((e) => `${e.temp}°C`);
  const moodScores = filteredEntries.map((e) => e.moodScore);

  const data = {
    labels: temps,
    datasets: [
      {
        label: "Mood Score vs Temperature",
        data: moodScores,
        fill: false,
        borderColor: "#FFA500", // Orange color
        backgroundColor: "#FFA500", // Orange color
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Update chart options based on dark mode
  useEffect(() => {
    setChartOptions({
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (value) => scoreToMood[value] || value,
            color: darkMode ? "#fff" : "#000", // Change tick color based on dark mode
          },
          title: {
            display: true,
            text: "Mood",
            color: darkMode ? "#fff" : "#000", // Change title color based on dark mode
          },
        },
        x: {
          title: {
            display: true,
            text: "Temperature (°C)",
            color: darkMode ? "#fff" : "#000", // Change title color based on dark mode
          },
          ticks: {
            color: darkMode ? "#fff" : "#000", // Change tick color based on dark mode
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const mood = scoreToMood[ctx.raw] || ctx.raw;
              return `Mood: ${mood}`;
            },
          },
          backgroundColor: darkMode ? "#fff" : "#333", // Adjust tooltip background color
          titleColor: darkMode ? "#000" : "#fff", // Tooltip title color
          bodyColor: darkMode ? "#000" : "#fff", // Tooltip body color
        },
      },
    });
  }, [darkMode]); // Recalculate options whenever darkMode changes

  return (
    <div className="mood-graph-container">
      <h2 style={{ color: darkMode ? "#fff" : "#000" }}>Weather vs Mood (Line Graph)</h2>
      <Line data={data} options={chartOptions} />
    </div>
  );
}
