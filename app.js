/* ===== Анимации (GSAP + ScrollTrigger) ===== */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  const mm = gsap.matchMedia();

  mm.add(
    {
      motionOK: '(prefers-reduced-motion: no-preference)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { reduceMotion } = ctx.conditions;

      if (reduceMotion) return; // без анимаций — контент виден сразу

      /* --- Hero: входной таймлайн --- */
      const hero = gsap.timeline();
      hero
        .from('.badge', { autoAlpha: 0, y: -16, duration: 0.6 })
        .from('.hero h1', { autoAlpha: 0, y: 34, duration: 0.9 }, '-=0.25')
        .from('.hero-sub', { autoAlpha: 0, y: 24 }, '-=0.5')
        .from('.hero-actions .btn', { autoAlpha: 0, y: 18, stagger: 0.12, duration: 0.6 }, '-=0.45')
        .from('.stats div', {
          autoAlpha: 0, y: 26, scale: 0.96,
          stagger: 0.1, duration: 0.6, ease: 'back.out(1.6)',
        }, '-=0.3');

      /* --- Параллакс свечений в hero --- */
      gsap.to('.glow-1', {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.glow-2', {
        yPercent: -25, xPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 },
      });

      /* --- Scroll-reveal: заголовки секций --- */
      gsap.utils.toArray('.eyebrow, main h2').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0, y: 24, duration: 0.7,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });

      /* --- Scroll-reveal: карточки/шаги/пункты батчами со стаггером --- */
      const batchTargets = ['.step', '.card', '.why-list li', '.contact-card'];
      batchTargets.forEach((sel) => {
        gsap.set(sel, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(sel, {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.to(els, {
            autoAlpha: 1, y: 0,
            stagger: 0.12, duration: 0.7, overwrite: true,
          }),
        });
      });

      /* --- Номера шагов: лёгкий «выстрел» --- */
      gsap.utils.toArray('.step-num').forEach((el) => {
        gsap.from(el, {
          scale: 0, rotation: -12, duration: 0.5, ease: 'back.out(2.2)',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    }
  );
}

/* ===== Год в подвале ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Форма заявки — отправка без перезагрузки и системных запросов ===== */
const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    statusEl.textContent = 'Заполните, пожалуйста, все поля.';
    statusEl.className = 'form-status err';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  statusEl.textContent = 'Отправляем…';
  statusEl.className = 'form-status';

  try {
    const res = await fetch('https://formsubmit.co/ajax/yasnypon@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
        _subject: 'Заявка с сайта AppFactory',
      }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    statusEl.textContent = 'Заявка отправлена! Ответим в течение рабочего дня.';
    statusEl.className = 'form-status ok';
    form.reset();
  } catch (err) {
    statusEl.textContent = 'Не получилось отправить. Напишите нам напрямую: yasnypon@gmail.com';
    statusEl.className = 'form-status err';
  } finally {
    btn.disabled = false;
  }
});
