let tasks = JSON.parse(localStorage.getItem('kb_tasks') || '[]');

const statuses = ['todo', 'doing', 'done'];

function save() { localStorage.setItem('kb_tasks', JSON.stringify(tasks)); }

function render() {
  statuses.forEach(status => {
    const list = document.getElementById(`list-${status}`);
    const items = tasks.filter(t => t.status === status);

    list.innerHTML = items.length ? '' : '<div class="empty-hint">Drop tasks here</div>';

    items.forEach(t => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.draggable = true;
      card.dataset.id = t.id;
      card.innerHTML = `
        <span class="task-text">${escape(t.text)}</span>
        <button class="task-delete" data-id="${t.id}">✕</button>
      `;
      list.appendChild(card);
    });

    document.getElementById(`count-${status}`).textContent = items.length;
  });

  document.getElementById('totalCount').textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;
}

function escape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.querySelectorAll('.add-row button').forEach(btn => {
  btn.addEventListener('click', () => addTask(btn.dataset.status));
});

document.querySelectorAll('.add-row input').forEach(input => {
  input.addEventListener('keydown', e => e.key === 'Enter' && addTask(input.dataset.status));
});

function addTask(status) {
  const input = document.querySelector(`.add-row input[data-status="${status}"]`);
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, status });
  input.value = '';
  save();
  render();
}

document.querySelectorAll('.cards').forEach(list => {
  list.addEventListener('click', e => {
    if (e.target.classList.contains('task-delete')) {
      const id = +e.target.dataset.id;
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }
  });

  list.addEventListener('dragstart', e => {
    if (!e.target.classList.contains('task-card')) return;
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
  });

  list.addEventListener('dragend', e => {
    if (e.target.classList.contains('task-card')) e.target.classList.remove('dragging');
  });
});

document.querySelectorAll('.column').forEach(col => {
  col.addEventListener('dragover', e => {
    e.preventDefault();
    col.classList.add('drag-over');
  });

  col.addEventListener('dragleave', () => col.classList.remove('drag-over'));

  col.addEventListener('drop', e => {
    e.preventDefault();
    col.classList.remove('drag-over');
    const id = +e.dataTransfer.getData('text/plain');
    const status = col.dataset.status;
    tasks = tasks.map(t => t.id === id ? { ...t, status } : t);
    save();
    render();
  });
});

render();
