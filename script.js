let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");

function renderTasks(filter = "") {
  taskList.innerHTML = "";
  tasks.filter(t => t.text.toLowerCase().includes(filter.toLowerCase())).forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.done ? "completed" : ""}" onclick="toggleComplete(${index})">
        ${task.text} [${task.tag}] (${task.date})
      </span>
      <button onclick="pinTask(${index})">📌</button>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = document.getElementById("task-input").value;
  const date = document.getElementById("task-date").value;
  const tag = document.getElementById("task-tag").value;
  if (text) {
    tasks.push({ text, date, tag, done: false });
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

renderTasks();
