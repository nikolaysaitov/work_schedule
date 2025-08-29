export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDuration = (start: string, end: string): string => {
  const startDate = new Date(start) as Date;
  const endDate = new Date(end) as Date;
  const durationMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}ч ${minutes}м`;
};

export const getPositionInDay = (timeString: string, dayStart: string): number => {
  const time = new Date(timeString) as Date;
  const startOfDay = new Date(dayStart) as Date;
  const hours = (time.getTime() - startOfDay.getTime()) / (1000 * 60 * 60);
  return (hours / 24) * 100;
};

export const isWithinFourDays = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 4;
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
