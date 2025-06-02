// ==========================
// Task Management
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const categorySelect = document.getElementById("category-select");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="task-category">[${task.category}]</span> ${task.text}`;
    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", () => toggleTask(index));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  updateProductivity();
  updateCalendar();
}

function addTask() {
  const text = input.value.trim();
  const category = categorySelect.value;
  if (!text) return;
  tasks.push({ text, category, completed: false, date: getToday() });
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
    li.innerHTML = `<span class="task-category">[${task.category}]</span> ${task.text}`;
    if (task.completed) li.classList.add("completed");
    li.addEventListener("click", () => toggleTask(index));
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

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

renderTasks();

// ==========================
// Quote of the Day
// ==========================

async function fetchQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quote-text").textContent = `"${data.content}"`;
    document.getElementById("quote-author").textContent = `— ${data.author}`;
  } catch {
    document.getElementById("quote-text").textContent = "Stay positive and keep planning!";
    document.getElementById("quote-author").textContent = "";
  }
}
fetchQuote();

// ==========================
// Productivity Tracker
// ==========================

function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function updateProductivity() {
  const today = getToday();
  const completedToday = tasks.filter(t => t.completed && t.date === today);
  document.getElementById("tasks-today").textContent = completedToday.length;
}

// ==========================
// Onboarding Modal
// ==========================

const modal = document.getElementById("onboarding-modal");
const closeModal = document.getElementById("close-modal");

if (!localStorage.getItem("onboardingDone")) {
  modal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  localStorage.setItem("onboardingDone", "true");
});

// ==========================
// Daily Journal Save
// ==========================

const journal = document.getElementById("daily-journal");
const savedJournal = localStorage.getItem("dailyJournal");

if (savedJournal) journal.value = savedJournal;

journal.addEventListener("input", () => {
  localStorage.setItem("dailyJournal", journal.value);
});

// ==========================
// Calendar Integration
// ==========================

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: tasks
      .filter(task => task.completed)
      .map(task => ({
        title: task.text,
        date: task.date
      }))
  });
  calendar.render();
});

function updateCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (calendarEl && FullCalendar) {
    const calendar = FullCalendar.getCalendar(calendarEl);
    if (calendar) {
      calendar.removeAllEvents();
      tasks
        .filter(task => task.completed)
        .forEach(task => {
          calendar.addEvent({
            title: task.text,
            date: task.date
          });
        });
    }
  }
}

// ==========================
// Starfield Background
// ==========================

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.x += star.dx;
    star.y += star.dy;
    if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
  });
  requestAnimationFrame(animateStars);
}
animateStars();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
