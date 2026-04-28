/* ═══════════════════════════════════════════════════════
   HEKAYETNA PRO · script.js
   ── CLIENT CUSTOMIZATION ─────────────────────────────
   Edit ONLY the CONFIG object below for each new client.
   ════════════════════════════════════════════════════ */

const CONFIG = {

  // 🔑 Secret password the girlfriend will type
  password: "1234",

  // 🎵 YouTube video ID
  // Full URL example: https://www.youtube.com/watch?v=B6-nKgWhSjc
  // Paste only the part after v=
  youtubeId: "AfDa_5sm5Js?si=5lganvdsuBUIvQWd",

  // 💑 Heart page — two photo URLs (her photo, his photo)
  heartPhotos: [
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  ],

  // 📸 Gallery photos — add or remove as many as you want
  gallery: [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=560&fit=crop",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&h=560&fit=crop",
    "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&h=560&fit=crop",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=560&fit=crop",
  ],

};

/* ═══════════════════════════════════════════════════════
   ENGINE — do not edit below unless you are a developer
   ════════════════════════════════════════════════════ */

let currentPage = 'page-entry';
let envOpened   = false;
let gIdx        = 0;

// ── Stars background ─────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random(),
        s: (Math.random() - 0.5) * 0.003
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += s.s;
      if (s.o > 1) s.o = 1, s.s *= -1;
      if (s.o < 0) s.o = 0, s.s *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.o * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeStars(180); });
  resize(); makeStars(180); draw();
})();

// ── Floating gold particles ───────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.animationDuration = (Math.random() * 12 + 10) + 's';
    p.style.animationDelay    = (Math.random() * 12) + 's';
    p.style.width             = p.style.height = (Math.random() * 3 + 1.5) + 'px';
    container.appendChild(p);
  }
})();

// ── Page transitions ──────────────────────────────────
function goTo(id) {
  const current = document.getElementById(currentPage);
  const next    = document.getElementById(id);

  current.classList.add('exit');
  setTimeout(() => {
    current.classList.remove('active', 'exit');
    next.classList.add('active');
    currentPage = id;
  }, 500);

  // Auto-load video on video page
  if (id === 'page-video') {
    const frame = document.getElementById('videoFrame');
    if (!frame.src || frame.src === window.location.href) {
      frame.src = `https://www.youtube.com/embed/${CONFIG.youtubeId}?autoplay=1&rel=0`;
    }
  }
}

// ── Password check ────────────────────────────────────
function checkPassword() {
  const val = document.getElementById('passInput').value.trim();
  const err = document.getElementById('passError');

  if (val === CONFIG.password) {
    err.textContent = '';
    loadHeartPhotos();
    buildGallery();
    goTo('page-letter');
    setTimeout(initEnvelope, 200);
  } else {
    err.textContent = '✕  Wrong password. Try again.';
    document.getElementById('passInput').value = '';
    document.getElementById('passInput').focus();
    // shake input
    const input = document.getElementById('passInput');
    input.style.animation = 'none';
    void input.offsetWidth;
    input.style.animation = 'shake 0.4s ease';
    setTimeout(() => { err.textContent = ''; }, 2800);
  }
}

// ── Envelope ──────────────────────────────────────────
function initEnvelope() {
  if (envOpened) return;
  const scene = document.getElementById('envelopeScene');
  scene.onclick = openEnvelope;
}

function openEnvelope() {
  if (envOpened) return;
  envOpened = true;

  document.getElementById('envSeal').classList.add('hidden');

  setTimeout(() => {
    document.getElementById('envFlap').classList.add('open');

    setTimeout(() => {
      document.getElementById('letterReveal').classList.add('open');

      setTimeout(() => {
        const btn = document.getElementById('letterNextWrap');
        btn.classList.remove('hidden');
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.6s ease';
        setTimeout(() => btn.style.opacity = '1', 50);
      }, 900);
    }, 700);
  }, 200);
}

// ── Heart photos ──────────────────────────────────────
function loadHeartPhotos() {
  const [top, bottom] = CONFIG.heartPhotos;
  const imgTop    = document.getElementById('heartPhotoTop').querySelector('img');
  const imgBottom = document.getElementById('heartPhotoBottom').querySelector('img');
  if (top)    imgTop.src    = top;
  if (bottom) imgBottom.src = bottom;
}

// ── Gallery ───────────────────────────────────────────
function buildGallery() {
  const track = document.getElementById('galleryTrack');
  const dots  = document.getElementById('galleryDots');
  track.innerHTML = '';
  dots.innerHTML  = '';
  gIdx = 0;

  CONFIG.gallery.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'gallery-slide' + (i === 0 ? ' on' : '');
    slide.innerHTML = `<img src="${src}" alt="Photo ${i+1}" loading="lazy"
      onerror="this.parentElement.innerHTML='<div style=\\'color:rgba(201,168,76,0.4);font-size:0.8rem;letter-spacing:0.1em\\'>PHOTO ${i+1}</div>'">`;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'gallery-dot' + (i === 0 ? ' on' : '');
    dot.onclick = () => galleryGo(i);
    dots.appendChild(dot);
  });
}

function galleryMove(dir) {
  galleryGo((gIdx + dir + CONFIG.gallery.length) % CONFIG.gallery.length);
}

function galleryGo(idx) {
  const slides = document.querySelectorAll('.gallery-slide');
  const dots   = document.querySelectorAll('.gallery-dot');
  slides[gIdx].classList.remove('on');
  dots[gIdx].classList.remove('on');
  gIdx = idx;
  slides[gIdx].classList.add('on');
  dots[gIdx].classList.add('on');
}

// ── Reset & home ──────────────────────────────────────
function resetAndHome() {
  document.getElementById('passInput').value = '';
  document.getElementById('passError').textContent = '';
  document.getElementById('videoFrame').src = '';
  document.getElementById('envFlap').classList.remove('open');
  document.getElementById('envSeal').classList.remove('hidden');
  document.getElementById('letterReveal').classList.remove('open');
  const nb = document.getElementById('letterNextWrap');
  nb.classList.add('hidden'); nb.style.opacity = '0';
  envOpened = false;
  goTo('page-entry');
  setTimeout(() => document.getElementById('passInput').focus(), 600);
}

// ── Touch / swipe on gallery ──────────────────────────
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50 && currentPage === 'page-gallery') galleryMove(diff > 0 ? 1 : -1);
});

// ── Keyboard ──────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && currentPage === 'page-entry') checkPassword();
  if (currentPage === 'page-gallery') {
    if (e.key === 'ArrowRight') galleryMove(1);
    if (e.key === 'ArrowLeft')  galleryMove(-1);
  }
});

// ── Input shake animation ─────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0); }
    20%    { transform:translateX(-8px); }
    40%    { transform:translateX(8px); }
    60%    { transform:translateX(-5px); }
    80%    { transform:translateX(5px); }
  }
`;
document.head.appendChild(style);

// ── Boot ──────────────────────────────────────────────
document.getElementById('entryBtn').addEventListener('click', checkPassword);
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.getElementById('passInput').focus(), 400);
});
