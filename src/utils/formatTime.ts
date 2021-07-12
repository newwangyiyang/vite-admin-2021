import dayjs from 'dayjs';

export function formatDate(date: Date, template: string) {
  return dayjs(date).format(template);
}
