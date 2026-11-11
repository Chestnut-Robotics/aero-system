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

// Demonstration carousel. Without JS the track still scrolls and thumbnails link to each slide.
for (const carousel of document.querySelectorAll('[data-carousel]')) {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  const thumbs = [...carousel.querySelectorAll('[data-slide]')];
  const [prev, next] = carousel.querySelectorAll('.carousel-arrow');
  const counter = carousel.querySelector('[data-current]');
  let current = 0;
  const show = index => {
    current = Math.max(0, Math.min(slides.length - 1, index));
    counter.textContent = current + 1;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-current', i === current ? 'true' : 'false'));
    const strip = carousel.querySelector('.carousel-thumbs');
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: thumbs[current].parentElement.offsetLeft - strip.offsetLeft - 18, behavior: 'smooth' });
    }
  };
  // Pause clips that are off screen, once scrolling has come to rest.
  let restTimer = null;
  const pauseHidden = () => {
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      slides.forEach((slide, i) => { if (i !== index) slide.querySelector('video').pause(); });
    }, 200);
  };
  let settling = null;
  const goTo = index => {
    show(index);
    clearTimeout(settling);
    settling = setTimeout(() => { settling = null; }, 700);
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft });
  };
  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', event => { event.preventDefault(); goTo(i); }));
  track.addEventListener('keydown', event => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step && event.target === track) { event.preventDefault(); goTo(current + step); }
  });
  let pending = false;
  track.addEventListener('scroll', () => {
    pauseHidden();
    if (pending || settling) return;
    pending = true;
    requestAnimationFrame(() => {
      show(Math.round(track.scrollLeft / track.clientWidth));
      pending = false;
    });
  }, { passive: true });
  show(0);
}
