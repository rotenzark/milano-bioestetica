/* ============ MILANO BIOESTETICA · main.js ============ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- INTRO ---- */
  var intro = document.getElementById('intro');
  function closeIntro() { if (intro) { intro.classList.add('done'); setTimeout(function () { intro.style.display = 'none'; }, 800); } }
  if (intro) {
    if (reduce) intro.style.display = 'none';
    else { document.getElementById('intro-skip').addEventListener('click', closeIntro); setTimeout(closeIntro, 3200); }
  }

  /* ---- HEADER ---- */
  var header = document.getElementById('site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- MOBILE NAV ---- */
  var burger = document.getElementById('burger'), nav = document.querySelector('.nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }); });

  /* ---- REVEAL ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
    setTimeout(function () { reveals.forEach(function (r) { if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('in'); }); }, 1500);
  } else reveals.forEach(function (r) { r.classList.add('in'); });

  /* ---- PERCORSO RAIL (climate) ---- */
  var ACCENT = { acqua: '#3E7C8C', vapore: '#B98E6E', sale: '#D98C86', mani: '#9B7A5C' };
  var rail = document.querySelector('.rail');
  var rooms = document.querySelectorAll('.room');
  if (rail && rooms.length && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          var c = e.target.getAttribute('data-climate');
          rail.style.setProperty('--room-accent', ACCENT[c] || '#5C6E5A');
          rail.querySelectorAll('a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-room') === c); });
        }
      });
    }, { threshold: [0.5] });
    rooms.forEach(function (r) { rio.observe(r); });
  }

  /* ---- DYNAMIC HOURS ---- */
  function romeNow() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' })); }
  function openTime(day) { return day === 1 ? 10.5 : (day >= 2 && day <= 6 ? 9.5 : null); }
  function openLabel(day) { return day === 1 ? '10:30' : '09:30'; }
  function isOpen(d) { var day = d.getDay(), h = d.getHours() + d.getMinutes() / 60, o = openTime(day); return o !== null && h >= o && h < 19.5; }
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function updateLive() {
    var d = romeNow(), open = isOpen(d), dot = document.getElementById('live-dot'), txt = document.getElementById('live-text');
    if (!dot) return; var en = LANG === 'en';
    if (open) { dot.className = 'open'; txt.textContent = en ? 'Open now · closes at 19:30' : 'Aperto ora · chiude alle 19:30'; }
    else {
      dot.className = 'closed';
      var day = d.getDay(), h = d.getHours() + d.getMinutes() / 60, oi = openTime(day), info;
      if (oi !== null && h < oi) info = { d: day, off: 0 };
      else { for (var i = 1; i <= 7; i++) { var nd = (day + i) % 7; if (openTime(nd) !== null) { info = { d: nd, off: i }; break; } } }
      var name = info.off === 0 ? (en ? 'today' : 'oggi') : (en ? DAYS_EN[info.d] : DAYS_IT[info.d]);
      txt.textContent = en ? ('Closed · opens ' + name + ' at ' + openLabel(info.d)) : ('Chiuso · apre ' + name + ' alle ' + openLabel(info.d));
    }
    document.querySelectorAll('.day').forEach(function (c) { c.classList.toggle('today', parseInt(c.getAttribute('data-day'), 10) === d.getDay()); });
  }

  /* ---- LIGHTBOX ---- */
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img');
  document.querySelectorAll('.g-item').forEach(function (fig) {
    fig.addEventListener('click', function () { lbImg.src = fig.getAttribute('data-full'); lbImg.alt = (fig.querySelector('img') || {}).alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); });
  });
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); setTimeout(function () { lbImg.src = ''; }, 300); }
  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---- i18n ---- */
  var LANG = 'it';
  var EN = {
    'intro.txt': 'Enter the journey', 'intro.skip': 'Enter →',
    'nav.percorso': 'The journey', 'nav.tratt': 'Treatments', 'nav.sedi': 'Locations', 'nav.rec': 'Reviews', 'nav.contatti': 'Contact',
    'cta.book': 'Book',
    'hero.eyebrow': 'Beauty centre & Luxury SPA · Milan', 'hero.h1a': 'Your', 'hero.h1b': 'journey of the senses',
    'hero.sub': 'Water, steam, salt. A path that slows time down — and, beside it, professional beauty care. Two locations in Milan.',
    'hero.cta1': 'Book on WhatsApp', 'hero.cta2': 'Discover the journey', 'hero.live': 'Checking hours…', 'hero.cap': 'The Luxury SPA · Via Gioia 77',
    'perc.kicker': 'The journey of the senses', 'perc.h2': 'Four rooms, one breath.',
    'perc.lead': 'At the Via Gioia Luxury SPA, wellbeing is a path: from water to steam, from salt to care. At each step the climate changes.',
    'room.acqua.t': 'Cool', 'room.acqua.h': 'Water', 'room.acqua.p': 'The whirlpool mini-pool. Water melts the weight of the day: this is where the journey begins.',
    'room.vapore.t': 'Warm', 'room.vapore.h': 'Steam', 'room.vapore.p': 'The Turkish bath and the emotional shower. Breath opens between heat and essences: the skin readies, the mind slows.',
    'room.sale.t': 'Hot', 'room.sale.h': 'Salt', 'room.sale.p': 'The salt cave. Clear, mineral air, the graduation tower, amber light: you breathe the sea, in the middle of the city.',
    'room.mani.t': 'Enveloping', 'room.mani.h': 'Hands', 'room.mani.p': 'Care that passes through expert hands: the cabin, the face and body treatments. The journey closes where beauty begins.',
    'tratt.kicker': 'Treatments', 'tratt.h2': 'Care, in every form.',
    'ti.1t': 'Permanent Laser Hair Removal', 'ti.1p': 'Professional technology, smooth skin that lasts.',
    'ti.2t': 'Pressotherapy', 'ti.2p': 'Draining, for light legs and microcirculation.',
    'ti.3t': 'Aesthetic medicine', 'ti.3p': 'Radiofrequency, cryolipolysis, microdermabrasion, mesotherapy, oxygen therapy.',
    'ti.4t': 'Face & body', 'ti.4p': 'Tailored treatments with professional cosmetics.',
    'ti.5t': 'Hands & feet', 'ti.5p': 'Manicure, pedicure and nail care.',
    'ti.6t': 'Make-up & Lash Extensions', 'ti.6p': 'Make-up for every occasion and an intense gaze.',
    'tratt.note': 'Price lists and brochures available in-store and on request. Prices are indicative — ask us for a quote.', 'tratt.cta': 'Ask on WhatsApp',
    'sedi.kicker': 'Locations', 'sedi.h2': 'Two addresses, the same care.',
    'sede.spa': 'Luxury SPA', 'sede.gioia.addr': 'corner of Via Muzio 1/D · 20125 Milan', 'sede.gioia.note': 'The wellness journey: whirlpool, Turkish bath, emotional shower and salt cave.',
    'sede.tel': 'Phone', 'sede.route': 'Get directions →',
    'sede.est': 'Beauty centre', 'sede.teo.addr': 'Città Studi · 20131 Milan', 'sede.teo.note': 'Beauty and aesthetic-medicine treatments, steps from the Politecnico.',
    'gallery.kicker': 'Gallery', 'gallery.h2': 'Inside Milano BioEstetica',
    'rev.kicker': 'Reviews', 'rev.h2': 'The words of those who choose us', 'rev.count': 'on Google, across both locations',
    'cont.kicker': 'Contact & hours', 'cont.h2': 'Book your moment.',
    'cont.hours': 'Hours', 'cont.hoursv': 'Mon 10:30–19:30 · Tue–Sat 09:30–19:30 · Sun closed', 'cont.wa': 'WhatsApp', 'cont.tel': 'Phone', 'cont.web': 'Legacy site',
    'cont.book': 'Book on WhatsApp', 'cont.call': 'Call the SPA',
    'day.mon': 'Mon', 'day.tue': 'Tue', 'day.wed': 'Wed', 'day.thu': 'Thu', 'day.fri': 'Fri', 'day.sat': 'Sat', 'day.sun': 'Sun', 'day.closed': 'closed',
    'faq.h2': 'Frequently asked',
    'faq.q1': 'What is the wellness journey?', 'faq.a1': 'At the Via Gioia Luxury SPA it includes a whirlpool mini-pool, emotional shower, Turkish bath and salt cave.',
    'faq.q2': 'How many locations do you have?', 'faq.a2': 'Two: Via Teodosio 27 (Città Studi) and Via Melchiorre Gioia 77 (corner of Via Muzio 1/D), where the Luxury SPA is.',
    'faq.q3': 'What treatments do you offer?', 'faq.a3': 'Permanent laser hair removal, pressotherapy, aesthetic medicine (radiofrequency, cryolipolysis, microdermabrasion, mesotherapy), face and body, hands and feet, make-up and lash extensions.',
    'faq.q4': 'How do I book?', 'faq.a4': 'On WhatsApp at 339 810 2580, or by phone. Hours: Monday 10:30–19:30, Tuesday to Saturday 09:30–19:30.',
    'foot.sub': 'Beauty centre & Luxury SPA', 'foot.spa': 'Luxury SPA', 'foot.est': 'Beauty centre', 'foot.contact': 'Contact',
    'foot.disclaimer': 'Demo website. Content and photos gathered from public sources and the client’s official site; some service images are stock and prices are indicative, to be confirmed with the centre.',
    'ab.book': 'Book', 'ab.call': 'Call', 'ab.route': 'Directions'
  };
  var IT = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { IT[el.getAttribute('data-i18n')] = el.innerHTML; });
  function setLang(lang) {
    LANG = lang; var dict = lang === 'en' ? EN : IT;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'), v = dict[k]; if (v == null && lang === 'en') v = IT[k]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    updateLive();
  }
  document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });

  updateLive();
  setInterval(updateLive, 60000);
})();
