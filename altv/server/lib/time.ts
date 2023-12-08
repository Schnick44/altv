/**
 * Stringifies a number to have at least two digits
 * @param int A single or double-digit number to be stringified
 * @returns Stringified double digit
 */
export function stringifyDigit(int: number) {
  return int < 10 ? "0" + int : int.toString();
}

/** @returns Time string in the following format: `hh:mm:ss` */
export function getTime(date = new Date()) {
  const hours = stringifyDigit(date.getHours());
  const minutes = stringifyDigit(date.getMinutes());
  const seconds = stringifyDigit(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

/** @returns Date-Time string in the following format: `dd.mm.yyyy hh:mm:ss` */
export function getDate(date = new Date()) {
  const year = date.getFullYear();
  const month = stringifyDigit(date.getMonth() + 1);
  const day = stringifyDigit(date.getDate());
  return `${day}.${month}.${year} ${getTime(date)}`;
}
