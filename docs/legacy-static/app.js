const modal = document.querySelector('#signup-modal');
const form = document.querySelector('#signup-form');
const planInput = document.querySelector('#selected-plan');
const status = document.querySelector('#form-status');
const clock = document.querySelector('#clock');
const resetDate = document.querySelector('#reset-date');

// 这是本地演示倒计时；生产版必须让用户填写或明确授权本地读取时间，别瞎编账号额度。
let target = new Date(Date.now() + 4 * 60 * 60 * 1000 + 58 * 60 * 1000 + 32 * 1000);
const renderClock = () => {
  const remaining = Math.max(0, target - Date.now());
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  clock.textContent = [h, m, s].map(value => String(value).padStart(2, '0')).join(':');
  resetDate.textContent = target.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
};
renderClock();
setInterval(renderClock, 1000);

document.querySelectorAll('[data-open-modal]').forEach(button => button.addEventListener('click', () => {
  planInput.value = button.dataset.plan || 'free';
  document.querySelector('#modal-label').textContent = planInput.value === 'pro' ? 'Radar Pro · 创始名单' : planInput.value === 'team' ? '小团队候补' : '设置免费提醒';
  status.textContent = '';
  modal.showModal();
}));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', () => modal.close()));
document.querySelector('#adjust-time').addEventListener('click', () => {
  planInput.value = 'free';
  modal.showModal();
  form.elements.resetTime.focus();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  localStorage.setItem('resetradar-lead', JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
  if (data.resetTime) {
    target = new Date(data.resetTime);
    renderClock();
  }
  status.textContent = '已保存在此设备。接入表单服务和收款链接后，即可开始收集真实候补。';
});
