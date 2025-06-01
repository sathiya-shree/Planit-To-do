// Data structure: { projects: { projectName: [ {taskObj}, ... ] } }

const projectInput = document.getElementById('projectInput');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectSelect = document.getElementById('projectSelect');
const taskInput = document.getElementById('taskInput');
const tagSelect = document.getElementById('tagSelect');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const toggleTheme = document.getElementById('toggle-theme');

let data = {
  projects: {}
};

let currentProject = null;

// Load data from localStorage
function loadData() {
  const saved = localStorage.getItem('planitData');
  if (saved) {
    data = JSON.parse(saved);
    if (Object.keys(data.projects).length) {
      currentProject = Object.keys(data.projects)[0];
    }
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('planitData', JSON.stringify(data));
}

// Populate project dropdown
function renderProjects() {
  projectSelect.innerHTML = '';
  for (let proj of Object.keys(data.projects)) {
    const opt = document.createElement('option');
    opt.value = proj;
    opt.textContent = proj;
    projectSelect.appendChild(opt);
  }
  projectSelect.value = currentProject;
}

// Render tasks for current project, filtered by search term
function renderTasks() {
  if (!currentProject || !data.projects[currentProject]) {
    taskList.innerHTML = '<li>No project selected.</li>';
    return;
  }
  const searchTerm = searchInput.value.toLowerCase();

  taskList.innerHTML = '';
  const tasks = data.projects[currentProject];

  tasks.forEach((task, index) => {
    // Filter by search term (task name or tag)
    if (
      task.name.toLowerCase().includes(searchTerm) ||
      task.tag.toLowerCase().includes(searchTerm)
    ) {
      const li = document.createElement('li');
      li.classList.add('task');
      li.setAttribute('data-id', index);

      li.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''}>
        <span>
          ${task.name}
          <span class="tag ${task.tag}">${task.tag}</span>
          <span>${task.dueDate ? '(' + task.dueDate + ')' : ''}</span>
        </span>
        <button class="remove-btn" title="Remove task">&times;</button>
      `;

      taskList.appendChild(li);
    }
  });
}

// Add new project
addProjectBtn.onclick = () => {
  const name = projectInput.value.trim();
  if (!name) return alert('Enter project name');
  if (data.projects[name]) return alert('Project already exists');
  data.projects[name] = [];
  currentProject = name;
  projectInput.value = '';
  saveData();
  renderProjects();
  renderTasks();
};

// Switch project
projectSelect.onchange = () => {
  currentProject = projectSelect.value;
  renderTasks();
};

// Add new task
addTaskBtn.onclick = () => {
  const name = taskInput.value.trim();
  const tag = tagSelect.value;
  const dueDate = dueDateInput.value;
  if (!name) return alert('Enter task name');
  if (!currentProject) return alert('Select a project');

  data.projects[currentProject].push({ name, tag, dueDate, done: false });
  taskInput.value = '';
  dueDateInput.value = '';
  saveData();
  renderTasks();
};

// Toggle task done and remove task
taskList.onclick = (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const id = e.target.parentElement.getAttribute('data-id');
    data.projects[currentProject][id].done = e.target.checked;
    saveData();
  }

  if (e.target.classList.contains('remove-btn')) {
    const id = e.target.parentElement.getAttribute('data-id');
    data.projects[currentProject].splice(id, 1);
    saveData();
    renderTasks();
  }
};

// Search filter
searchInput.oninput = () => {
  renderTasks();
};

// Drag-and-drop using SortableJS
new Sortable(taskList, {
  animation: 150,
  onEnd: (evt) => {
    if (!currentProject) return;
    const movedItem = data.projects[currentProject].splice(evt.oldIndex, 1)[0];
    data.projects[currentProject].splice(evt.newIndex, 0, movedItem);
    saveData();
    renderTasks();
  }
});

// Theme toggle & remember preference
function loadTheme() {
  const savedTheme = localStorage.getItem('planitTheme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleTheme.checked = true;
  } else {
    document.body.classList.remove('dark-theme');
    toggleTheme.checked = false;
  }
}

toggleTheme.onchange = () => {
  if (toggleTheme.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('planitTheme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('planitTheme', 'light');
  }
};

// Initialize app
function init() {
  loadData();
  renderProjects();
  loadTheme();
  renderTasks();
}

init();
