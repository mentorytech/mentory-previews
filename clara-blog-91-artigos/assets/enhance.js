(() => {
  'use strict';
  // Native YouTube iframe is server-rendered and lazy-loaded by the browser.
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
