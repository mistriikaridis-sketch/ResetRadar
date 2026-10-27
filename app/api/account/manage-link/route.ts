import { NextResponse } from 'next/server';
import { createManageToken } from '@/lib/manage-token';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { manageLinkBodySchema, zodErrorMessage } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`manage-link:${ip}`, 20, 60 * 60 * 1000);
    if (!limited.ok) return NextResponse.json({ message: '请求过于频繁，请稍后再试。' }, { status: 429 });

    const parsed = manageLinkBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });

    const email = parsed.data.email;
    const user = await prisma.user.findUnique({ where: { email } });
    // 避免枚举邮箱：统一文案；仅当用户存在时返回 token URL（MVP，生产可改为只发邮件）
    if (!user) {
      return NextResponse.json({
        message: '若该邮箱有登记记录，可使用管理链接查看或取消提醒。当前未找到记录，请先在首页创建提醒或在本页登记通道。',
      });
    }

    const token = createManageToken(email);
    if (!token) {
      return NextResponse.json({ message: '服务端未配置 SESSION_SECRET / ADMIN_PASSWORD，无法签发管理链接。' }, { status: 503 });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${base}/account?token=${encodeURIComponent(token)}`;
    return NextResponse.json({
      message: '管理链接已生成（24 小时有效）。正式环境建议改为邮件发送该链接。',
      url,
    });
  } catch {
    return NextResponse.json({ message: '无法生成管理链接。' }, { status: 400 });
  }
}
