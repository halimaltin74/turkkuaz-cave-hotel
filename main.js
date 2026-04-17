// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

// Contact form
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').min = today;
document.getElementById('checkout').min = today;

document.getElementById('checkin').addEventListener('change', (e) => {
  document.getElementById('checkout').min = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Gönderiliyor...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Rezervasyon Talebi Gönder';
    btn.disabled = false;
    success.classList.add('visible');
    form.reset();
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1200);
});
