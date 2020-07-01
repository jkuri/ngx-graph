export const diffInMillis = (dateLeft: Date, dateRight: Date): number => {
  return dateLeft.getTime() - dateRight.getTime();
};

export const addSeconds = (date: Date, s: number): Date => {
  const timestamp = date.getTime();
  return new Date(timestamp + s * 1000);
};

export const addMilliseconds = (date: Date, ms: number): Date => {
  const timestamp = date.getTime();
  return new Date(timestamp + ms);
};

export const subMilliseconds = (date: Date, ms: number): Date => {
  return addMilliseconds(date, -ms);
};

export const isAfter = (date: Date, dateToCompare: Date): boolean => {
  return date.getTime() > dateToCompare.getTime();
};

export const isBefore = (date: Date, dateToCompare: Date): boolean => {
  return date.getTime() < dateToCompare.getTime();
};
