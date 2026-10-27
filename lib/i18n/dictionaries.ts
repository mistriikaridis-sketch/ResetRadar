import type { Locale } from './config';

export type Dictionary = {
  meta: { titleDefault: string; description: string };
  nav: { history: string; rules: string; pricing: string; account: string; admin: string };
  footer: { disclaimer: string };
  locale: { switchToZh: string; switchToEn: string; label: string };
  home: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    boardKicker: string;
    boardTitle: string;
    allHistory: string;
    bullets: [string, string, string];
  };
  reminder: {
    kicker: string;
    title: string;
    body: string;
    tzNoteBefore: string;
    tzNoteLocal: string;
    tzNoteMid: string;
    tzNoteShanghai: string;
    tzNotePreview: string;
    accountLink: string;
    tzNoteAfter: string;
    tool: string;
    expectedAt: string;
    remindTime: string;
    advance0: string;
    advance15: string;
    advance30: string;
    advance60: string;
    email: string;
    emailPlaceholder: string;
    saving: string;
    save: string;
    saveFail: string;
    savedList: string;
    emptyList: string;
    statusPending: string;
    statusSent: string;
    statusFailed: string;
    statusCanceled: string;
  };
  tool: {
    titleSuffix: string;
    description: string;
    intro: string;
    record: string;
    notRecord: string;
    viewEvents: string;
    setReminder: string;
    platformRules: string;
  };
  pricing: {
    titleMeta: string;
    title: string;
    cancelNotice: string;
    free: string;
    freeF1: string;
    freeF2: string;
    setReminder: string;
    perDays: string;
    proF1: string;
    proF2: string;
    priceNote: string;
  };
  checkout: {
    stripeMissing: string;
    emailPrompt: string;
    startFail: string;
    networkFail: string;
    redirecting: string;
    pay: string;
    notReady: string;
  };
  account: {
    titleMeta: string;
    titleSuccess: string;
    titleDefault: string;
    bodySuccess: string;
    bodyDefault: string;
    backPricing: string;
    invalidLink: string;
  };
  subscribe: {
    kicker: string;
    title: string;
    body: string;
    email: string;
    telegram: string;
    telegramPlaceholder: string;
    bark: string;
    barkPlaceholder: string;
    wecom: string;
    wecomPlaceholder: string;
    submitting: string;
    save: string;
    fail: string;
  };
  manage: {
    kicker: string;
    title: string;
    body: string;
    email: string;
    generating: string;
    generate: string;
    fail: string;
    listKicker: string;
    listTitle: string;
    expected: string;
    remind: string;
    advance: string;
    cancel: string;
    empty: string;
    opFail: string;
  };
  rules: {
    titleMeta: string;
    title: string;
    intro: string;
    openTracker: string;
    points: {
      CODEX: [string, string, string];
      CLAUDE_CODE: [string, string, string];
      GROK: [string, string, string];
    };
  };
  history: {
    titleMeta: string;
    title: string;
    intro: string;
    myReminders: string;
    emptyReminders: string;
    publicEvents: string;
    statusPending: string;
    statusSent: string;
    statusFailed: string;
    expected: string;
  };
  eventTable: {
    tool: string;
    status: string;
    expectedConfirmed: string;
    confidence: string;
    source: string;
    view: string;
    noSource: string;
    empty: string;
  };
  countdown: {
    waiting: string;
    arrived: string;
    expected: string;
    status: string;
    noEvent: string;
  };
  login: {
    titleMeta: string;
    title: string;
    hint: string;
    passwordPlaceholder: string;
    submit: string;
  };
};

const zh: Dictionary = {
  meta: {
    titleDefault: 'ResetRadar｜AI 额度重置雷达',
    description: '记录 AI 编程工具额度事件，订阅经核验的提醒。非官方产品。',
  },
  nav: {
    history: '历史',
    rules: '规则说明',
    pricing: '订阅',
    account: '账户',
    admin: '管理',
  },
  footer: {
    disclaimer:
      'ResetRadar 是独立的非官方信息与提醒工具，不隶属于或获得 OpenAI、Anthropic、xAI 认可。账户额度、资格和恢复时间以对应平台页面为准。',
  },
  locale: { switchToZh: '中文', switchToEn: 'EN', label: '语言' },
  home: {
    kicker: 'RESETRADAR',
    title: 'Codex Token 重置了没？',
    subtitle: '到点提醒，忘不了！',
    cta: '设置邮箱提醒',
    boardKicker: '当前状态板',
    boardTitle: '每个倒计时都能追溯到事件。',
    allHistory: '全部历史',
    bullets: [
      '来源可见：公告 URL 与时间留下记录',
      '置信度分级：官方 / 高 / 中 / 低',
      '邮箱提醒：到点后发送核验邮件',
    ],
  },
  reminder: {
    kicker: '个人到点邮件提醒',
    title: '只有在这里保存，时间到了才会自动发邮件。',
    body: '请填你自己的账户页面显示的时间。后台“创建重置事件”的预计时间只用于网站展示，不能代替这里的个人提醒。邮件会提醒你核验，不会替你判断额度是否已恢复；线上版本约每 5 分钟检查一次。',
    tzNoteBefore: '表单按',
    tzNoteLocal: '本机时区',
    tzNoteMid: '选择时间；发信正文会按',
    tzNoteShanghai: 'Asia/Shanghai',
    tzNotePreview: ' 格式化展示。当前上海时间预览：',
    accountLink: '账户页',
    tzNoteAfter: '查看或取消提醒。',
    tool: '工具',
    expectedAt: '预计恢复时间',
    remindTime: '提醒时间',
    advance0: '正好到点',
    advance15: '提前 15 分钟',
    advance30: '提前 30 分钟',
    advance60: '提前 1 小时',
    email: '接收邮箱',
    emailPlaceholder: '能收到邮件的地址',
    saving: '保存中…',
    save: '保存个人提醒',
    saveFail: '保存失败，请稍后再试。',
    savedList: '本设备保存的提醒',
    emptyList: '保存后，提醒记录会显示在这里。',
    statusPending: '等待发送',
    statusSent: '已发送',
    statusFailed: '发送失败',
    statusCanceled: '已取消',
  },
  tool: {
    titleSuffix: '额度事件追踪',
    description: '经核验的 AI 编程工具额度事件记录与提醒说明',
    intro: '这里展示由管理员手动核验后发布的事件。个人额度和实际恢复时间始终以你的账户页面为准。',
    record: '我们记录：公告链接、观察时间、预计时间、确认时间和置信度。',
    notRecord: '我们不记录：账号、密码、Cookie、API Key；也不提供或承诺重置服务。',
    viewEvents: '查看所有事件',
    setReminder: '设置个人提醒',
    platformRules: '平台规则说明',
  },
  pricing: {
    titleMeta: '定价',
    title: '只保留两种选择。',
    cancelNotice: '已取消支付，可随时再试。',
    free: '免费',
    freeF1: '查看状态与历史',
    freeF2: '设置个人到点邮件提醒（同时仅 1 条）',
    setReminder: '设置提醒',
    perDays: '/ 30 天',
    proF1: '管理员核验事件的即时邮件 / Telegram / Bark 通知',
    proF2: '个人提醒额度更高（与免费版并存）',
    priceNote:
      '站内标价为 ¥19.9 / 30 天；实际扣款金额以 Stripe 后台 `STRIPE_PRICE_ID` 对应价格为准。请先在首页或账户页登记同一邮箱。',
  },
  checkout: {
    stripeMissing: 'Stripe 尚未配置，暂时无法在线支付。请稍后再试或联系管理员。',
    emailPrompt: '输入你已登记的邮箱，用于关联订阅：',
    startFail: '无法开始支付。',
    networkFail: '网络异常，请稍后再试。',
    redirecting: '跳转中…',
    pay: '前往 Stripe 支付',
    notReady: '支付通道未就绪',
  },
  account: {
    titleMeta: '我的订阅',
    titleSuccess: '订阅已提交。',
    titleDefault: '管理订阅与提醒方式。',
    bodySuccess:
      'Stripe Webhook 成功处理后，邮箱对应用户将切换为 Pro。可在下方登记通知通道，或生成管理链接查看个人提醒。',
    bodyDefault:
      '无需登录即可：登记通知通道，或用邮箱生成带签名的管理链接查看 / 取消个人提醒（MVP；正式环境可改为 magic link 邮件）。',
    backPricing: '返回定价页',
    invalidLink: '管理链接无效或已过期，请重新生成。',
  },
  subscribe: {
    kicker: '通知通道登记',
    title: '登记邮箱与可选推送通道',
    body: '邮箱可用于个人到点提醒。Telegram / Bark / 企微在升级 Pro 后，才会收到管理员核验事件通知。企微仅接受官方 `qyapi.weixin.qq.com` HTTPS Webhook。',
    email: '邮箱 *',
    telegram: 'Telegram Chat ID（可选）',
    telegramPlaceholder: '向 Bot 发送 /start 获取',
    bark: 'Bark Key（可选）',
    barkPlaceholder: 'Bark 推送 Key',
    wecom: '企微 Webhook（可选，计划中优先邮件）',
    wecomPlaceholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...',
    submitting: '提交中…',
    save: '保存通道',
    fail: '登记失败。',
  },
  manage: {
    kicker: '查看 / 取消提醒',
    title: '用邮箱打开管理链接',
    body: 'MVP 直接返回带签名的管理链接（24 小时有效）。正式环境可改为只发到邮箱的 magic link。',
    email: '邮箱',
    generating: '生成中…',
    generate: '生成管理链接',
    fail: '无法生成链接。',
    listKicker: 'YOUR REMINDERS',
    listTitle: '管理个人提醒',
    expected: '预计',
    remind: '提醒',
    advance: '提前',
    cancel: '取消',
    empty: '该邮箱暂无提醒记录。',
    opFail: '操作失败。',
  },
  rules: {
    titleMeta: '规则说明',
    title: '三平台规则说明',
    intro: 'ResetRadar 是非官方信息与提醒工具。以下约定适用于 Codex、Claude Code 与 Grok 相关展示与提醒能力。',
    openTracker: '打开追踪页',
    points: {
      CODEX: [
        '公共看板只展示管理员核验后的额度相关事件，不代表你的个人额度。',
        '个人到点提醒请在首页填写你账户页显示的预计恢复时间。',
        '置信度 OFFICIAL 仅用于正式公告或状态页来源。',
      ],
      CLAUDE_CODE: [
        '事件状态（监控 / 预计 / 公告 / 确认 / 恢复）由人工更新，可能滞后于平台。',
        '邮件提醒用于提示你去核验，不会替你判断额度是否已恢复。',
        'ResetRadar 不读取账号、Cookie 或 API Key。',
      ],
      GROK: [
        '不同套餐、地区与账户的恢复时间可能不同，以官方账户页为准。',
        'Pro 用户可额外接收管理员核验事件的即时通道通知。',
        '如需取消个人提醒，请打开账户页生成管理链接。',
      ],
    },
  },
  history: {
    titleMeta: '重置历史',
    title: '历史记录',
    intro: '公共事件与个人邮箱提醒分开保存。个人记录只会显示在保存它的浏览器中。',
    myReminders: '我的提醒历史',
    emptyReminders: '还没有可显示的个人提醒。保存一条邮箱提醒后，它会一直记录在这里。',
    publicEvents: '公共事件记录',
    statusPending: '等待发送',
    statusSent: '已发送',
    statusFailed: '发送失败',
    expected: '预计',
  },
  eventTable: {
    tool: '工具',
    status: '状态',
    expectedConfirmed: '预计/确认',
    confidence: '置信度',
    source: '来源',
    view: '查看',
    noSource: '未附来源',
    empty: '暂无历史事件。',
  },
  countdown: {
    waiting: '等待确认',
    arrived: '已到预计时间',
    expected: '预计：',
    status: '状态：',
    noEvent: '暂无事件',
  },
  login: {
    titleMeta: '管理员登录',
    title: '管理员登录',
    hint: '密码仅从服务端环境变量读取。',
    passwordPlaceholder: '管理员密码',
    submit: '进入后台',
  },
};

const en: Dictionary = {
  meta: {
    titleDefault: 'ResetRadar｜AI quota reset radar',
    description: 'Track verified AI coding-tool quota events and optional reminders. Unofficial.',
  },
  nav: {
    history: 'History',
    rules: 'Rules',
    pricing: 'Pricing',
    account: 'Account',
    admin: 'Admin',
  },
  footer: {
    disclaimer:
      'ResetRadar is an independent, unofficial information and reminder tool. It is not affiliated with or endorsed by OpenAI, Anthropic, or xAI. Quotas, eligibility, and restore times always follow each platform’s own pages.',
  },
  locale: { switchToZh: '中文', switchToEn: 'EN', label: 'Language' },
  home: {
    kicker: 'RESETRADAR',
    title: 'Has your Codex token reset yet?',
    subtitle: 'On-time reminders so you don’t miss it.',
    cta: 'Set email reminder',
    boardKicker: 'Live board',
    boardTitle: 'Every countdown traces back to an event.',
    allHistory: 'Full history',
    bullets: [
      'Sources visible: announcement URLs and timestamps kept on record',
      'Confidence tiers: official / high / medium / low',
      'Email reminders: verification mail after the due time',
    ],
  },
  reminder: {
    kicker: 'Personal due-time email',
    title: 'Only reminders saved here will email you when time is up.',
    body: 'Enter the time shown on your own account page. “Create reset event” times in the admin panel are for the public board only—they do not replace this personal reminder. The email asks you to verify; it does not decide whether quota has restored. Production checks about every 5 minutes.',
    tzNoteBefore: 'The form uses your',
    tzNoteLocal: 'local timezone',
    tzNoteMid: 'when picking a time; email body times are formatted in',
    tzNoteShanghai: 'Asia/Shanghai',
    tzNotePreview: '. Shanghai time preview: ',
    accountLink: 'Account',
    tzNoteAfter: 'to view or cancel reminders.',
    tool: 'Tool',
    expectedAt: 'Expected restore time',
    remindTime: 'Remind me',
    advance0: 'Exactly on time',
    advance15: '15 minutes early',
    advance30: '30 minutes early',
    advance60: '1 hour early',
    email: 'Email',
    emailPlaceholder: 'An address that can receive mail',
    saving: 'Saving…',
    save: 'Save personal reminder',
    saveFail: 'Save failed. Try again later.',
    savedList: 'Reminders on this device',
    emptyList: 'After you save, reminders show up here.',
    statusPending: 'Pending',
    statusSent: 'Sent',
    statusFailed: 'Failed',
    statusCanceled: 'Canceled',
  },
  tool: {
    titleSuffix: 'quota event tracker',
    description: 'Verified AI coding-tool quota events and reminder notes',
    intro: 'Events here are published after manual admin verification. Your personal quota and real restore time always follow your account page.',
    record: 'We record: announcement links, observation time, expected time, confirmed time, and confidence.',
    notRecord: 'We do not record accounts, passwords, cookies, or API keys—and we do not provide or promise reset services.',
    viewEvents: 'View all events',
    setReminder: 'Set a personal reminder',
    platformRules: 'Platform rules',
  },
  pricing: {
    titleMeta: 'Pricing',
    title: 'Two choices only.',
    cancelNotice: 'Checkout canceled. You can try again anytime.',
    free: 'Free',
    freeF1: 'View status and history',
    freeF2: 'One personal due-time email reminder at a time',
    setReminder: 'Set reminder',
    perDays: '/ 30 days',
    proF1: 'Instant email / Telegram / Bark for admin-verified events',
    proF2: 'Higher personal reminder quota (alongside Free)',
    priceNote:
      'Listed price is ¥19.9 / 30 days; the charged amount follows the Stripe `STRIPE_PRICE_ID`. Register the same email on the home or account page first.',
  },
  checkout: {
    stripeMissing: 'Stripe is not configured yet, so online checkout is unavailable. Try later or contact the admin.',
    emailPrompt: 'Enter the email you already registered to link the subscription:',
    startFail: 'Could not start checkout.',
    networkFail: 'Network error. Try again later.',
    redirecting: 'Redirecting…',
    pay: 'Pay with Stripe',
    notReady: 'Checkout not ready',
  },
  account: {
    titleMeta: 'My subscription',
    titleSuccess: 'Subscription submitted.',
    titleDefault: 'Manage subscription and reminder channels.',
    bodySuccess:
      'After the Stripe webhook succeeds, that email’s user becomes Pro. Register notification channels below, or generate a manage link for personal reminders.',
    bodyDefault:
      'No login required: register channels, or generate a signed manage link to view / cancel personal reminders (MVP; production can switch to magic-link email).',
    backPricing: 'Back to pricing',
    invalidLink: 'Manage link is invalid or expired. Generate a new one.',
  },
  subscribe: {
    kicker: 'Notification channels',
    title: 'Register email and optional push channels',
    body: 'Email works for personal due-time reminders. Telegram / Bark / WeCom receive admin-verified event alerts only after Pro. WeCom accepts only official `qyapi.weixin.qq.com` HTTPS webhooks.',
    email: 'Email *',
    telegram: 'Telegram Chat ID (optional)',
    telegramPlaceholder: 'Send /start to the bot to get it',
    bark: 'Bark Key (optional)',
    barkPlaceholder: 'Bark push key',
    wecom: 'WeCom webhook (optional; email first in plan)',
    wecomPlaceholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...',
    submitting: 'Saving…',
    save: 'Save channels',
    fail: 'Registration failed.',
  },
  manage: {
    kicker: 'View / cancel reminders',
    title: 'Open a manage link with your email',
    body: 'MVP returns a signed manage link (valid 24 hours). Production can switch to email-only magic links.',
    email: 'Email',
    generating: 'Generating…',
    generate: 'Generate manage link',
    fail: 'Could not generate link.',
    listKicker: 'YOUR REMINDERS',
    listTitle: 'Manage personal reminders',
    expected: 'Expected',
    remind: 'Remind',
    advance: 'early',
    cancel: 'Cancel',
    empty: 'No reminders for this email yet.',
    opFail: 'Action failed.',
  },
  rules: {
    titleMeta: 'Rules',
    title: 'Rules for three platforms',
    intro: 'ResetRadar is an unofficial information and reminder tool. These notes apply to Codex, Claude Code, and Grok displays and reminders.',
    openTracker: 'Open tracker',
    points: {
      CODEX: [
        'The public board only shows admin-verified quota-related events—not your personal quota.',
        'For personal due-time reminders, enter the expected restore time from your account page on the home form.',
        'Confidence OFFICIAL is only for formal announcements or status-page sources.',
      ],
      CLAUDE_CODE: [
        'Event status (watching / expected / announced / confirmed / restored) is updated manually and may lag the platform.',
        'Email reminders prompt you to verify; they do not decide whether quota has restored.',
        'ResetRadar does not read accounts, cookies, or API keys.',
      ],
      GROK: [
        'Restore times can differ by plan, region, and account—follow the official account page.',
        'Pro users can also get instant channel alerts for admin-verified events.',
        'To cancel a personal reminder, open Account and generate a manage link.',
      ],
    },
  },
  history: {
    titleMeta: 'Reset history',
    title: 'History',
    intro: 'Public events and personal email reminders are stored separately. Personal rows only show in the browser that saved them.',
    myReminders: 'My reminder history',
    emptyReminders: 'No personal reminders to show yet. After you save an email reminder, it stays listed here.',
    publicEvents: 'Public event log',
    statusPending: 'Pending',
    statusSent: 'Sent',
    statusFailed: 'Failed',
    expected: 'Expected',
  },
  eventTable: {
    tool: 'Tool',
    status: 'Status',
    expectedConfirmed: 'Expected / confirmed',
    confidence: 'Confidence',
    source: 'Source',
    view: 'View',
    noSource: 'No source',
    empty: 'No history events yet.',
  },
  countdown: {
    waiting: 'Awaiting confirm',
    arrived: 'Expected time reached',
    expected: 'Expected: ',
    status: 'Status: ',
    noEvent: 'No event',
  },
  login: {
    titleMeta: 'Admin login',
    title: 'Admin login',
    hint: 'Password is read only from server environment variables.',
    passwordPlaceholder: 'Admin password',
    submit: 'Enter admin',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.zh;
}
