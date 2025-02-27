const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  let result = [];
  if (years > 0) result.push(`${years}y`);
  if (months > 0) result.push(`${months}mo`);
  if (weeks > 0) result.push(`${weeks}w`);
  if (days > 0) result.push(`${days}d`);
  if (remainingHours > 0) result.push(`${remainingHours}h`);
  if (remainingMinutes > 0) result.push(`${remainingMinutes}m`);
  if (result.length === 0) result.push("0s");

  return result.join(", ");
};

export { formatTime };
