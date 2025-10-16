import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return format(dateObj, "HH:mm");
  } else if (isYesterday(dateObj)) {
    return "yesterday";
  } else {
    const daysDiff = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } else {
      return format(dateObj, "MMM d, yyyy");
    }
  }
}

export function formatFullDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMMM d, yyyy 'at' HH:mm");
}