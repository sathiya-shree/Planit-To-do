// Keep your data model

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
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

let data = { projects: {} };
let currentProject = null;

function loadData() {
  const saved = localStorage.getItem('planitData');
  if (saved) {
    data = JSON.parse(saved);
    if (Object.keys(data.projects).length > 0) {
      currentProject = Object.keys(data.projects)[0];
    }
  }
}

function saveData() {
  localStorage.setItem('planitData', JSON.stringify(data));
}

function renderProjects() {
  projectSelect.innerHTML = '';
  for (const proj of Object.keys(data.projects)) {
    const opt = document.createElement('option');
    opt.value = proj;
    opt.textContent = proj;
    projectSelect.appendChild(opt);
  }
  if (currentProject) {
    projectSelect.value = currentProject;
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  if (!currentProject || !data.projects[currentProject]) return;

  const searchTerm = searchInput.value.trim().toLowerCase();

  for (const [index, task] of data.projects[currentProject].entries()) {
    if (searchTerm && !task.name.toLowerCase().includes(searchTerm)) continue;

    const li = document.createElement('li');
    li.dataset.index = index;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveData();
      renderTasks();
    });

    const taskName = document.createElement('span');
    taskName.textContent = task.name;
    if (task.done) {
      taskName.style.textDecoration = 'line-through';
      taskName.style.opacity = '0.6';
    }

    const tag = document.createElement('span');
    tag.textContent = task.tag;
    tag.classList.add('tag', task.tag);

    const dueDate = document.createElement('small');
    if (task.dueDate) {
      dueDate.textContent = ' - ' + new Date(task.dueDate).toLocaleDateString();
      dueDate.style.marginLeft = '10px';
      dueDate.style.fontSize = '0.8rem';
      dueDate.style.color = 'gray';
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', () => {
      data.projects[currentProject].splice(index, 1);
      saveData();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskName);
    li.appendChild(tag);
    li.appendChild(dueDate);
    li.appendChild(removeBtn);

    taskList.appendChild(li);
  }
}

function addProject() {
  const name = projectInput.value.trim();
  if (!name) return alert('Project name cannot be empty');
  if (data.projects[name]) return alert('Project already exists');

  data.projects[name] = [];
  currentProject = name;
  projectInput.value = '';
  saveData();
  renderProjects();
  renderTasks();
}

function addTask() {
  const name = taskInput.value.trim();
  if (!name) return alert('Task name cannot be empty');
  if (!currentProject) return alert('No project selected');

  const task = {
    name,
    tag: tagSelect.value,
    done: false,
    dueDate: dueDateInput.value || null,
  };

  data.projects[currentProject].push(task);
  taskInput.value = '';
  dueDateInput.value = '';
  saveData();
  renderTasks();
}

// Event Listeners
addProjectBtn.addEventListener('click', addProject);
addTaskBtn.addEventListener('click', addTask);
projectSelect.addEventListener('change', () => {
  currentProject = projectSelect.value;
  renderTasks();
});
searchInput.addEventListener('input', renderTasks);

// SortableJS for drag & drop reorder
const sortable = new Sortable(taskList, {
  animation: 150,
  onEnd: (evt) => {
    if (!currentProject) return;
    const list = data.projects[currentProject];
    const [movedItem] = list.splice(evt.oldIndex, 1);
    list.splice(evt.newIndex, 0, movedItem);
    saveData();
    renderTasks();
  },
});

// Theme toggle & persistence
function loadTheme() {
  const savedTheme = localStorage.getItem('planitTheme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleTheme.checked = true;
  } else {
    document.body.classList.remove('dark-theme');
    toggleTheme.checked = false;
  }
}

toggleTheme.addEventListener('change', () => {
  if (toggleTheme.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('planitTheme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('planitTheme', 'light');
  }
});

loadData();
renderProjects();
renderTasks();
loadTheme();
