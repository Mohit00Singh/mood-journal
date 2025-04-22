import jsPDF from "jspdf";

export const exportToCSV = (entries) => {
  const headers = ["Date", "Mood", "Note", "Weather", "Temperature"];
  const rows = entries.map(e => [
    e.date,
    e.mood,
    e.note,
    e.weather?.main || "",
    e.weather?.temp || ""
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n"); // Corrected \\n to \n

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "mood_journal.csv";
  a.click();
};

export const exportToPDF = (entries) => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  let currentYPosition = 10; // Start position for the first entry

  entries.forEach((e, i) => {
    if (currentYPosition > 270) { // If we're too far down the page, add a new one
      doc.addPage();
      currentYPosition = 10; // Reset Y position for the new page
    }

    // Add the text, adjusting for the currentYPosition
    doc.text(`Date: ${e.date}`, 10, currentYPosition);
    currentYPosition += 5;
    doc.text(`Mood: ${e.mood}`, 10, currentYPosition);
    currentYPosition += 5;
    doc.text(`Note: ${e.note}`, 10, currentYPosition);
    currentYPosition += 5;
    doc.text(`Weather: ${e.weather?.temp}°C`, 10, currentYPosition);
    currentYPosition += 10; // Add extra spacing between entries
  });

  doc.save("mood_journal.pdf");
};
