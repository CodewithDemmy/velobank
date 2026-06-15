/* ============================================
   Velobank — Contact page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

/* ---------------------------------------------
   Contact form validation + success state
--------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!form || !success) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const successName = document.getElementById('contactSuccessName');
  const successEmail = document.getElementById('contactSuccessEmail');
  const sendAnother = document.getElementById('contactSendAnother');

  function showError(input) {
    input.classList.add('is-invalid');
    const error = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (error) error.classList.add('is-visible');
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    const error = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (error) error.classList.remove('is-visible');
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    if (nameInput.value.trim().length < 2) {
      showError(nameInput);
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      showError(emailInput);
      valid = false;
    }

    if (messageInput.value.trim().length < 10) {
      showError(messageInput);
      valid = false;
    }

    if (!valid) return;

    successName.textContent = nameInput.value.trim().split(' ')[0];
    successEmail.textContent = emailInput.value.trim();

    form.style.display = 'none';
    success.classList.add('is-active');
  });

  sendAnother.addEventListener('click', () => {
    form.reset();
    [nameInput, emailInput, messageInput].forEach(clearError);
    success.classList.remove('is-active');
    form.style.display = 'block';
    nameInput.focus();
  });
}

/* ---------------------------------------------
   FAQ accordion
--------------------------------------------- */
function initFaqAccordion() {
  document.querySelectorAll('.faq__question').forEach((btn) => {
    const answer = btn.nextElementSibling;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq__question').forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });
}
