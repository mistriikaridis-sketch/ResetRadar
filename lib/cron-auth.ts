import { Receiver } from '@upstash/qstash';

/** Bearer CRON_SECRET 或 QStash 签名，二者满足其一即可。开发环境可无密钥放行。 */
export async function authorizeCron(request: Request, rawBody?: string) {
  if (process.env.NODE_ENV !== 'production') return { ok: true as const, via: 'dev' as const };

  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get('authorization');
  if (secret && auth === `Bearer ${secret}`) return { ok: true as const, via: 'bearer' as const };

  const current = process.env.QSTASH_CURRENT_SIGNING_KEY?.trim();
  const next = process.env.QSTASH_NEXT_SIGNING_KEY?.trim();
  const signature = request.headers.get('upstash-signature');
  if (current && next && signature) {
    try {
      const receiver = new Receiver({ currentSigningKey: current, nextSigningKey: next });
      const body = rawBody ?? (await request.clone().text());
      await receiver.verify({ signature, body });
      return { ok: true as const, via: 'qstash' as const };
    } catch {
      return { ok: false as const, message: 'QStash 签名无效。' };
    }
  }

  if (!secret && !(current && next)) {
    return { ok: false as const, message: '生产环境必须配置 CRON_SECRET 或 QStash 签名密钥。' };
  }
  return { ok: false as const, message: '未授权。' };
}
