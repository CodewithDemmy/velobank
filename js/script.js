/* ============================================
   Velobank — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTicker();
  initStatCounters();
  initCtaForm();
});

/* ---------------------------------------------
   Mobile nav toggle
--------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after tapping a link
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------
   Live transaction ticker
   Generates a believable, looping strip of
   transfer activity.
--------------------------------------------- */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const names = [
    'Adaeze', 'Chidi', 'Folake', 'Tunde', 'Ngozi', 'Bayo',
    'Amaka', 'Femi', 'Halima', 'Emeka', 'Yetunde', 'Kola',
    'Chioma', 'Segun', 'Aisha', 'Obinna'
  ];

  const merchants = [
    'Jumia', 'Spotify', 'Netflix', 'Konga', 'Bolt', 'Uber',
    'PHCN bill', 'GOTV', 'DSTV', 'MTN data'
  ];

  function randomAmount() {
    const value = Math.floor(Math.random() * 48000) + 500;
    return value.toLocaleString('en-NG');
  }

  function buildItem() {
    const isIncoming = Math.random() > 0.5;
    const isBill = !isIncoming && Math.random() > 0.6;
    const span = document.createElement('span');
    span.className = 'ticker__item';

    if (isIncoming) {
      const name = names[Math.floor(Math.random() * names.length)];
      span.innerHTML = `From ${name} <span class="amt-in">+₦${randomAmount()}</span> <span class="dot"></span> Completed`;
    } else if (isBill) {
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      span.innerHTML = `${merchant} <span class="amt-out">-₦${randomAmount()}</span> <span class="dot"></span> Paid`;
    } else {
      const name = names[Math.floor(Math.random() * names.length)];
      span.innerHTML = `To ${name} <span class="amt-out">-₦${randomAmount()}</span> <span class="dot"></span> Completed`;
    }
    return span;
  }

  // Build one set of items, then duplicate it so the
  // CSS animation (-50% translateX) loops seamlessly.
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 18; i++) {
    fragment.appendChild(buildItem());
  }

  track.appendChild(fragment.cloneNode(true));
  track.appendChild(fragment.cloneNode(true));
}

/* ---------------------------------------------
   Animated stat counters
   Counts up when the hero stats scroll into view.
--------------------------------------------- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat__num');
  if (!stats.length) return;

  const formatters = {
    plain: new Intl.NumberFormat('en-US'),
  };

  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const divide = el.dataset.decimalDivide ? parseFloat(el.dataset.decimalDivide) : null;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;

      if (divide) {
        el.textContent = (current / divide).toFixed(1) + suffix;
      } else {
        el.textContent = formatters.plain.format(Math.floor(current)) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (divide) {
        el.textContent = (target / divide).toFixed(1) + suffix;
      } else {
        el.textContent = formatters.plain.format(target) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach((stat) => observer.observe(stat));
}

/* ---------------------------------------------
   CTA form — phone number validation
--------------------------------------------- */
function initCtaForm() {
  const form = document.getElementById('ctaForm');
  const input = document.getElementById('ctaPhone');
  const note = document.getElementById('ctaNote');

  if (!form || !input || !note) return;

  const defaultNote = note.textContent;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = input.value.trim();
    const isValid = /^[0-9+\s]{7,15}$/.test(value);

    if (!isValid) {
      input.classList.add('is-invalid');
      note.textContent = 'That doesn\'t look like a valid phone number — try again.';
      note.classList.remove('is-success');
      note.classList.add('is-error');
      input.focus();
      return;
    }

    input.classList.remove('is-invalid');
    note.classList.remove('is-error');
    note.classList.add('is-success');
    note.textContent = `Thanks — taking you to sign up with ${value}...`;

    setTimeout(() => {
      window.location.href = `signup.html?phone=${encodeURIComponent(value)}`;
    }, 900);
  });

  // Clear invalid state as the user edits
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    if (note.classList.contains('is-error')) {
      note.classList.remove('is-error');
      note.textContent = defaultNote;
    }
  });
}
