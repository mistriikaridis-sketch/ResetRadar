import { z } from 'zod';
import { EventModel, EventStatus, Confidence } from '@prisma/client';

export const emailSchema = z.string().trim().toLowerCase().email('请填写有效邮箱。');

export const personalReminderBodySchema = z.object({
  email: emailSchema,
  model: z.nativeEnum(EventModel),
  expectedAt: z.string().min(1),
  advanceMinutes: z.coerce.number().refine((n) => [0, 15, 30, 60].includes(n), '提醒时间不正确。'),
});

export const subscribeBodySchema = z.object({
  email: emailSchema,
  telegramChatId: z.string().trim().max(64).optional().default(''),
  barkKey: z.string().trim().max(128).optional().default(''),
  wecomWebhook: z.string().trim().max(512).optional().default(''),
});

export const manageLinkBodySchema = z.object({
  email: emailSchema,
});

export const cancelReminderBodySchema = z.object({
  id: z.string().min(1),
  token: z.string().min(1),
});

export const checkoutBodySchema = z.object({
  email: emailSchema,
});

export const adminEventBodySchema = z.object({
  model: z.nativeEnum(EventModel),
  status: z.nativeEnum(EventStatus),
  confidence: z.nativeEnum(Confidence).optional(),
  announcedAt: z.string().optional().nullable(),
  expectedAt: z.string().optional().nullable(),
  confirmedAt: z.string().optional().nullable(),
  sourceUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  note: z.string().max(2000).optional().nullable(),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message || '请求参数不正确。';
}
