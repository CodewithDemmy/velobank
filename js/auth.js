/* ============================================
   Velobank — Auth pages (signup / login)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  prefillPhoneFromQuery();
  initPasswordToggles();
  initSignupForm();
  initLoginForm();
});

/* ---------------------------------------------
   Prefill phone number if coming from the
   landing page's "Get started" form
--------------------------------------------- */
function prefillPhoneFromQuery() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;

  const params = new URLSearchParams(window.location.search);
  const phone = params.get('phone');
  if (phone) {
    phoneInput.value = phone;
  }
}

/* ---------------------------------------------
   Show / hide password
--------------------------------------------- */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-for');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? 'Hide' : 'Show';
    });
  });
}

/* ---------------------------------------------
   Shared field-level error helpers
--------------------------------------------- */
function showError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  const error = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
  if (error) {
    if (message) error.textContent = message;
    error.classList.add('is-visible');
  }
}

function clearError(input) {
  input.classList.remove('is-invalid');
  const error = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
  if (error) error.classList.remove('is-visible');
}

function markValid(input) {
  clearError(input);
  input.classList.add('is-valid');
}

/* ---------------------------------------------
   Signup form — multi-step
--------------------------------------------- */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const stepperItems = document.querySelectorAll('#stepper .stepper__step');
  const success = document.getElementById('authSuccess');
  const switchLink = document.getElementById('switchLink');

  function goToStep(stepNumber) {
    steps.forEach((step) => {
      step.classList.toggle('is-active', step.dataset.step === String(stepNumber));
    });

    stepperItems.forEach((item) => {
      const itemStep = parseInt(item.dataset.step, 10);
      item.classList.remove('is-active', 'is-complete');
      if (itemStep === stepNumber) item.classList.add('is-active');
      if (itemStep < stepNumber) item.classList.add('is-complete');
    });

    // Move focus to the first field of the new step for accessibility
    const firstField = form.querySelector(`.form-step[data-step="${stepNumber}"] .form-control`);
    if (firstField) firstField.focus({ preventScroll: true });

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- Step 1 validation: name, phone, email ---- */
  function validateStep1() {
    let valid = true;

    const fullName = document.getElementById('fullName');
    if (fullName.value.trim().length < 3) {
      showError(fullName);
      valid = false;
    } else {
      markValid(fullName);
    }

    const phone = document.getElementById('phone');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      showError(phone);
      valid = false;
    } else {
      markValid(phone);
    }

    const email = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email);
      valid = false;
    } else {
      markValid(email);
    }

    return valid;
  }

  /* ---- Step 2 validation: password + confirm ---- */
  function validateStep2() {
    let valid = true;

    const password = document.getElementById('password');
    if (password.value.length < 8) {
      showError(password);
      valid = false;
    } else {
      markValid(password);
    }

    const confirm = document.getElementById('confirmPassword');
    if (confirm.value !== password.value || confirm.value.length === 0) {
      showError(confirm);
      valid = false;
    } else {
      markValid(confirm);
    }

    return valid;
  }

  /* ---- Step 3 validation: NIN/BVN, selfie, terms ---- */
  function validateStep3() {
    let valid = true;

    const nin = document.getElementById('nin');
    if (!/^\d{11}$/.test(nin.value.trim())) {
      showError(nin);
      valid = false;
    } else {
      markValid(nin);
    }

    const selfieInput = document.getElementById('selfie');
    const uploadBox = document.getElementById('uploadBox');
    if (!selfieInput.files || selfieInput.files.length === 0) {
      showError(selfieInput);
      uploadBox.classList.add('is-invalid');
      valid = false;
    } else {
      clearError(selfieInput);
      uploadBox.classList.remove('is-invalid');
    }

    const terms = document.getElementById('terms');
    const termsError = document.querySelector('.field-error[data-error-for="terms"]');
    if (!terms.checked) {
      if (termsError) termsError.classList.add('is-visible');
      valid = false;
    } else {
      if (termsError) termsError.classList.remove('is-visible');
    }

    return valid;
  }

  /* ---- Wire up Continue / Back buttons ---- */
  form.querySelectorAll('.step-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = btn.closest('.form-step').dataset.step;
      let valid = true;

      if (current === '1') valid = validateStep1();
      if (current === '2') valid = validateStep2();

      if (valid) {
        goToStep(parseInt(btn.dataset.next, 10));
      }
    });
  });

  form.querySelectorAll('.step-back').forEach((btn) => {
    btn.addEventListener('click', () => {
      goToStep(parseInt(btn.dataset.back, 10));
    });
  });

  /* ---- Live password strength meter ---- */
  const passwordInput = document.getElementById('password');
  const strengthBars = document.querySelectorAll('#strengthMeter .strength__bar');
  const strengthLabel = document.getElementById('strengthLabel');

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const value = passwordInput.value;
      let score = 0;

      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;

      const levels = ['', 'is-weak', 'is-fair', 'is-strong'];
      const labels = [
        'Use 8+ characters with a number and a symbol.',
        'Weak — try adding a number and a symbol.',
        'Fair — add a symbol for a stronger password.',
        'Strong password.'
      ];

      strengthBars.forEach((bar, i) => {
        bar.className = 'strength__bar';
        if (value.length === 0) return;
        if (i < score || (score === 0 && i === 0)) {
          bar.classList.add(levels[Math.max(score, 1)]);
        }
      });

      strengthLabel.textContent = value.length === 0
        ? 'Use 8+ characters with a number and a symbol.'
        : labels[score];
    });
  }

  /* ---- Selfie upload box ---- */
  const uploadBox = document.getElementById('uploadBox');
  const uploadInput = document.getElementById('selfie');
  const uploadFilename = document.getElementById('uploadFilename');

  if (uploadBox && uploadInput) {
    uploadInput.addEventListener('change', () => {
      if (uploadInput.files && uploadInput.files.length > 0) {
        uploadBox.classList.add('has-file');
        uploadBox.classList.remove('is-invalid');
        uploadFilename.textContent = uploadInput.files[0].name;
        clearError(uploadInput);
      } else {
        uploadBox.classList.remove('has-file');
      }
    });

    ['dragover', 'dragleave', 'drop'].forEach((eventName) => {
      uploadBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        if (eventName === 'dragover') uploadBox.classList.add('is-dragover');
        if (eventName === 'dragleave') uploadBox.classList.remove('is-dragover');
        if (eventName === 'drop') {
          uploadBox.classList.remove('is-dragover');
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadInput.files = e.dataTransfer.files;
            uploadInput.dispatchEvent(new Event('change'));
          }
        }
      });
    });
  }

  /* ---- Final submit ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    const fullName = document.getElementById('fullName').value.trim();
    const firstName = fullName.split(' ')[0] || 'friend';

    document.getElementById('successName').textContent = firstName;

    form.style.display = 'none';
    document.getElementById('stepper').style.display = 'none';
    if (switchLink) switchLink.style.display = 'none';
    success.classList.add('is-active');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1800);
  });
}

/* ---------------------------------------------
   Login form
--------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const success = document.getElementById('loginSuccess');
  const note = document.getElementById('loginNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    const loginId = document.getElementById('loginId');
    if (loginId.value.trim().length < 3) {
      showError(loginId);
      valid = false;
    } else {
      markValid(loginId);
    }

    const password = document.getElementById('loginPassword');
    if (password.value.length === 0) {
      showError(password);
      valid = false;
    } else {
      markValid(password);
    }

    if (!valid) return;

    form.style.display = 'none';
    if (note) note.style.display = 'none';
    success.classList.add('is-active');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1400);
  });
}
