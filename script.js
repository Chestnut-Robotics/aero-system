'use strict';

// Playback begins only after an explicit visitor action; all clips work without JS.
const videos = [...document.querySelectorAll('video')];
for (const video of videos) {
  video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  });
}
for (const link of document.querySelectorAll('[data-play]')) {
  link.addEventListener('click', () => {
    const video = document.getElementById(link.dataset.play);
    if (video) video.play().catch(() => { /* Native controls remain available. */ });
  });
}
// Do not resume playback automatically after leaving the page or viewport.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach(video => video.pause());
});
document.querySelector('.film-details').addEventListener('toggle', event => {
  if (!event.currentTarget.open) event.currentTarget.querySelector('video').pause();
});
if ('IntersectionObserver' in window) {
  const playbackObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }, { threshold: 0 });
  videos.forEach(video => playbackObserver.observe(video));
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.hash));
  let updatePending = false;
  const updateNavigation = () => {
    const threshold = document.querySelector('.site-header').offsetHeight + 70;
    let active = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) active = index;
    });
    navLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updatePending = false;
  };
  window.addEventListener('scroll', () => {
    if (!updatePending) {
      updatePending = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
}
