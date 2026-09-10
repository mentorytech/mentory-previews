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

const mediaModal = document.querySelector('[data-media-modal]');
const mediaStage = document.querySelector('[data-media-stage]');
const mediaTitle = document.querySelector('#media-modal-title');
const mediaCloseButton = document.querySelector('.media-modal__close');
let mediaTrigger = null;

const closeMedia = () => {
  if (!mediaModal || mediaModal.hidden) return;
  mediaModal.hidden = true;
  document.body.classList.remove('media-open');
  mediaStage.replaceChildren();
  mediaStage.removeAttribute('data-mode');
  mediaTrigger?.focus();
  mediaTrigger = null;
};

const openMedia = (trigger) => {
  if (!mediaModal || !mediaStage || !mediaTitle) return;
  const mode = trigger.dataset.media;
  const title = trigger.dataset.mediaTitle || 'Conteúdo de Clara Do Vale';
  let mediaElement;

  if (mode === 'youtube') {
    const videoId = trigger.dataset.videoId || '';
    const start = Number.parseInt(trigger.dataset.videoStart || '0', 10);
    if (!/^[\w-]{11}$/.test(videoId)) return;
    mediaElement = document.createElement('iframe');
    mediaElement.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&start=${Number.isNaN(start) ? 0 : start}`;
    mediaElement.title = title;
    mediaElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    mediaElement.allowFullscreen = true;
  } else if (mode === 'spotify') {
    mediaElement = document.createElement('iframe');
    mediaElement.src = 'https://open.spotify.com/embed/show/3NlTHVB3YKzlmEiWfgEPgp?theme=0';
    mediaElement.title = 'Podcast de Clara Do Vale no Spotify';
    mediaElement.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  } else if (mode === 'instagram') {
    mediaElement = document.createElement('img');
    mediaElement.src = new URL(trigger.dataset.mediaImage, document.baseURI).toString();
    mediaElement.alt = title;
  } else {
    return;
  }

  mediaTrigger = trigger;
  mediaTitle.textContent = title;
  mediaStage.dataset.mode = mode;
  mediaStage.replaceChildren(mediaElement);
  mediaModal.hidden = false;
  document.body.classList.add('media-open');
  mediaCloseButton?.focus();
};

document.querySelectorAll('[data-media]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openMedia(trigger);
  });
});

document.querySelectorAll('[data-media-close]').forEach((control) => {
  control.addEventListener('click', closeMedia);
});

document.addEventListener('keydown', (event) => {
  if (!mediaModal || mediaModal.hidden) return;
  if (event.key === 'Escape') closeMedia();
  if (event.key !== 'Tab') return;
  const focusable = [...mediaModal.querySelectorAll('button, iframe, [href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
