import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(value?: Date | null) {
  return value ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai' }).format(value) : '等待管理员确认';
}
