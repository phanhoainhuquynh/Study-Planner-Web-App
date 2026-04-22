const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');

let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

function saveTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

function updateStats() {
  totalTasks.textContent = tasks.length;
  const done = tasks.filter(task => task.completed).length;
  completedTasks.textContent = done;
  pendingTasks.textContent = tasks.length - done;
}

function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-state">No tasks yet. Add your first study task.</p>';
    updateStats();
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card ${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;

    card.innerHTML = `
      <div class="task-top">
        <div>
          <h3>${task.title}</h3>
          <p class="task-meta">Course: ${task.course}</p>
          <p class="task-meta">Due: ${task.dueDate}</p>
          <p class="task-meta">Priority: ${task.priority}</p>
        </div>
      </div>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleTask(${task.id})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(card);
  });

  updateStats();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    title: document.getElementById('title').value.trim(),
    course: document.getElementById('course').value.trim(),
    dueDate: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
