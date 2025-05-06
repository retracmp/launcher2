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

export { formatTime };
