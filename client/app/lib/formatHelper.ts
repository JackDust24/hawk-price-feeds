export const convertDateToTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const convertTimestampToDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};
