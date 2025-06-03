let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");
    li.addEventListener("click", () => toggleTask(index));
    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    delBtn.onclick = e => {
      e.stopPropagation();
      deleteTask(index);
    };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
  updateProductivity();
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false, date: getToday() });
  saveTasks();
  renderTasks();
  input.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].date = getToday();
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  let filtered = tasks;
  if (type === "active") filtered = tasks.filter(t => !t.completed);
  else if (type === "completed") filtered = tasks.filter(t => t.completed);

  taskList.innerHTML = "";
  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");
    li.addEventListener("click", () => toggleTask(index));
    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    delBtn.onclick = () => deleteTask(index);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function updateProductivity() {
  const today = getToday();
  const count = tasks.filter(t => t.completed && t.date === today).length;
  document.getElementById("tasks-today").textContent = count;
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = getComputedStyle(root).getPropertyValue("--bg") === "#1f1f1f";
  if (isDark) {
    root.style.setProperty("--bg", "#f4f4f4");
    root.style.setProperty("--text", "#1f1f1f");
    root.style.setProperty("--card", "#ffffff");
  } else {
    root.style.setProperty("--bg", "#1f1f1f");
    root.style.setProperty("--text", "#f0f0f0");
    root.style.setProperty("--card", "#2a2a2a");
  }
}

async function fetchQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quote-text").textContent = `"${data.content}" — ${data.author}`;
  } catch {
    document.getElementById("quote-text").textContent = "Stay focused. Keep going.";
  }
}

document.getElementById("get-started").addEventListener("click", () => {
  document.getElementById("welcome-screen").style.display = "none";
  document.querySelector(".container").style.display = "block";
  fetchQuote();
  renderTasks();
});
