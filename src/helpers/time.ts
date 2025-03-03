const formatTime = (
  ms: number,
  maxLength: number = 999,
  short: boolean = true
): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  let result = [];
  if (days > 0) result.push(`${days}${short ? "d" : " days"}`);
  if (result.length > maxLength) return result.join(", ");

  if (remainingHours > 0)
    result.push(`${remainingHours}${short ? "h" : " hours"}`);
  if (result.length > maxLength) return result.join(", ");

  if (remainingMinutes > 0)
    result.push(`${remainingMinutes}${short ? "m" : " minutes"}`);
  if (result.length > maxLength) return result.join(", ");

  if (result.length === 0) result.push(`0${short ? "s" : " seconds"}`);
  return result.join(", ");
};

export { formatTime };
