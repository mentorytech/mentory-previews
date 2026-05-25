// Mobile menu
const toggle = document.getElementById('mobileToggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        toggle.classList.toggle('active');
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});
