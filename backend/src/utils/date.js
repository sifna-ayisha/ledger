export function dayBounds(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function rangeFromQuery(query) {
  const now = new Date();
  let start;
  const end = new Date();
  if (query.startDate && query.endDate) {
    const customEnd = new Date(query.endDate);
    customEnd.setHours(23, 59, 59, 999);
    return { start: new Date(query.startDate), end: customEnd };
  }
  switch (query.period) {
    case "daily":
      return dayBounds(now);
    case "weekly":
      start = new Date(now);
      start.setDate(now.getDate() - 6);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "monthly":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
