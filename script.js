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
    project: curr
