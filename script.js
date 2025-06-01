let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || ["Default"];
let currentProject = "Default";

function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('projects', JSON.stringify(projects));
}

function addProject() {
  const input = document.getElementById("projectInput");
  const projectName = input.value.trim();
  if (projectName && !projects.includes(projectName)) {
    projects.push(projectName);
    input.value = "";
    updateProjectSelect();
    saveData();
  }
}

function updateProjectSelect() {
  const select = document.getElementById("projectSelect");
  select.innerHTML = "";
  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    if (p === currentProject) opt.selected = true;
    select.appendChild(opt);
  });
}

document.getElementById("projectSelect").addEventListener("change", (e) => {
  currentProject = e.target.value;
  displayTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate").value;
  const tagInput = document.getElementById("tagInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;

  const task = {
    text: taskInput.value,
    completed: false,
    date: dueDate,
    tag: tagInput,
    priority: priority,
    project: currentProject,
    pinned: false
  };

  if (task.text !== "") {
    tasks.push(task);
    taskInput.value = "";
    displayTasks();
    saveData();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
  saveData();
}

function deleteTask(index) {
  tasks.
