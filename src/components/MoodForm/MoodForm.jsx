import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../../utils/weather";
import "./MoodForm.css";
import CalendarView from "../CalendarView/CalendarView";

const moods = [
  { label: "Happy", icon: "😊" },
  { label: "Neutral", icon: "😐" },
  { label: "Sad", icon: "😢" },
  { label: "Angry", icon: "😠" },
  { label: "Tired", icon: "😩" },
];

const moodBackgrounds = {
  Happy: "#FFF7D6",
  Neutral: "#F0F0F0",
  Sad: "#D6E4F7",
  Angry: "#FDDCDC",
  Tired: "#E2F5F0",
};

export default function MoodForm({ setMoodTheme, toggleNotes }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [weather, setWeather] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const containerStyle = {
    backgroundColor: moodBackgrounds[selectedMood] || "#fff",
    color: !isDarkMode ? "#fff" : "#000", // text color for dark mode
  };

  useEffect(() => {
    // Detect dark mode preference from the user's system
    const userPrefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(userPrefersDarkMode);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const data = await fetchWeatherData(pos.coords.latitude, pos.coords.longitude);
      setWeather(data);
    });
  }, []);

  useEffect(() => {
    if (setMoodTheme && selectedMood) {
      setMoodTheme(moodBackgrounds[selectedMood]);
    }
  }, [selectedMood]);

  const handleSave = () => {
    if (!selectedMood || !note) {
      alert("Please select a mood and write a note.");
      
      return;
    }

    const newEntry = {
      date,
      mood: selectedMood,
      note,
      weather,
    };

    const journal = JSON.parse(localStorage.getItem("journal") || "[]");
    journal.push(newEntry);
    localStorage.setItem("journal", JSON.stringify(journal));

    setSelectedMood(null);
    setNote("");
    alert("Mood saved successfully!");
  };

  return (
    <div className={`mood-form-container ${isDarkMode ? "dark-mode" : ""}`} style={containerStyle}>
      <div className="mood-container">
        <div className="mood-header">
          <h2 className="date">{date}</h2>
        </div>

        <p className="prompt">How are you feeling today?</p>

        <div className="mood-icons">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className={`mood-btn ${selectedMood === mood.label ? "selected" : ""}`}
              onClick={() => {
                setSelectedMood(mood.label);
              }}
            >
              {mood.icon}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
      <CalendarView className="calendar-container" />
    </div>
  );
}
