// Subtle nav state and smooth anchors
const nav = document.querySelector('[data-nav]');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 24);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
