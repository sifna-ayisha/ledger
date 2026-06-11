export const currency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const dateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
