document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Aplicação registrada. A equipe da Clara entrará em contato.');
});
