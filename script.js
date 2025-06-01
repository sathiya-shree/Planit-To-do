// THEME
const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.getElementById("themeLabel");

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme");
  themeLabel.textContent = themeSwitch.checked ? "Dark Mode" : "Light Mode";
});

// TASKS
let tasks = [];
let projects = [];
let currentProject = "";

const taskList = document.getElementById("taskList");
const projectSelect = document.getElementById("projectSelect");

function addProject() {
  const input = document.getElementById("projectInput");
  const name = input.value.trim();
  if (!name || projects.includes(name)) return;
  projects.push(name);
  currentProject = name;
  renderProjects();
  input.value = "";
}

function renderProjects() {
  projectSelect.innerHTML = "";
  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = opt.text = p;
    projectSelect.appendChild(opt);
  });
  projectSelect.value = currentProject;
}

projectSelect.addEventListener("change", () => {
  currentProject = projectSelect.value;
  renderTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const tagInput = document.getElementById("tagInput");
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("prioritySelect").value;

  if (!taskInput.value.trim() || !currentProject) return;

  tasks.push({
    id: Date.now(),
    project: currentProject,
    text: taskInput.value.trim(),
    tag: tagInput.value.trim(),
    due: dueDate,
    priority,
    done: false
  });

  taskInput.value = tagInput.value = "";
  renderTasks();
}

function renderTasks() {
  const relevant = tasks.filter(t => t.project === currentProject);
  taskList.innerHTML = "";
  relevant.forEach(t => {
    const li = document.createElement("li");
    li.className = "task";
    li.draggable = true;
    li.dataset.id = t.id;

    li.innerHTML = `
      <span>
        <input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleTask(${t.id})"/>
        ${t.text} 
        ${t.tag ? `<span class="tag ${t.tag}">${t.tag}</span>` : ""}
        ${t.due ? `📅 ${t.due}` : ""}
      </span>
      <button onclick="removeTask(${t.id})">❌</button>
    `;

    addDragEvents(li);
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// DRAG AND DROP
let dragged;
function addDragEvents(item) {
  item.addEventListener("dragstart", () => {
    dragged = item;
    item.classList.add("dragging");
  });
  item.addEventListener("dragend", () => {
    dragged = null;
    item.classList.remove("dragging");
  });
  item.addEventListener("dragover", (e) => {
    e.preventDefault();
    const after = getDragAfterElement(taskList, e.clientY);
    if (after == null) {
      taskList.appendChild(dragged);
    } else {
      taskList.insertBefore(dragged, after);
    }
    reorderTasks();
  });
}

function getDragAfterElement(container, y) {
  const items = [...container.querySelectorAll(".task:not(.dragging)")];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reorderTasks() {
  const order = [...taskList.children].map(li => +li.dataset.id);
  tasks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

// BACKGROUND CANVAS ANIMATION (same as before)
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100,100,255,0.5)";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(animate);
}
animate();

// Initialize with default project
projects.push("Default");
currentProject = "Default";
renderProjects();
renderTasks();
