const currentDate = new Date();
const currentDate_string = currentDate.toUTCString();

const timeConverter = (date, offset, showDate = false) => {
  // takes date object
  // returns string in format hh:mm AM/PM
  // offset is in seconds, and may not be
  // an integer number of hours

  const offsetMilliseconds = offset * 1000;

  const localDate = new Date(date + offsetMilliseconds);

  const hours24 = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const minutesPadded = minutes <= 9 ? `0${minutes}` : minutes;
  const hours12 = hours24 % 12;
  const ampm = hours24 < 12 ? "AM" : "PM";

  const timeString = `${hours12}:${minutesPadded} ${ampm}`;

  if (showDate) {
    const day = localDate.getUTCDay();
    const dateNumber = localDate.getUTCDate();
    const month = localDate.getUTCMonth();
    const year = localDate.getUTCFullYear();
    const dateString = localDate.toLocaleDateString();
    return `${dateString} ${timeString}`;
  }

  return timeString;
};

console.log(timeConverter(0, 0, true));
console.log(timeConverter(0, 28800, true));
console.log(timeConverter(0, -28800, true));
console.log(timeConverter(currentDate, 0, true));
console.log(timeConverter(currentDate, 28800, true));
console.log(timeConverter(currentDate, -28800, true));
