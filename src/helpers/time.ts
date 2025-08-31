const formatTime = (
  ms: number,
  maxLength: number = 999,
  short: boolean = true,
  add_comma: boolean = true
): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  let result = [];
  if (days > 0)
    result.push(`${days}${short ? "d" : ` day${days > 1 ? "s" : ""}`}`);
  if (result.length > maxLength) return result.join(add_comma ? ", " : " ");

  if (remainingHours > 0)
    result.push(
      `${remainingHours}${
        short ? "h" : ` hour${remainingHours > 1 ? "s" : ""}`
      }`
    );
  if (result.length > maxLength) return result.join(add_comma ? ", " : " ");

  if (remainingMinutes > 0)
    result.push(
      `${remainingMinutes}${
        short ? "m" : ` minute${remainingMinutes > 1 ? "s" : ""}`
      }`
    );
  if (result.length > maxLength) return result.join(add_comma ? ", " : " ");

  if (result.length === 0)
    result.push(`0${short ? "s" : ` second${seconds === 1 ? "" : "s"}`}`);
  return result.join(add_comma ? ", " : " ");
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
