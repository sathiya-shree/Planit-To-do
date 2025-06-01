let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || ["Default"];
let currentProject = projects[0];

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
    currentProject = projectName;
    displayTasks();
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
    select.appendChild(opt);
  });
  select.value = currentProject;
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
  const text = taskInput.value.trim();

  if (!text) {
    alert("Task cannot be empty!");
    return;
  }

  const task = {
    text,
    completed: false,
    date: dueDate,
    tag: tagInput,
    priority: priority,
    project: currentProject,
    pinned: false
  };

  tasks.push(task);
  taskInput.value = "";
  document.getElementById("tagInput").value = "";
  displayTasks();
  saveData();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
  saveData();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
  saveData();
}

function togglePin(index) {
  tasks[index].pinned = !tasks[index].pinned;
  displayTasks();
  saveData();
}

function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filtered = tasks.filter(task => task.project === currentProject);
  filtered.sort((a, b) => b.pinned - a.pinned);

  filtered.forEach(task => {
    const index = tasks.indexOf(task);
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <strong>${task.text}</strong>
      <small>📅 ${task.date || 'No date'} • 🔥 ${task.priority}</small>
      ${task.tag ? `<span class="tag tag-${task.tag}">${task.tag}</span>` : ""}
      <div>
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="togglePin(${index})">📌</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const filtered = tasks.filter(t => t.project === currentProject);
  const completed = filtered.filter(t => t.completed).length;
  const percent = filtered.length ? Math.round((completed / filtered.length) * 100) : 0;

  const bar = document.getElementById("progressFill");
  bar.style.width = percent + "%";
  bar.textContent = percent + "%";
}

// 🔄 Initialize App
updateProjectSelect();
displayTasks();
