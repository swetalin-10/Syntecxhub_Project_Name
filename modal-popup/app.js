const overlay = document.getElementById('overlay');

function openModal(name) {
  closeModal();
  document.getElementById('modal-' + name).classList.add('show');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

function handleSubmit(e) {
  e.preventDefault();
  closeModal();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
  e.target.reset();
}

document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
