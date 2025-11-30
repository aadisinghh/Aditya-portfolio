/* ===============================
   Theme Toggle (Dark / Light)
================================= */
const toggleBtn = document.getElementById('toggle-theme');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  });
}

/* ===============================
   Scroll Reveal for Sections
================================= */
const sections = document.querySelectorAll('section');
if (sections.length) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((s) => reveal.observe(s));
}

/* ===============================
   Typing Effect in Hero
================================= */
(function typingEffect() {
  const el = document.getElementById('typing');
  if (!el) return;
  const words = ['Websites', 'Web Applications', 'Responsive Designs'];
  let i = 0, j = 0, deleting = false;

  function type() {
    const word = words[i % words.length];
    if (!deleting) {
      el.textContent = word.slice(0, j + 1);
      j++;
      if (j === word.length) deleting = true;
    } else {
      el.textContent = word.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i++;
      }
    }
    setTimeout(type, deleting ? 90 : 160);
  }
  type();
})();

/* ===============================
   Animate Skill Bars on View
================================= */
const skillSection = document.getElementById('skills');
if (skillSection) {
  const skillBars = document.querySelectorAll('.skill-fill');
  const skillsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          skillBars.forEach((bar) => {
            // read inline width (e.g., "width:90%")
            const match = bar.getAttribute('style')?.match(/width:\s*([^;]+)/);
            if (match) {
              const targetWidth = match[1].trim();
              // reset then animate to target
              bar.style.width = '0%';
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  bar.style.width = targetWidth;
                });
              });
            }
          });
          skillsObs.unobserve(skillSection);
        }
      });
    },
    { threshold: 0.45 }
  );
  skillsObs.observe(skillSection);
}

// ----- Formspree AJAX submit -----
const form = document.getElementById('contact-form');
const msgOk = document.getElementById('form-success');
const msgErr = document.getElementById('form-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: stop bots
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) return;

    // Build payload
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        if (msgOk) { msgOk.style.display = 'block'; }
        if (msgErr) { msgErr.style.display = 'none'; }
        form.reset();
      } else {
        if (msgErr) { msgErr.style.display = 'block'; }
        if (msgOk) { msgOk.style.display = 'none'; }
      }
    } catch {
      if (msgErr) { msgErr.style.display = 'block'; }
      if (msgOk) { msgOk.style.display = 'none'; }
    }
  });
}


/* ===============================
   Projects: Calculator Preview Modal
================================= */
const overlay = document.getElementById('calc-overlay');
const modal = document.getElementById('calc-modal');
const iframe = modal ? modal.querySelector('iframe') : null;

/** Lock/unlock page scroll when modal is open */
function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
}

/** Open preview modal */
function openCalcPreview() {
  if (!overlay || !modal) return;
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
  lockScroll(true);

  // ensure iframe has correct src (helps if browser cleared it)
  if (iframe && !iframe.src) {
    iframe.src = 'https://calculatorbyaadi.netlify.app/';
  }

  // focus close button for accessibility
  const closeBtn = modal.querySelector('.btn-close');
  if (closeBtn) closeBtn.focus();
}

/** Close preview modal */
function closeCalcPreview() {
  if (!overlay || !modal) return;
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
  lockScroll(false);
}

// Close on overlay click
if (overlay) overlay.addEventListener('click', closeCalcPreview);

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeCalcPreview();
  }
});

// Expose to window for inline onclick handlers in HTML
window.openCalcPreview = openCalcPreview;
window.closeCalcPreview = closeCalcPreview;
