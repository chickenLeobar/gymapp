import { setHours, setMinutes } from 'date-fns';

export function getBase64(img: File, callback: (img: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result!.toString()));
  reader.readAsDataURL(img);
}

export const isBase64 = (str: string) => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(str);
};

export function getVideoPreviw(
  video: File,
  callback: (img: ArrayBuffer | string) => void
): void {
  const reader = new FileReader();
  reader.addEventListener('load', (e) => callback(e.target.result));
  reader.readAsDataURL(video);
}

export const mergeDatetTime = (date: Date, time: Date): Date => {
  return setMinutes(setHours(date, time.getHours()), time.getMinutes());
};

export const getTimestamp = (date: Date): number | Date | null => {
  if (!date || date === null || date === undefined) {
    return null;
  }
  try {
    const result = date.getTime();
    return result;
  } catch (error) {
    return new Date(date);
  }
};

export const isValidValue = (value: any): boolean => {
  if (value && typeof value != 'undefined' && value != null) {
    return true;
  }
  return false;
};

export const cloneArray = <T>(v: T[]): T[] => {
  return Object.assign([] as T[], v);
};
