/* Появление блоков при скролле */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Год в подвале */
document.getElementById('year').textContent = new Date().getFullYear();

/* Форма заявки — отправка без перезагрузки и без системных запросов */
const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async e => {
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
