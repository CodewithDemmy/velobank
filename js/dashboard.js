/* ============================================
   Velobank — Dashboard
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  setDashDate();
  initSidebarToggle();
  animateBalance();
  renderTransactions();
  renderSpending();
  animateSavings();
  initFreezeToggle();
  initActionModal();
});

/* ---------------------------------------------
   Date in the top bar
--------------------------------------------- */
function setDashDate() {
  const el = document.getElementById('dashDate');
  if (!el) return;

  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('en-GB', options);
}

/* ---------------------------------------------
   Mobile sidebar toggle
--------------------------------------------- */
function initSidebarToggle() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close sidebar after tapping a nav link on mobile
  sidebar.querySelectorAll('.dash__nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------
   Animated balance counter
--------------------------------------------- */
function animateBalance() {
  const el = document.getElementById('balanceAmount');
  if (!el) return;

  const target = parseFloat(el.dataset.target);
  const duration = 1200;
  const start = performance.now();
  const formatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatter.format(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatter.format(target);
    }
  }

  requestAnimationFrame(tick);
}

/* ---------------------------------------------
   Recent transactions
--------------------------------------------- */
function renderTransactions() {
  const list = document.getElementById('txList');
  if (!list) return;

  const transactions = [
    { name: 'Salary — Brightway Tech', meta: 'Today · 9:14 AM', amount: 320000, type: 'in', icon: '💼' },
    { name: 'Transfer to Chidi Okafor', meta: 'Today · 8:02 AM', amount: -15000, type: 'out', icon: '↗' },
    { name: 'Netflix subscription', meta: 'Yesterday · 6:45 PM', amount: -4400, type: 'out', icon: '🎬' },
    { name: 'From Folake (Splitting rent)', meta: 'Yesterday · 2:30 PM', amount: 75000, type: 'in', icon: '🏠' },
    { name: 'PHCN — electricity bill', meta: 'Mon · 11:05 AM', amount: -12500, type: 'out', icon: '⚡' },
    { name: 'Jumia order #2291', meta: 'Sun · 4:18 PM', amount: -28300, type: 'out', icon: '🛍' },
  ];

  const formatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  list.innerHTML = transactions.map((tx) => {
    const isIn = tx.type === 'in';
    const sign = isIn ? '+' : '−';
    const amount = formatter.format(Math.abs(tx.amount));

    return `
      <li class="tx-item">
        <div class="tx-item__icon ${isIn ? '' : 'is-out'}">${tx.icon}</div>
        <div class="tx-item__info">
          <span class="tx-item__name">${tx.name}</span>
          <span class="tx-item__meta">${tx.meta}</span>
        </div>
        <span class="tx-item__amount ${isIn ? 'is-in' : 'is-out'}">${sign}₦${amount}</span>
      </li>
    `;
  }).join('');
}

/* ---------------------------------------------
   Spending breakdown
--------------------------------------------- */
function renderSpending() {
  const list = document.getElementById('spendList');
  if (!list) return;

  const categories = [
    { name: 'Bills & utilities', amount: 41200, percent: 38 },
    { name: 'Shopping', amount: 33700, percent: 31 },
    { name: 'Transport', amount: 19800, percent: 18 },
    { name: 'Subscriptions', amount: 14300, percent: 13 },
  ];

  const formatter = new Intl.NumberFormat('en-NG');

  list.innerHTML = categories.map((cat) => `
    <li class="spend-item">
      <div class="spend-item__head">
        <span>${cat.name}</span>
        <span>₦${formatter.format(cat.amount)}</span>
      </div>
      <div class="spend-item__bar">
        <div class="spend-item__fill" style="width: 0%" data-percent="${cat.percent}"></div>
      </div>
    </li>
  `).join('');

  // Animate fills in after render
  requestAnimationFrame(() => {
    list.querySelectorAll('.spend-item__fill').forEach((fill) => {
      fill.style.width = `${fill.dataset.percent}%`;
    });
  });
}

/* ---------------------------------------------
   Savings goal progress
--------------------------------------------- */
function animateSavings() {
  const current = 845000;
  const target = 1500000;
  const percent = Math.round((current / target) * 100);

  const currentEl = document.getElementById('savingsCurrent');
  const percentEl = document.getElementById('savingsPercent');
  const bar = document.getElementById('savingsProgress');

  if (currentEl) currentEl.textContent = current.toLocaleString('en-NG');
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (bar) {
    requestAnimationFrame(() => {
      bar.style.width = `${percent}%`;
    });
  }
}

/* ---------------------------------------------
   Freeze card toggle
--------------------------------------------- */
function initFreezeToggle() {
  const btn = document.getElementById('freezeBtn');
  const label = document.getElementById('freezeLabel');
  const card = document.getElementById('dashCard');
  if (!btn || !card) return;

  btn.addEventListener('click', () => {
    const isFrozen = card.classList.toggle('is-frozen');
    btn.classList.toggle('is-active', isFrozen);
    label.textContent = isFrozen ? 'Unfreeze card' : 'Freeze card';
  });
}

/* ---------------------------------------------
   Quick action modal (Send / Add money / Pay bills)
--------------------------------------------- */
function initActionModal() {
  const modal = document.getElementById('actionModal');
  const closeBtn = document.getElementById('modalClose');
  const title = document.getElementById('modalTitle');
  const sub = document.getElementById('modalSub');
  const recipientLabel = document.getElementById('modalRecipientLabel');
  const recipientInput = document.getElementById('modalRecipient');
  const amountInput = document.getElementById('modalAmount');
  const submitBtn = document.getElementById('modalSubmit');
  const form = document.getElementById('modalForm');
  const success = document.getElementById('modalSuccess');
  const successTitle = document.getElementById('modalSuccessTitle');
  const successText = document.getElementById('modalSuccessText');
  const successClose = document.getElementById('modalSuccessClose');

  if (!modal) return;

  const config = {
    send: {
      title: 'Send money',
      sub: 'Transfer to any bank account in Nigeria, instantly.',
      recipientLabel: 'Recipient account number',
      recipientPlaceholder: '0123456789',
      submitLabel: 'Send money',
      successTitle: 'Transfer sent',
      successText: (amount, recipient) => `₦${amount} has been sent to ${recipient || 'the recipient'}.`,
    },
    add: {
      title: 'Add money',
      sub: 'Fund your Velobank account from another bank.',
      recipientLabel: 'From account (your other bank)',
      recipientPlaceholder: '0123456789',
      submitLabel: 'Add money',
      successTitle: 'Money added',
      successText: (amount) => `₦${amount} has been added to your balance.`,
    },
    bills: {
      title: 'Pay bills',
      sub: 'Pay for electricity, TV, internet, and more.',
      recipientLabel: 'Biller / meter number',
      recipientPlaceholder: 'e.g. PHCN meter number',
      submitLabel: 'Pay bill',
      successTitle: 'Bill paid',
      successText: (amount, recipient) => `₦${amount} was paid to ${recipient || 'the biller'}.`,
    },
  };

  function openModal(action) {
    const cfg = config[action];
    if (!cfg) return;

    title.textContent = cfg.title;
    sub.textContent = cfg.sub;
    recipientLabel.textContent = cfg.recipientLabel;
    recipientInput.placeholder = cfg.recipientPlaceholder;
    recipientInput.value = '';
    amountInput.value = '';
    submitBtn.textContent = cfg.submitLabel;

    form.style.display = 'block';
    success.classList.remove('is-active');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.action = action;

    setTimeout(() => recipientInput.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.quick-action[data-action]').forEach((btn) => {
    const action = btn.dataset.action;
    if (action === 'freeze') return; // handled separately
    btn.addEventListener('click', () => openModal(action));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const action = modal.dataset.action;
    const cfg = config[action];
    const amountValue = parseFloat(amountInput.value);

    if (!amountValue || amountValue <= 0) {
      amountInput.classList.add('is-invalid');
      amountInput.focus();
      return;
    }
    amountInput.classList.remove('is-invalid');

    const formatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedAmount = formatter.format(amountValue);

    successTitle.textContent = cfg.successTitle;
    successText.textContent = cfg.successText(formattedAmount, recipientInput.value.trim());

    form.style.display = 'none';
    success.classList.add('is-active');
  });

  successClose.addEventListener('click', closeModal);
}
