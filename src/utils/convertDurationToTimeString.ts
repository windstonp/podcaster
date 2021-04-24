export function convertDurationToTimeString(durationTotal: number): string{
  const hours = Math.floor(durationTotal / 3600);
  const minutes = Math.floor((durationTotal % 3600)/ 60);
  const seconds = durationTotal % 60;

  const TimeString = [hours,minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');

    return TimeString
}