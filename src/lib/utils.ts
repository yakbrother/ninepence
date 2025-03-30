// Simple utility to join class names
export function joinClasses(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}
