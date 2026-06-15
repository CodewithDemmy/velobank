/* ============================================
   Velobank — Beneficiaries page
   ============================================ */

let beneficiaries = [
  { id: 'b1', name: 'Chidi Okafor', bank: 'GTBank', account: '0123456789', initials: 'CO' },
  { id: 'b2', name: 'Folake Adeyemi', bank: 'Access Bank', account: '0234567891', initials: 'FA' },
  { id: 'b3', name: 'Tunde Bakare', bank: 'Zenith Bank', account: '0345678912', initials: 'TB' },
  { id: 'b4', name: 'Amaka Nwosu', bank: 'UBA', account: '0456789123', initials: 'AN' },
  { id: 'b5', name: 'Segun Olawale', bank: 'First Bank', account: '0567891234', initials: 'SO' },
];

const beneFormatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

document.addEventListener('DOMContentLoaded', () => {
  renderBeneficiaries();
  initSearch();
  initSendModal();
  initBeneModal();
});

/* ---------------------------------------------
   Render beneficiary cards
--------------------------------------------- */
function renderBeneficiaries(filter = '') {
  const grid = document.getElementById('beneGrid');
  const empty = document.getElementById('beneEmpty');
  if (!grid) return;

  const query = filter.trim().toLowerCase();
  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query) || b.bank.toLowerCase().includes(query)
  );

  empty.classList.toggle('is-visible', filtered.length === 0);

  grid.innerHTML = filtered.map((b) => `
    <div class="bene-card">
      <div class="bene-card__head">
        <div class="dash__avatar">${b.initials}</div>
        <div>
          <h3>${b.name}</h3>
          <span class="bene-card__bank">${b.bank}</span><br/>
          <span class="bene-card__account">${b.account}</span>
        </div>
      </div>
      <div class="bene-card__actions">
        <button class="btn btn--accent" data-send-id="${b.id}">Send money</button>
        <button class="bene-card__remove" data-remove-id="${b.id}" aria-label="Remove ${b.name}">🗑</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-send-id]').forEach((btn) => {
    btn.addEventListener('click', () => openSendModal(btn.dataset.sendId));
  });

  grid.querySelectorAll('[data-remove-id]').forEach((btn) => {
    btn.addEventListener('click', () => removeBeneficiary(btn.dataset.removeId));
  });
}

/* ---------------------------------------------
   Search
--------------------------------------------- */
function initSearch() {
  const input = document.getElementById('beneSearch');
  if (!input) return;
  input.addEventListener('input', () => renderBeneficiaries(input.value));
}

/* ---------------------------------------------
   Remove a beneficiary
--------------------------------------------- */
function removeBeneficiary(id) {
  beneficiaries = beneficiaries.filter((b) => b.id !== id);
  const search = document.getElementById('beneSearch');
  renderBeneficiaries(search ? search.value : '');
}

/* ---------------------------------------------
   Send money modal
--------------------------------------------- */
function initSendModal() {
  const modal = document.getElementById('sendModal');
  const closeBtn = document.getElementById('sendModalClose');
  const form = document.getElementById('sendForm');
  const success = document.getElementById('sendSuccess');
  const successText = document.getElementById('sendSuccessText');
  const amountInput = document.getElementById('sendAmount');
  const noteInput = document.getElementById('sendNote');
  const nameEl = document.getElementById('sendBeneName');
  const accountEl = document.getElementById('sendBeneAccount');
  const doneBtn = document.getElementById('sendDone');

  if (!modal) return;

  window.openSendModal = function (id) {
    const bene = beneficiaries.find((b) => b.id === id);
    if (!bene) return;

    nameEl.textContent = bene.name;
    accountEl.textContent = `${bene.bank} · ${bene.account}`;
    amountInput.value = '';
    noteInput.value = '';
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      amountInput.classList.add('is-invalid');
      amountInput.focus();
      return;
    }
    amountInput.classList.remove('is-invalid');

    successText.textContent = `₦${beneFormatter.format(amount)} was sent to ${nameEl.textContent}.`;
    form.style.display = 'none';
    success.classList.add('is-active');
  });
}

/* ---------------------------------------------
   Add beneficiary modal
--------------------------------------------- */
function initBeneModal() {
  const openBtn = document.getElementById('addBeneBtn');
  const modal = document.getElementById('beneModal');
  const closeBtn = document.getElementById('beneModalClose');
  const form = document.getElementById('beneForm');
  const success = document.getElementById('beneSuccess');
  const successText = document.getElementById('beneSuccessText');
  const nameInput = document.getElementById('beneName');
  const bankInput = document.getElementById('beneBank');
  const accountInput = document.getElementById('beneAccount');
  const submitBtn = document.getElementById('beneSubmit');
  const doneBtn = document.getElementById('beneDone');

  if (!openBtn || !modal) return;

  function clearErrors() {
    [nameInput, bankInput, accountInput].forEach((input) => {
      input.classList.remove('is-invalid');
      const err = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
      if (err) err.classList.remove('is-visible');
    });
  }

  function openModal() {
    nameInput.value = '';
    bankInput.value = '';
    accountInput.value = '';
    clearErrors();

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
    let valid = true;

    if (nameInput.value.trim().length < 2) {
      nameInput.classList.add('is-invalid');
      document.querySelector('[data-error-for="beneName"]').classList.add('is-visible');
      valid = false;
    }
    if (bankInput.value.trim().length < 2) {
      bankInput.classList.add('is-invalid');
      document.querySelector('[data-error-for="beneBank"]').classList.add('is-visible');
      valid = false;
    }
    if (!/^\d{10}$/.test(accountInput.value.trim())) {
      accountInput.classList.add('is-invalid');
      document.querySelector('[data-error-for="beneAccount"]').classList.add('is-visible');
      valid = false;
    }
    if (!valid) return;

    const name = nameInput.value.trim();
    const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

    beneficiaries.push({
      id: `b-${Date.now()}`,
      name,
      bank: bankInput.value.trim(),
      account: accountInput.value.trim(),
      initials,
    });

    const search = document.getElementById('beneSearch');
    renderBeneficiaries(search ? search.value : '');

    successText.textContent = `${name} has been added to your beneficiaries.`;
    form.style.display = 'none';
    success.classList.add('is-active');
  });
}
