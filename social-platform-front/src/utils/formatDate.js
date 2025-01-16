import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = startOfDay(new Date());
  const twoDaysAgo = startOfDay(subDays(today, 2));

  if (isToday(date)) {
    return `Dzisiaj ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Wczoraj ${format(date, 'HH:mm')}`;
  }
  if (date >= twoDaysAgo) {
    return `Przedwczoraj ${format(date, 'HH:mm')}`;
  }

  return format(date, 'dd-MM-yyyy HH:mm');
};

export const formatDateWithoutTime = (dateString) => {
  const date = new Date(dateString);
  const today = startOfDay(new Date());
  const twoDaysAgo = startOfDay(subDays(today, 2));

  if (isToday(date)) {
    return `Dzisiaj`;
  }
  if (isYesterday(date)) {
    return `Wczoraj`;
  }
  if (date >= twoDaysAgo) {
    return `Przedwczoraj`;
  }

  return format(date, 'dd-MM-yyyy');
};

export const formatDateWithoutWords = (dateString) => {
  const date = new Date(dateString);

  return format(date, 'dd-MM-yyyy');
};


export const formatDateBeforeSending = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};