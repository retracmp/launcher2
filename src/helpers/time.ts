const formatTime = (
  ms: number,
  maxLength: number = 999,
  short: boolean = true,
  add_comma: boolean = true
): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const remainingSeconds = totalSeconds % 60;
  const remainingMinutes = totalMinutes % 60;
  const remainingHours = totalHours % 24;

  let result = [];
  
  // Show the most significant unit first
  if (totalDays > 0) {
    result.push(`${totalDays}${short ? "d" : ` day${totalDays > 1 ? "s" : ""}`}`);
  }
  if (result.length >= maxLength) return result.join(add_comma ? ", " : " ");

  if (totalHours > 0) {
    result.push(
      `${remainingHours}${
        short ? "h" : ` hour${remainingHours > 1 ? "s" : ""}`
      }`
    );
  }
  if (result.length >= maxLength) return result.join(add_comma ? ", " : " ");

  if (totalMinutes > 0) {
    result.push(
      `${remainingMinutes}${
        short ? "m" : ` minute${remainingMinutes > 1 ? "s" : ""}`
      }`
    );
  }
  if (result.length >= maxLength) return result.join(add_comma ? ", " : " ");

  // Always show seconds when less than 1 minute, or as additional detail if maxLength allows
  if (totalMinutes === 0) {
    // Show total seconds when less than 1 minute
    result.push(
      `${totalSeconds}${short ? "s" : ` second${totalSeconds === 1 ? "" : "s"}`}`
    );
  } else if (result.length < maxLength && remainingSeconds > 0) {
    // Show remaining seconds as additional detail if space allows
    result.push(
      `${remainingSeconds}${short ? "s" : ` second${remainingSeconds === 1 ? "" : "s"}`}`
    );
  }

  return result.length > 0 ? result.join(add_comma ? ", " : " ") : `0${short ? "s" : " seconds"}`;
};

const msUntil = (utc: string) => {
  const end =
    new Date(utc).getTime() +
    new Date(new Date(utc)).getTimezoneOffset() * 60 * 1000 -
    60 * 60 * 1000;
  return end - (new Date() as any as number);
};

const msUntilDate = (date: Date) => {
  return date.getTime() - (new Date() as any as number);
};

const renderTimeUntil = (ms: number) => {
  if (ms <= 0) return "0m";

  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);

  return parts.join(", ");
};

export { formatTime, msUntil, renderTimeUntil, msUntilDate };
