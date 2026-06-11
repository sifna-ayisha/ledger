export function pagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

export function dateFilter(query) {
  const filter = {};
  if (query.range && query.range !== "custom") {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    if (query.range === "yesterday") {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }
    if (query.range === "week") start.setDate(start.getDate() - start.getDay());
    if (query.range === "month") start.setDate(1);
    if (query.range === "year") {
      start.setMonth(0, 1);
      end.setMonth(11, 31);
    }
    filter.date = { $gte: start, $lte: end };
  }
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  return filter;
}
