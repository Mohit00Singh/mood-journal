import React, { useState } from "react";
import "./AllNotes.css";

const moodEmojis = {
  Happy: "😊",
  Neutral: "😐",
  Sad: "😢",
  Angry: "😠",
  Tired: "😩",
};

export default function AllNotes({toggleBack}) {
    const entries = JSON.parse(localStorage.getItem("journal") || "[]").reverse();

  const [filter, setFilter] = useState("All");
  const filteredEntries = filter === "All"
    ? entries
    : entries.filter((entry) => entry.mood === filter);
  
  return (
    <div className="notes-wrapper">
      <h2 className="notes-title">All Notes</h2>
      {toggleBack && (
          <button className="back-btn" onClick={toggleBack} title="Back">
            🔙
          </button>
        )}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Happy">Happy</option>
        <option value="Neutral">Neutral</option>
        <option value="Sad">Sad</option>
        <option value="Angry">Angry</option>
        <option value="Tired">Tired</option>
    </select>

      <div className="notes-grid">
      {filteredEntries.map((entry, i) => (
        <div className="note-card" key={i}>
            <div className="emoji">{moodEmojis[entry.mood] || "📝"}</div>
            <p className="note-text">{entry.note}</p>
            <div className="note-footer">
              <span className="date">{entry.date}</span>
              <span className="weather">
                {entry.weather?.icon || "☀️"} {entry.weather?.temp}°C
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
