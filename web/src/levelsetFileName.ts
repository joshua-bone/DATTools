function padTwoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

export function createNewLevelsetFileName(now: Date = new Date()): string {
  const year = padTwoDigits(now.getFullYear() % 100);
  const month = padTwoDigits(now.getMonth() + 1);
  const day = padTwoDigits(now.getDate());
  const hour = padTwoDigits(now.getHours());
  const minute = padTwoDigits(now.getMinutes());

  return `NewLevelset${year}-${month}-${day}-${hour}-${minute}.dat`;
}
