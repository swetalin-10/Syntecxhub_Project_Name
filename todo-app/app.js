let tasks = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
let filter = 'all';

const input    = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const list     = document.getElementById('taskList');
const dateEl   = document.getElementById('date');

dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });

function save() { localStorage.setItem('tf_tasks', JSON.stringify(tasks)); }

function render() {
  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'completed' ? t.done : !t.done
  );

  list.innerHTML = filtered.length ? '' : '<div class="empty">No tasks here ✦</div>';

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.done ? ' completed' : '');
    li.innerHTML = `
      <div class="task-check ${t.done ? 'checked' : ''}" data-id="${t.id}"></div>
      <div class="priority-dot p-${t.priority}"></div>
      <span class="task-text">${escape(t.text)}</span>
      <button class="task-delete" data-id="${t.id}">✕</button>
    `;
    list.appendChild(li);
  });

  document.getElementById('total').textContent   = tasks.length;
  document.getElementById('done').textContent    = tasks.filter(t => t.done).length;
  document.getElementById('pending').textContent = tasks.filter(t => !t.done).length;
  document.getElementById('leftCount').textContent =
    `${tasks.filter(t => !t.done).length} task(s) remaining`;
}

function escape(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, priority: priority.value, done: false });
  input.value = '';
  save(); render();
}

document.getElementById('addBtn').addEventListener('click', addTask);
input.addEventListener('keydown', e => e.key === 'Enter' && addTask());

list.addEventListener('click', e => {
  const id = +e.target.dataset.id;
  if (e.target.classList.contains('task-check')) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    save(); render();
  }
  if (e.target.classList.contains('task-delete')) {
    tasks = tasks.filter(t => t.id !== id);
    save(); render();
  }
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    btn.classList.add('active');
    filter = btn.dataset.f;
    render();
  });
});

document.getElementById('clearDone').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save(); render();
});

render();
