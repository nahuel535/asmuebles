/* ============================================================
   AS MUEBLES — SCRIPTS v2 (Premium)
   ============================================================ */

// Reemplazar con el número real (formato: 549 + código de área + número)
// Ejemplo: '5493512345678'  (54=Argentina, 9=móvil, 351=Córdoba, 2345678=número)
const WHATSAPP_NUMBER = 'COMPLETAR_NUMERO';

/* ============================================================
   NAVBAR — scroll + mobile toggle
   ============================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  waFloat.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   LOGO FALLBACK
   ============================================================ */
const logoImg  = document.querySelector('.nav-logo img');
const logoText = document.getElementById('logo-text');
if (logoImg && logoText) {
  const showText = () => { logoImg.style.display = 'none'; logoText.style.display = 'block'; };
  const showImg  = () => { logoImg.style.display = 'block'; logoText.style.display = 'none'; };
  logoImg.addEventListener('error', showText);
  logoImg.addEventListener('load', showImg);
  if (logoImg.complete) { logoImg.naturalWidth === 0 ? showText() : showImg(); }
}

/* ============================================================
   STATS — contador animado
   ============================================================ */
function animateCounter(el) {
  const target    = parseInt(el.dataset.target, 10);
  const duration  = 1400;
  const interval  = 16;
  const increment = target / (duration / interval);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else { el.textContent = Math.floor(current); }
  }, interval);
}

let countersTriggered = false;
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersTriggered) {
      countersTriggered = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  }, { threshold: 0.5 }).observe(statsBar);
}

/* ============================================================
   ANIMACIONES DE ENTRADA (data-anim)
   Dirección configurable: up | left | right | scale
   Stagger automático para hijos de grids
   ============================================================ */
const animEls = document.querySelectorAll('[data-anim]');

// Stagger para elementos dentro de grids
document.querySelectorAll(
  '.problem-grid, .features-grid, .process-grid, .testimonials-grid, .gallery-grid'
).forEach(grid => {
  grid.querySelectorAll(':scope > [data-anim]').forEach((child, i) => {
    child.style.transitionDelay = `${i * 90}ms`;
  });
});

const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim-visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

animEls.forEach(el => animObserver.observe(el));

/* ============================================================
   GALERÍA — LIGHTBOX
   ============================================================ */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCapt   = document.getElementById('lightboxCaption');
const lightboxCount  = document.getElementById('lightboxCounter');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex   = 0;

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  galleryItems[currentIndex]?.focus();
}

function updateLightbox() {
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src    = img.src;
  lightboxImg.alt    = img.alt;
  lightboxCapt.textContent  = img.alt;
  lightboxCount.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
}

function prevImage() { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); }
function nextImage() { currentIndex = (currentIndex + 1) % galleryItems.length; updateLightbox(); }

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) { dx < 0 ? nextImage() : prevImage(); }
});

/* ============================================================
   WIZARD FORM
   ============================================================ */
let currentStep = 1;

const wizardStepEls = document.querySelectorAll('.wizard-step');
const panels        = document.querySelectorAll('.wizard-panel');

function goToStep(step) {
  // Ocultar panel actual
  panels.forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${step}`).classList.add('active');

  // Actualizar indicadores
  wizardStepEls.forEach(el => {
    const n = parseInt(el.dataset.step, 10);
    el.classList.remove('active', 'done');
    if (n === step) el.classList.add('active');
    if (n < step)   el.classList.add('done');
  });

  currentStep = step;
}

function showFieldError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.toggle('error', show);
  error.classList.toggle('visible', show);
}

function validateStep1() {
  const nombre = document.getElementById('nombre').value.trim();
  const zona   = document.getElementById('zona').value.trim();
  let ok = true;
  if (!nombre) { showFieldError('nombre', 'error-nombre', true); ok = false; }
  else           showFieldError('nombre', 'error-nombre', false);
  if (!zona)   { showFieldError('zona', 'error-zona', true); ok = false; }
  else           showFieldError('zona', 'error-zona', false);
  return ok;
}

function updateSummary() {
  const nombre  = document.getElementById('nombre').value.trim();
  const zona    = document.getElementById('zona').value.trim();
  const tipo    = document.querySelector('input[name="tipo"]:checked')?.value || '';
  const tamanio = document.getElementById('tamanio').value;
  const summary = document.getElementById('wizard-summary');
  summary.innerHTML =
    `<strong>${nombre}</strong> · ${zona}` +
    (tipo    ? ` · ${tipo}`    : '') +
    (tamanio ? ` · ${tamanio}` : '');
}

document.getElementById('step1-next').addEventListener('click', () => {
  if (validateStep1()) goToStep(2);
});
document.getElementById('step2-back').addEventListener('click', () => goToStep(1));
document.getElementById('step2-next').addEventListener('click', () => {
  updateSummary();
  goToStep(3);
});
document.getElementById('step3-back').addEventListener('click', () => goToStep(2));

// Limpiar errores al escribir
['nombre', 'zona'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    showFieldError(id, 'error-' + id, false);
  });
});

// Submit → WhatsApp
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const nombre  = document.getElementById('nombre').value.trim();
  const zona    = document.getElementById('zona').value.trim();
  const tipo    = document.querySelector('input[name="tipo"]:checked')?.value || '';
  const tamanio = document.getElementById('tamanio').value;
  const mensaje = document.getElementById('mensaje').value.trim();

  let text = `Hola! Soy ${nombre}, de ${zona}.`;
  if (tipo)    text += ` Proyecto: ${tipo}.`;
  if (tamanio) text += ` Tamaño: ${tamanio}.`;
  if (mensaje) text += ` Comentario: ${mensaje}`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    '_blank', 'noopener,noreferrer'
  );
});

/* ============================================================
   WHATSAPP FLOTANTE
   ============================================================ */
const waFloat = document.getElementById('waFloat');

waFloat.addEventListener('click', () => {
  const text = '¡Hola! Me gustaría consultar sobre una cocina.';
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    '_blank', 'noopener,noreferrer'
  );
});
