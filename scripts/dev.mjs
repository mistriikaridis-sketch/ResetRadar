import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
let timer;
let stopping = false;

function run(script, args) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root, stdio: 'inherit' });
    child.on('exit', code => resolve(code ?? 1));
  });
}

async function checkDueReminders() {
  try {
    const response = await fetch(`${appUrl}/api/cron/reminders`);
    if (!response.ok) return;
    const result = await response.json();
    if (result.scanned) console.log(`[reminder-worker] 检查 ${result.scanned} 条：成功 ${result.delivered}，失败 ${result.failed}`);
  } catch {
    // Next.js 还在启动时会暂时连不上；下一分钟自然重试，无需打扰开发者。
  }
}

function stop() {
  if (stopping) return;
  stopping = true;
  clearInterval(timer);
  process.exit(0);
}

if (await run(resolve(root, 'node_modules/prisma/build/index.js'), ['generate']) !== 0) process.exit(1);

const next = spawn(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'dev'], { cwd: root, stdio: 'inherit' });
next.on('exit', code => {
  clearInterval(timer);
  process.exit(code ?? 0);
});
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

// 本地开发时每分钟执行一次到点检查；页面是否打开不影响检查。
setTimeout(() => {
  checkDueReminders();
  timer = setInterval(checkDueReminders, 60_000);
}, 3_000);
