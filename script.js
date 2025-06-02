let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = 'all') {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "active" && task.completed) return;

    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span onclick="toggleComplete(${index})">${task.text}</span>
      <div>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    list.appendChild(li);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  input.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function toggleTheme() {
  const root = document.documentElement;
  const currentBg = getComputedStyle(root).getPropertyValue('--bg').trim();
  if (currentBg === '#1f1f1f') {
    root.style.setProperty('--bg', '#f9f9f9');
    root.style.setProperty('--text', '#1f1f1f');
    root.style.setProperty('--card', '#ffffff');
  } else {
    root.style.setProperty('--bg', '#1f1f1f');
    root.style.setProperty('--text', '#f0f0f0');
    root.style.setProperty('--card', '#2a2a2a');
  }
}

document.getElementById("add-btn").addEventListener("click", addTask);
window.onload = () => renderTasks();
