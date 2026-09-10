const deferredGroups = document.querySelectorAll('.event-carousel');
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

const enablePressMotion = () => document.body.classList.add('press-motion-ready');
['pointerdown', 'keydown', 'scroll'].forEach((eventName) => {
  window.addEventListener(eventName, enablePressMotion, { once: true, passive: eventName !== 'keydown' });
});

const eventCarousel = document.querySelector('.event-carousel');
if (eventCarousel && 'IntersectionObserver' in window) {
  const eventMotionObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    document.body.classList.add('event-motion-ready');
    observer.disconnect();
  }, { rootMargin: '240px 0px' });
  eventMotionObserver.observe(eventCarousel);
} else if (eventCarousel) {
  document.body.classList.add('event-motion-ready');
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const spotifyActivator = document.querySelector('[data-spotify-activate]');
const spotifyPoster = document.querySelector('[data-spotify-poster]');
const spotifyFrame = document.querySelector('.social-embed--spotify iframe[data-src]');
spotifyActivator?.addEventListener('click', () => {
  if (!spotifyFrame || !spotifyPoster) return;
  spotifyFrame.src = spotifyFrame.dataset.src;
  spotifyFrame.hidden = false;
  spotifyPoster.hidden = true;
  spotifyFrame.focus();
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
