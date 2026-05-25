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


const youtubeTrack = document.querySelector('[data-youtube-track]');
document.querySelector('[data-youtube-prev]')?.addEventListener('click', () => {
  youtubeTrack?.scrollBy({ left: -youtubeTrack.clientWidth * 0.82, behavior: 'smooth' });
});
document.querySelector('[data-youtube-next]')?.addEventListener('click', () => {
  youtubeTrack?.scrollBy({ left: youtubeTrack.clientWidth * 0.82, behavior: 'smooth' });
});
