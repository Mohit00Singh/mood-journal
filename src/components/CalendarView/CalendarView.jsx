import React, { useState } from "react";
import { FaFilter } from "react-icons/fa"; // For filter icon
import "./CalendarView.css";

const moodColors = {
  Happy: "#FEC84B",
  Neutral: "#A3A3A3",
  Sad: "#60A5FA",
  Angry: "#F87171",
  Tired: "#34D399",
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarView() {
  const entries = JSON.parse(localStorage.getItem("journal") || "[]");

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [showMonthFilter, setShowMonthFilter] = useState(false);

  const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), month, 1).getDay(); // 0 = Sunday

  const getDot = (dateStr) => {
    const entry = entries.find((e) => e.date === dateStr);
    if (!entry) return null;
    return (
      <span
        className="dot"
        style={{ backgroundColor: moodColors[entry.mood] }}
        title={entry.mood}
      ></span>
    );
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
    setShowMonthFilter(false); // Close filter after selection
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="month-display">
          <span>{monthNames[month]}</span>
        </div>
        <div className="filter-icon">
          <FaFilter />
        </div>
      </div>

      {/* Month Dropdown */}
      {showMonthFilter && (
        <div className="month-filter">
          <select value={month} onChange={handleMonthChange}>
            {monthNames.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div className="calendar-day day-header" key={d}>{d}</div>
        ))}

        {/* Empty cells before 1st */}
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div className="calendar-day empty" key={`empty-${idx}`}></div>
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const formatted = `${month + 1}/${day}/${today.getFullYear()}`; // e.g. 4/22/2025
          return (
            <div className="calendar-day" key={day}>
              {day}
              {getDot(formatted)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
