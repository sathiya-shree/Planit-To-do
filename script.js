// Elements
const addProjectBtn = document.getElementById('addProjectBtn');
const projectInput = document.getElementById('projectInput');
const projectSelect = document.getElementById('projectSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const tagSelect = document.getElementById('tagSelect');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const toggleTheme = document.getElementById('toggle-theme');

// Projects
let projects = [];
let tasks = [];

addProjectBtn.addEventListener('click', () => {
  const project = projectInput.value.trim();
  if (project && !projects.includes(project)) {
    projects.push(project);
    const option = document.createElement('option');
    option.value = option.text = project;
    projectSelect.appendChild(option);
    projectInput.value = '';
  }
});

// Add task
addTaskBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const tag = tagSelect.value;
  const dueDate = dueDateInput.value;
  const project = projectSelect.value;

  if (task) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const span = document.createElement('span');
    span.textContent = `${task} (${dueDate || "No date"}) [${project || "No project"}]`;

    const tagSpan = document.createElement('span');
    tagSpan.className = `tag ${tag}`;
    tagSpan.textContent = tag;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = () => li.remove();

    li.append(checkbox, span, tagSpan, removeBtn);
    taskList.appendChild(li);

    taskInput.value = '';
    dueDateInput.value = '';
  }
});

// Search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll('#taskList li').forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
});

// Theme toggle
toggleTheme.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', toggleTheme.checked);
});
