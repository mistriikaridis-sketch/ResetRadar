import { prisma } from './prisma';

export const META_LAST_CRON_AT = 'lastCronAt';

export async function getAppMeta(key: string) {
  try {
    const row = await prisma.appMeta.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function setAppMeta(key: string, value: string) {
  await prisma.appMeta.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
