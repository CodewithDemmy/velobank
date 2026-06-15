/* ============================================
   Velobank — Settings page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initProfileForm();
  initPasswordForm();
  initToggles();
  initDangerZone();
});

/* ---------------------------------------------
   Tab switching
--------------------------------------------- */
function initTabs() {
  const tabs = document.querySelectorAll('.settings-tab');
  const panels = document.querySelectorAll('.settings-panel');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });
}

/* ---------------------------------------------
   Profile form
--------------------------------------------- */
function initProfileForm() {
  const form = document.getElementById('profileForm');
  const note = document.getElementById('profileSaveNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showSaveNote(note, 'Saved!');
  });
}

/* ---------------------------------------------
   Password form
--------------------------------------------- */
function initPasswordForm() {
  const form = document.getElementById('passwordForm');
  const note = document.getElementById('passwordSaveNote');
  if (!form) return;

  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmNewPassword');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    if (newPassword.value.length < 8) {
      newPassword.classList.add('is-invalid');
      document.querySelector('[data-error-for="newPassword"]').classList.add('is-visible');
      valid = false;
    } else {
      newPassword.classList.remove('is-invalid');
      document.querySelector('[data-error-for="newPassword"]').classList.remove('is-visible');
    }

    if (confirmPassword.value !== newPassword.value || confirmPassword.value.length === 0) {
      confirmPassword.classList.add('is-invalid');
      document.querySelector('[data-error-for="confirmNewPassword"]').classList.add('is-visible');
      valid = false;
    } else {
      confirmPassword.classList.remove('is-invalid');
      document.querySelector('[data-error-for="confirmNewPassword"]').classList.remove('is-visible');
    }

    if (!valid) return;

    showSaveNote(note, 'Password updated!');
    form.reset();
  });
}

/* ---------------------------------------------
   Generic toggle switches (2FA, notification prefs)
--------------------------------------------- */
function initToggles() {
  document.querySelectorAll('#twoFaToggle, [data-pref]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOn = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!isOn));
    });
  });
}

/* ---------------------------------------------
   Danger zone
--------------------------------------------- */
function initDangerZone() {
  const modal = document.getElementById('dangerModal');
  const closeBtn = document.getElementById('dangerModalClose');
  const cancelBtn = document.getElementById('dangerCancel');
  const confirmBtn = document.getElementById('dangerConfirm');
  const title = document.getElementById('dangerModalTitle');
  const text = document.getElementById('dangerModalText');

  const deactivateBtn = document.getElementById('deactivateBtn');
  const closeAccountBtn = document.getElementById('closeAccountBtn');

  if (!modal) return;

  let pendingAction = null;

  function openModal(action) {
    pendingAction = action;

    if (action === 'deactivate') {
      title.textContent = 'Deactivate your account?';
      text.textContent = 'Your cards will be paused and you won\'t receive transfers until you log back in. You can reactivate anytime by logging in again.';
      confirmBtn.textContent = 'Deactivate';
    } else {
      title.textContent = 'Close your account permanently?';
      text.textContent = 'This can\'t be undone. Make sure you\'ve withdrawn your full balance before continuing.';
      confirmBtn.textContent = 'Close account';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    pendingAction = null;
  }

  deactivateBtn?.addEventListener('click', () => openModal('deactivate'));
  closeAccountBtn?.addEventListener('click', () => openModal('close'));

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  confirmBtn.addEventListener('click', () => {
    if (pendingAction === 'deactivate') {
      window.location.href = 'login.html';
    } else if (pendingAction === 'close') {
      window.location.href = 'index.html';
    }
  });
}

/* ---------------------------------------------
   Helper: show a temporary save confirmation
--------------------------------------------- */
function showSaveNote(note, message) {
  if (!note) return;
  note.textContent = message;
  note.classList.add('is-visible');

  setTimeout(() => {
    note.classList.remove('is-visible');
  }, 2500);
}
