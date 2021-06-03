export const generateRandomColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
};

export const removeSpaces = (str: string) => {
  return str.replace(/\s+/g, '');
};

export const sanitizeValueString = (
  value: string
): [resp: boolean, value: string] => {
  value = value.trim();
  if (removeSpaces(value).length > 0) {
    return [true, value];
  }
  return [false, value];
};
