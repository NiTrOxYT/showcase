export function formatDate(dateString: string | Date, locales: string = "en-US"): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
