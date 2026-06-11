import jsPDF from "jspdf";

function escapeCell(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

export function exportExcel(rows, fileName) {
  const keys = Object.keys(rows[0] || { message: "No data" });
  const header = keys.map((key) => `<th>${escapeCell(key)}</th>`).join("");
  const body = (rows.length ? rows : [{ message: "No data" }]).map((row) => `<tr>${keys.map((key) => `<td>${escapeCell(row[key])}</td>`).join("")}</tr>`).join("");
  const html = `<html><body><table>${header}${body}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportPdf(rows, fileName) {
  const doc = new jsPDF();
  doc.text(fileName, 14, 16);
  rows.slice(0, 35).forEach((row, index) => doc.text(JSON.stringify(row), 14, 28 + index * 7));
  doc.save(`${fileName}.pdf`);
}
