const tabs   = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`panel-${target}`).classList.add('active');
  });
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('nameInput').value.trim();
  const email   = document.getElementById('emailInput').value.trim();
  const message = document.getElementById('msgInput').value.trim();

  if (!name || !email || !message) return;

  const success = document.getElementById('formSuccess');
  success.classList.remove('hidden');
  e.target.reset();

  setTimeout(() => success.classList.add('hidden'), 5000);
});
