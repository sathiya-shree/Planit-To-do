// Starfield animation
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = Array(200).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.5,
  speed: Math.random() * 0.5 + 0.2
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// To-Do functionality
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const categorySelect = document.getElementById("category-select");
const journal = document.getElementById("daily-journal");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (
      filter === "active" && task.completed ||
      filter === "completed" && !task.completed
    ) return;

    const li = document.createElement("li");
    li.innerHTML = `<span>[${task.category}] ${task.text}</span>`;
    if (task.completed) li.classList.add("completed");

    li.onclick = () => toggleTask(index);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();
  const category = categorySelect.value;
  if (!text) return;
  tasks.push({ text, category, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

// Journal
journal.value = localStorage.getItem("journal") || "";
journal.addEventListener("input", () => {
  localStorage.setItem("journal", journal.value);
});

// Init
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => e.key === "Enter" && addTask());
renderTasks();
