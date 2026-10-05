(() => {
  'use strict';
  // No analytics, storage, remote fonts, preconnect or provider requests on load.
  document.querySelectorAll('button[data-video-id]').forEach(button => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(button.dataset.videoId)) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const frame = button.closest('.video-frame');
      if (!frame || frame.querySelector('iframe')) return;
      const iframe = document.createElement('iframe');
      iframe.title = 'Vídeo original: ' + button.dataset.videoTitle;
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + button.dataset.videoId;
      iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.tabIndex = 0;
      frame.replaceChildren(iframe);
      iframe.focus({preventScroll: true});
    });
  });
  // TOC already exists in server HTML. Only enhance current-section feedback.
  const links = [...document.querySelectorAll('.toc a[href^="#leitura-"]')];
  if ('IntersectionObserver' in window && links.length) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!current) return;
      links.forEach(link => {
        if (link.hash === '#' + current.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
    links.forEach(link => { const heading = document.getElementById(link.hash.slice(1)); if (heading) observer.observe(heading); });
  }
})();
