import { escapeHtml } from './html';

/** Public landing, tagged so email-driven visits can be counted later. */
export const EMAIL_SHARE_URL = 'https://igame.lat/?ref=email-share';

export function emailShareFooterText() {
  return `\n\n同事也总忘额度重置时间？转给同事：${EMAIL_SHARE_URL}\nTeammates forget reset times too. Share with a teammate: ${EMAIL_SHARE_URL}`;
}

export function emailShareFooterHtml() {
  const href = escapeHtml(EMAIL_SHARE_URL);
  return `<div style="margin-top:20px;padding:14px 16px;background:#f6f4ef;border-left:3px solid #386b51"><p style="margin:0;color:#24231f;font-size:13px;line-height:1.7">同事也总忘额度重置时间？ <a href="${href}" style="color:#386b51;font-weight:600;text-decoration:underline">转给同事</a></p><p style="margin:6px 0 0;color:#5f5b53;font-size:13px;line-height:1.7">Teammates forget reset times too. <a href="${href}" style="color:#386b51;font-weight:600;text-decoration:underline">Share with a teammate</a></p></div>`;
}
