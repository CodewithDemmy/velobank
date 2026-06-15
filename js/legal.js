/* ============================================
   Velobank — Legal page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTocScrollSpy();
});

/* ---------------------------------------------
   Highlight the active TOC link based on scroll
--------------------------------------------- */
function initTocScrollSpy() {
  const links = document.querySelectorAll('.legal__toc-link');
  const sections = document.querySelectorAll('.legal__section');

  if (!links.length || !sections.length) return;

  const linkMap = {};
  links.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    linkMap[id] = link;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkMap[entry.target.id];
      if (!link) return;

      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}
