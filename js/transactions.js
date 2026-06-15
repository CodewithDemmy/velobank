/* ============================================
   Velobank — Transactions page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderTransactionGroups();
  initFilters();
  initSearch();
});

const TX_DATA = [
  {
    group: 'Today',
    items: [
      { name: 'Salary — Brightway Tech', meta: '9:14 AM', amount: 320000, type: 'in', category: 'salary', icon: '💼' },
      { name: 'Transfer to Chidi Okafor', meta: '8:02 AM', amount: -15000, type: 'out', category: 'transfer', icon: '↗' },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      { name: 'Netflix subscription', meta: '6:45 PM', amount: -4400, type: 'out', category: 'bills', icon: '🎬' },
      { name: 'From Folake (Splitting rent)', meta: '2:30 PM', amount: 75000, type: 'in', category: 'transfer', icon: '🏠' },
      { name: 'Spotify Premium', meta: '11:02 AM', amount: -1900, type: 'out', category: 'bills', icon: '🎵' },
    ],
  },
  {
    group: 'This week',
    items: [
      { name: 'PHCN — electricity bill', meta: 'Monday · 11:05 AM', amount: -12500, type: 'out', category: 'bills', icon: '⚡' },
      { name: 'Jumia order #2291', meta: 'Sunday · 4:18 PM', amount: -28300, type: 'out', category: 'shopping', icon: '🛍' },
      { name: 'Bolt ride', meta: 'Sunday · 9:40 AM', amount: -2200, type: 'out', category: 'transport', icon: '🚗' },
      { name: 'From Tunde (loan repayment)', meta: 'Saturday · 6:00 PM', amount: 20000, type: 'in', category: 'transfer', icon: '↘' },
      { name: 'MTN data — 10GB', meta: 'Friday · 1:15 PM', amount: -3500, type: 'out', category: 'bills', icon: '📶' },
    ],
  },
  {
    group: 'Earlier this month',
    items: [
      { name: 'GOTV subscription', meta: '3 Jun · 7:30 AM', amount: -7200, type: 'out', category: 'bills', icon: '📺' },
      { name: 'Transfer to Amaka', meta: '2 Jun · 5:55 PM', amount: -10000, type: 'out', category: 'transfer', icon: '↗' },
      { name: 'Uber ride', meta: '1 Jun · 8:20 AM', amount: -3100, type: 'out', category: 'transport', icon: '🚕' },
      { name: 'Refund — Konga order', meta: '30 May · 2:00 PM', amount: 14500, type: 'in', category: 'shopping', icon: '↩' },
      { name: 'Salary — Brightway Tech', meta: '28 May · 9:00 AM', amount: 320000, type: 'in', category: 'salary', icon: '💼' },
      { name: 'Shoprite groceries', meta: '27 May · 6:10 PM', amount: -18750, type: 'out', category: 'shopping', icon: '🛒' },
    ],
  },
];

/* ---------------------------------------------
   Render grouped transactions
--------------------------------------------- */
function renderTransactionGroups() {
  const container = document.getElementById('txGroups');
  if (!container) return;

  const formatter = new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  container.innerHTML = TX_DATA.map((group) => {
    const items = group.items.map((tx) => {
      const isIn = tx.type === 'in';
      const sign = isIn ? '+' : '−';
      const amount = formatter.format(Math.abs(tx.amount));

      return `
        <li class="tx-item" data-type="${tx.type}" data-category="${tx.category}" data-name="${tx.name.toLowerCase()}">
          <div class="tx-item__icon ${isIn ? '' : 'is-out'}">${tx.icon}</div>
          <div class="tx-item__info">
            <span class="tx-item__name">${tx.name}</span>
            <span class="tx-item__meta">${tx.meta}</span>
          </div>
          <span class="tx-item__amount ${isIn ? 'is-in' : 'is-out'}">${sign}₦${amount}</span>
        </li>
      `;
    }).join('');

    return `
      <div class="tx-group" data-group>
        <p class="tx-group__title">${group.group}</p>
        <ul class="tx-list">${items}</ul>
      </div>
    `;
  }).join('');
}

/* ---------------------------------------------
   Filter tabs (All / Money in / Money out / Bills)
--------------------------------------------- */
function initFilters() {
  const filters = document.querySelectorAll('.tx-filter');
  if (!filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFiltersAndSearch();
    });
  });
}

/* ---------------------------------------------
   Search box
--------------------------------------------- */
function initSearch() {
  const input = document.getElementById('txSearch');
  if (!input) return;

  input.addEventListener('input', applyFiltersAndSearch);
}

/* ---------------------------------------------
   Combine filter + search, show/hide items
   and groups, and toggle the empty state
--------------------------------------------- */
function applyFiltersAndSearch() {
  const activeFilter = document.querySelector('.tx-filter.is-active')?.dataset.filter || 'all';
  const query = (document.getElementById('txSearch')?.value || '').trim().toLowerCase();

  let visibleCount = 0;

  document.querySelectorAll('.tx-group').forEach((group) => {
    let groupVisible = 0;

    group.querySelectorAll('.tx-item').forEach((item) => {
      const type = item.dataset.type;
      const category = item.dataset.category;
      const name = item.dataset.name;

      let matchesFilter = true;
      if (activeFilter === 'in') matchesFilter = type === 'in';
      if (activeFilter === 'out') matchesFilter = type === 'out';
      if (activeFilter === 'bills') matchesFilter = category === 'bills';

      const matchesSearch = !query || name.includes(query);
      const visible = matchesFilter && matchesSearch;

      item.classList.toggle('is-hidden', !visible);
      if (visible) groupVisible++;
    });

    group.style.display = groupVisible > 0 ? '' : 'none';
    visibleCount += groupVisible;
  });

  const empty = document.getElementById('txEmpty');
  if (empty) empty.classList.toggle('is-visible', visibleCount === 0);
}
