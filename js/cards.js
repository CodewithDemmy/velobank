/* ============================================
   Velobank — Cards page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initRevealToggles();
  initFreezeToggles();
  initSliders();
  initOrderCardModal();
});

/* ---------------------------------------------
   Show / hide full card details
--------------------------------------------- */
const CARD_DATA = {
  virtual: {
    full: '5312 4836 9214 7790',
    masked: '5312 48•• •••• 7790',
    cvv: '042',
  },
  debit: {
    full: '5312 4821 0094 7790',
    masked: '5312 4821 •••• 7790',
    cvv: '317',
  },
};

function initRevealToggles() {
  document.querySelectorAll('.card-manage__toggle').forEach((btn) => {
    const target = btn.dataset.revealTarget;
    const data = CARD_DATA[target];
    if (!data) return;

    let revealed = false;

    btn.addEventListener('click', () => {
      revealed = !revealed;

      const numberEl = document.getElementById(`${target}NumberMasked`);
      const cvvEl = document.getElementById(`${target}Cvv`);

      if (numberEl) numberEl.textContent = revealed ? data.full : data.masked;
      if (cvvEl) cvvEl.textContent = revealed ? data.cvv : '•••';

      btn.textContent = revealed ? 'Hide full details' : 'Show full details';
    });
  });
}

/* ---------------------------------------------
   Freeze / unfreeze cards
--------------------------------------------- */
function initFreezeToggles() {
  const map = {
    virtual: { toggle: 'virtualFreezeToggle', visual: 'virtualCardVisual' },
    debit: { toggle: 'debitFreezeToggle', visual: 'debitCardVisual' },
  };

  Object.values(map).forEach(({ toggle, visual }) => {
    const btn = document.getElementById(toggle);
    const card = document.getElementById(visual);
    if (!btn || !card) return;

    btn.addEventListener('click', () => {
      const isFrozen = card.classList.toggle('is-frozen');
      btn.setAttribute('aria-pressed', String(isFrozen));
    });
  });
}

/* ---------------------------------------------
   Spending limit sliders
--------------------------------------------- */
function initSliders() {
  const formatter = new Intl.NumberFormat('en-NG');

  [
    { input: 'virtualLimit', output: 'virtualLimitValue' },
    { input: 'debitLimit', output: 'debitLimitValue' },
  ].forEach(({ input, output }) => {
    const slider = document.getElementById(input);
    const display = document.getElementById(output);
    if (!slider || !display) return;

    const update = () => {
      display.textContent = `₦${formatter.format(Number(slider.value))} / day`;
    };

    slider.addEventListener('input', update);
    update();
  });
}

/* ---------------------------------------------
   Order a new card — modal
--------------------------------------------- */
function initOrderCardModal() {
  const openBtn = document.getElementById('orderCardBtn');
  const modal = document.getElementById('orderModal');
  const closeBtn = document.getElementById('orderModalClose');
  const form = document.getElementById('orderModalForm');
  const success = document.getElementById('orderModalSuccess');
  const successText = document.getElementById('orderSuccessText');
  const submitBtn = document.getElementById('orderModalSubmit');
  const nameInput = document.getElementById('newCardName');
  const doneBtn = document.getElementById('orderModalDone');

  if (!openBtn || !modal) return;

  function openModal() {
    form.style.display = 'block';
    success.classList.remove('is-active');
    nameInput.value = '';
    nameInput.classList.remove('is-invalid');
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
    if (!name) {
      nameInput.classList.add('is-invalid');
      nameInput.focus();
      return;
    }
    nameInput.classList.remove('is-invalid');

    successText.textContent = `"${name}" has been created and is ready to use for online payments.`;
    form.style.display = 'none';
    success.classList.add('is-active');
  });
}
