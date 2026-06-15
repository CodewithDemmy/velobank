/* ============================================
   Velobank — Savings page
   ============================================ */

let goals = [
  { id: 'lagos-rent', name: 'Lagos rent', icon: '🏠', current: 845000, target: 1500000, tag: 'Target: Dec 2026' },
  { id: 'emergency', name: 'Emergency fund', icon: '🛟', current: 220000, target: 600000, tag: 'No deadline' },
  { id: 'laptop', name: 'New laptop', icon: '💻', current: 180000, target: 950000, tag: 'Target: Oct 2026' },
];

document.addEventListener('DOMContentLoaded', () => {
  renderGoals();
  updateSummary(true);
  initAddMoneyModal();
  initNewGoalModal();
});

const formatter = new Intl.NumberFormat('en-NG');
const decimalFormatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------------------------------------------
   Render goal cards
--------------------------------------------- */
function renderGoals() {
  const grid = document.getElementById('goalsGrid');
  const newGoalBtn = document.getElementById('newGoalBtn');
  if (!grid) return;

  // Remove any existing goal cards (keep the "new goal" button)
  grid.querySelectorAll('.goal-card:not(.goal-card--new)').forEach((el) => el.remove());

  goals.forEach((goal) => {
    const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);

    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <div class="goal-card__head">
        <span class="goal-card__icon">${goal.icon}</span>
        <div>
          <h3>${goal.name}</h3>
          <span class="goal-card__tag">${goal.tag}</span>
        </div>
      </div>
      <p class="savings__amount">
        ₦${formatter.format(goal.current)}
        <span class="savings__target">of ₦${formatter.format(goal.target)}</span>
      </p>
      <div class="progress">
        <div class="progress__bar" style="width: ${percent}%"></div>
      </div>
      <p class="savings__note">You're <strong>${percent}%</strong> of the way there.</p>
      <button class="btn btn--ghost" data-goal-id="${goal.id}">Add money</button>
    `;

    grid.insertBefore(card, newGoalBtn);
  });

  // Wire up "Add money" buttons
  grid.querySelectorAll('[data-goal-id]').forEach((btn) => {
    btn.addEventListener('click', () => openAddMoneyModal(btn.dataset.goalId));
  });
}

/* ---------------------------------------------
   Summary (total saved, goal count)
--------------------------------------------- */
function updateSummary(animate) {
  const total = goals.reduce((sum, g) => sum + g.current, 0);

  const totalEl = document.getElementById('totalSaved');
  const countEl = document.getElementById('goalCount');

  if (countEl) countEl.textContent = goals.length;

  if (!totalEl) return;

  if (!animate) {
    totalEl.textContent = formatter.format(total);
    return;
  }

  const duration = 1000;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    totalEl.textContent = formatter.format(Math.floor(total * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      totalEl.textContent = formatter.format(total);
    }
  }

  requestAnimationFrame(tick);
}

/* ---------------------------------------------
   Add money to a goal
--------------------------------------------- */
function initAddMoneyModal() {
  const modal = document.getElementById('addMoneyModal');
  const closeBtn = document.getElementById('addMoneyClose');
  const form = document.getElementById('addMoneyForm');
  const success = document.getElementById('addMoneySuccess');
  const successText = document.getElementById('addMoneySuccessText');
  const nameSpan = document.getElementById('addMoneyGoalName');
  const amountInput = document.getElementById('addMoneyAmount');
  const submitBtn = document.getElementById('addMoneySubmit');
  const doneBtn = document.getElementById('addMoneyDone');

  if (!modal) return;

  let activeGoalId = null;

  window.openAddMoneyModal = function (goalId) {
    activeGoalId = goalId;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    nameSpan.textContent = goal.name;
    amountInput.value = '';
    amountInput.classList.remove('is-invalid');

    form.style.display = 'block';
    success.classList.remove('is-active');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => amountInput.focus(), 50);
  };

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  doneBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  submitBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      amountInput.classList.add('is-invalid');
      amountInput.focus();
      return;
    }
    amountInput.classList.remove('is-invalid');

    const goal = goals.find((g) => g.id === activeGoalId);
    if (goal) {
      goal.current = Math.min(goal.current + amount, goal.target);
      renderGoals();
      updateSummary(false);
    }

    successText.textContent = `₦${decimalFormatter.format(amount)} was added to ${goal ? goal.name : 'your goal'}.`;
    form.style.display = 'none';
    success.classList.add('is-active');
  });
}

/* ---------------------------------------------
   Create a new goal
--------------------------------------------- */
function initNewGoalModal() {
  const openBtn = document.getElementById('newGoalBtn');
  const modal = document.getElementById('newGoalModal');
  const closeBtn = document.getElementById('newGoalClose');
  const form = document.getElementById('newGoalForm');
  const success = document.getElementById('newGoalSuccess');
  const successText = document.getElementById('newGoalSuccessText');
  const nameInput = document.getElementById('newGoalName');
  const targetInput = document.getElementById('newGoalTarget');
  const submitBtn = document.getElementById('newGoalSubmit');
  const doneBtn = document.getElementById('newGoalDone');
  const iconPicker = document.getElementById('iconPicker');

  if (!openBtn || !modal) return;

  let selectedIcon = '🎯';

  iconPicker.querySelectorAll('.icon-picker__option').forEach((btn) => {
    btn.addEventListener('click', () => {
      iconPicker.querySelectorAll('.icon-picker__option').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedIcon = btn.dataset.icon;
    });
  });

  function openModal() {
    nameInput.value = '';
    targetInput.value = '';
    nameInput.classList.remove('is-invalid');
    targetInput.classList.remove('is-invalid');
    selectedIcon = '🎯';
    iconPicker.querySelectorAll('.icon-picker__option').forEach((b, i) => b.classList.toggle('is-active', i === 0));

    form.style.display = 'block';
    success.classList.remove('is-active');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => nameInput.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  doneBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const target = parseFloat(targetInput.value);

    let valid = true;
    if (!name) {
      nameInput.classList.add('is-invalid');
      valid = false;
    } else {
      nameInput.classList.remove('is-invalid');
    }
    if (!target || target <= 0) {
      targetInput.classList.add('is-invalid');
      valid = false;
    } else {
      targetInput.classList.remove('is-invalid');
    }
    if (!valid) return;

    const newGoal = {
      id: `goal-${Date.now()}`,
      name,
      icon: selectedIcon,
      current: 0,
      target,
      tag: 'No deadline',
    };

    goals.push(newGoal);
    renderGoals();
    updateSummary(false);

    successText.textContent = `"${name}" has been added to your savings goals.`;
    form.style.display = 'none';
    success.classList.add('is-active');
  });
}
