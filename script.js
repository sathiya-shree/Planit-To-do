let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");

function renderTasks(filter = "") {
  taskList.innerHTML = "";
  tasks
    .filter(t => t.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add(`priority-${task.priority.toLowerCase()}`);
      li.innerHTML = `
        <div onclick="toggleComplete(${index})">
          <strong class="${task.done ? "completed" : ""}">${task.text}</strong>
          <div><small>#${task.tag} • ${task.date} • ${task.priority}</small></div>
        </div>
        <div>
          <button onclick="pinTask(${index})">📌</button>
          <button onclick="deleteTask(${index})">❌</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

function addTask() {
  const text = document.getElementById("task-input").value;
  const date = document.getElementById("task-date").value;
  const tag = document.getElementById("task-tag").value;
  const priority = document.getElementById("priority").value;
  if (text) {
    tasks.push({ text, date, tag, done: false, priority });
    saveTasks();
    renderTasks();
    document.getElementById("task-input").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-tag").value = "";
  }
}

function toggleComplete(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function pinTask(index) {
  const [task] = tasks.splice(index, 1);
  tasks.unshift(task);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("search").addEventListener("input", (e) => renderTasks(e.target.value));
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
document.getElementById("clear-completed").addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
});

renderTasks();
