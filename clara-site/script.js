const deferredGroups = document.querySelectorAll('.event-carousel, .instagram-preview');
const loadDeferredImage = (image) => {
  const source = image.dataset.src;
  if (!source) return;
  image.src = source;
  image.removeAttribute('data-src');
};

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('img[data-src]').forEach(loadDeferredImage);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '320px 0px' });

  deferredGroups.forEach((group) => imageObserver.observe(group));
} else {
  document.querySelectorAll('img[data-src]').forEach(loadDeferredImage);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const youtubeTrack = document.querySelector('[data-youtube-track]');
document.querySelector('[data-youtube-prev]')?.addEventListener('click', () => {
  youtubeTrack?.scrollBy({ left: -youtubeTrack.clientWidth * 0.82, behavior: 'smooth' });
});
document.querySelector('[data-youtube-next]')?.addEventListener('click', () => {
  youtubeTrack?.scrollBy({ left: youtubeTrack.clientWidth * 0.82, behavior: 'smooth' });
});

const passthroughKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'gbraid',
  'wbraid',
  'ttclid',
  'msclkid'
];

const incomingParams = new URLSearchParams(window.location.search);

document.querySelectorAll('.js-preserve-query').forEach((link) => {
  const destination = new URL(link.href);

  passthroughKeys.forEach((key) => {
    const value = incomingParams.get(key);
    if (value) destination.searchParams.set(key, value);
  });

  link.href = destination.toString();
});
