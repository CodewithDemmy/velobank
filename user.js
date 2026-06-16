/* ============================================
   Velobank — User identity (localStorage)
   Shared across signup, login, and dashboard pages.
   ============================================ */

const VELOBANK_USER_KEY = 'velobank_user';

/* ---------------------------------------------
   Defaults used when no user is stored yet
   (e.g. someone lands on a dashboard page
   directly, without signing up or logging in)
--------------------------------------------- */
const DEFAULT_USER = {
  fullName: 'Velobank User',
  email: '',
  phone: '',
  address: '',
  accountNumber: null, // generated on first use
  balance: 25000, // starting balance for a brand-new account
};

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function getInitials(name) {
  if (!name) return 'VU';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'VU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDisplayName(name) {
  if (!name) return DEFAULT_USER.fullName;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return DEFAULT_USER.fullName;
  if (parts.length === 1) return parts[0];
  // "Ademola Afolabi" -> "Ademola A."
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function getFirstName(name) {
  if (!name) return 'there';
  return name.trim().split(/\s+/)[0];
}

function generateAccountNumber() {
  let digits = '';
  for (let i = 0; i < 10; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
}

function formatAccountNumber(digits) {
  if (!digits) return '';
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 10)}`;
}

/* ---------------------------------------------
   Get / save the current user
--------------------------------------------- */
function getUser() {
  try {
    const raw = localStorage.getItem(VELOBANK_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER, ...parsed };
  } catch (e) {
    return null;
  }
}

function saveUser(partial) {
  const current = getUser() || {};
  const merged = { ...DEFAULT_USER, ...current, ...partial };

  if (!merged.accountNumber) {
    merged.accountNumber = generateAccountNumber();
  }

  try {
    localStorage.setItem(VELOBANK_USER_KEY, JSON.stringify(merged));
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — fail silently
  }

  return merged;
}

/* ---------------------------------------------
   Ensure a user record exists.
   Used on login when no signup has happened yet.
--------------------------------------------- */
function ensureUser() {
  const existing = getUser();
  if (existing) return existing;
  return saveUser({ ...DEFAULT_USER });
}

function clearUser() {
  try {
    localStorage.removeItem(VELOBANK_USER_KEY);
  } catch (e) {
    // ignore
  }
}

/* ---------------------------------------------
   Apply the stored user's identity to the
   current page: sidebar, topbar, greeting,
   balance, account number, card holder names.
--------------------------------------------- */
function applyUserIdentity() {
  const user = getUser() || { ...DEFAULT_USER };
  const initials = getInitials(user.fullName);
  const displayName = getDisplayName(user.fullName);
  const firstName = getFirstName(user.fullName);

  // Sidebar + topbar avatars
  document.querySelectorAll('.user-avatar').forEach((el) => {
    el.textContent = initials;
  });

  // Sidebar display name ("Ademola A." style)
  document.querySelectorAll('.user-display-name').forEach((el) => {
    el.textContent = displayName;
  });

  // Dashboard greeting first name
  const firstNameEl = document.getElementById('userFirstName');
  if (firstNameEl) firstNameEl.textContent = firstName;

  // Card holder names (mini cards, virtual/debit cards)
  document.querySelectorAll('.user-card-name').forEach((el) => {
    el.textContent = displayName;
  });

  // Account number (dashboard balance card)
  const accountEl = document.getElementById('userAccountNumber');
  if (accountEl) {
    if (!user.accountNumber) {
      user.accountNumber = generateAccountNumber();
      saveUser({ accountNumber: user.accountNumber });
    }
    accountEl.textContent = formatAccountNumber(user.accountNumber);
  }

  // Balance — set the data-target so dashboard.js's
  // animateBalance() picks up the right amount
  const balanceEl = document.getElementById('balanceAmount');
  if (balanceEl) {
    balanceEl.dataset.target = String(user.balance);
  }

  // Settings page — profile form fields
  const nameInput = document.getElementById('settingsFullName');
  const emailInput = document.getElementById('settingsEmail');
  const phoneInput = document.getElementById('settingsPhone');
  const addressInput = document.getElementById('settingsAddress');

  if (nameInput) nameInput.value = user.fullName || '';
  if (emailInput && user.email) emailInput.value = user.email;
  if (phoneInput && user.phone) phoneInput.value = user.phone;
  if (addressInput && user.address) addressInput.value = user.address;
}

document.addEventListener('DOMContentLoaded', () => {
  ensureUser();
  applyUserIdentity();

  // Clear the stored identity when logging out, so the next
  // person to sign up or log in doesn't see someone else's data
  document.querySelectorAll('.dash__logout').forEach((link) => {
    link.addEventListener('click', () => {
      clearUser();
    });
  });
});
