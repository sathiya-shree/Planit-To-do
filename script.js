// Initial data keys for localStorage
const TASKS_KEY = 'planit_tasks';
const PROJECTS_KEY = 'planit_projects';
const THEME_KEY = 'planit_theme';

// Selectors
const projectInput = document.getElementById('projectInput');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectSelect = document.getElementById('projectSelect');

const taskInput = document.getElementById('taskInput');
const tagSelect = document.getElementById('tagSelect');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');

const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');

const toggleTheme = document.getElementById('toggle-theme');

let tasks = [];
let projects = [];
let currentProject = null;
let filteredTasks = [];

// Load saved projects from localStorage or start with default
function loadProjects() {
  const saved = localStorage.getItem(PROJECTS_KEY);
  if (saved) {
    projects = JSON.parse(saved);
  } else {
    projects = ['Default Project'];
    saveProjects();
  }
}

// Save projects to localStorage
function saveProjects() {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// Load saved tasks from localStorage or empty array
function loadTasks() {
  const saved = localStorage.getItem(TASKS_KEY);
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Populate projectSelect dropdown
function populateProjects() {
  projectSelect.innerHTML = '';
  projects.forEach((proj) => {
    const option = document.createElement('option');
    option.value = proj;
    option.textContent = proj;
    projectSelect.appendChild(option);
  });
  if (!currentProject || !projects.includes(currentProject)) {
    currentProject = projects[0];
  }
  projectSelect.value = currentProject;
}

// Add new project
function addProject() {
  const projectName = projectInput.value.trim();
  if (!projectName) {
    alert('Please enter a project name.');
    return;
  }
  if (projects.includes(projectName)) {
    alert('Project already exists.');
    return;
  }
  projects.push(projectName);
  saveProjects();
  populateProjects();
  currentProject = projectName;
  projectInput.value = '';
  renderTasks();
}

// Add new task
function addTask() {
  const taskName = taskInput.value.trim();
  const tag = tagSelect.value;
  const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : null;

  if (!taskName) {
    alert('Please enter a task name.');
    return;
  }
  if (!currentProject) {
    alert('Please select a project first.');
    return;
  }

  tasks.push({
    id: Date.now().toString(),
    name: taskName,
    tag: tag,
    dueDate: dueDate ? dueDate.toISOString() : null,
    completed: false,
    project: currentProject
  });

  saveTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  renderTasks();
}

// Render tasks filtered by currentProject and search input
function renderTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  filteredTasks = tasks.filter(
    (task) =>
      task.project === currentProject &&
      task.name.toLowerCase().includes(searchTerm)
  );

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; color:#888; font-style:italic;">
      No tasks found.
    </li>`;
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);

    // Checkbox for completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Task name with strikethrough if completed
    const taskNameSpan = document.createElement('span');
    taskNameSpan.textContent = task.name;
    if (task.completed) {
      taskNameSpan.style.textDecoration = 'line-through';
      taskNameSpan.style.color = '#999';
    }

    // Tag badge
    const tagSpan = document.createElement('span');
    tagSpan.textContent = task.tag;
    tagSpan.className = `tag ${task.tag}`;

    // Due date formatted
    const dueDateSpan = document.createElement('span');
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      dueDateSpan.textContent = `Due: ${date.toLocaleDateString()}`;
      dueDateSpan.style.marginLeft = '12px';
      dueDateSpan.style.fontSize = '0.85rem';
      dueDateSpan.style.color = '#555';
      if (task.completed) {
        dueDateSpan.style.color = '#999';
      }
    }

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.title = 'Remove Task';
    removeBtn.addEventListener('click', () => {
      if (confirm('Remove this task?')) {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
      }
    });

    li.appendChild(checkbox);
    li.appendChild(taskNameSpan);
    li.appendChild(tagSpan);
    if (task.dueDate) li.appendChild(dueDateSpan);
    li.appendChild(removeBtn);

    taskList.appendChild(li);
  });

  // Re-enable drag-and-drop after rendering
  enableDragDrop();
}

// Enable drag and drop sorting with SortableJS
function enableDragDrop() {
  Sortable.create(taskList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function (evt) {
      const itemEl = evt.item; 
      const movedId = itemEl.getAttribute('data-id');

      // Remove moved task from tasks array
      const movedTaskIndex = tasks.findIndex((t) => t.id === movedId);
      if (movedTaskIndex === -1) return;

      // Remove the moved task
      const [movedTask] = tasks.splice(movedTaskIndex, 1);

      // Find index of task after which it was dropped
      const newIndex = Array.from(taskList.children).indexOf(itemEl);

      // Find tasks of current project in order
      const currentTasks = tasks.filter((t) => t.project === currentProject);

      // Insert movedTask into correct position in all tasks
      // Find global index to insert at
      let globalInsertIndex = tasks.findIndex((t) => {
        // The first task that comes after newIndex in currentTasks list
        return t.project === currentProject && currentTasks.indexOf(t) === newIndex;
      });
      if (globalInsertIndex === -1) {
        // If dropped at end, push to the end
        tasks.push(movedTask);
      } else {
        tasks.splice(globalInsertIndex, 0, movedTask);
      }

      saveTasks();
      renderTasks();
    }
  });
}

// Change project event handler
projectSelect.addEventListener('change', () => {
  currentProject = projectSelect.value;
  renderTasks();
});

// Search input handler
searchInput.addEventListener('input', renderTasks);

// Add project button click
addProjectBtn.addEventListener('click', addProject);

// Add task button click
addTaskBtn.addEventListener('click', addTask);

// Enter key support for inputs
projectInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addProject();
});

taskInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addTask();
});

dueDateInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addTask();
});

// Theme toggle
function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark');
    toggleTheme.checked = true;
  } else {
    document.body.classList.remove('dark');
    toggleTheme.checked = false;
  }
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

toggleTheme.addEventListener('change', () => {
  if (toggleTheme.checked) {
    document.body.classList.add('dark');
    saveTheme('dark');
  } else {
    document.body.classList.remove('dark');
    saveTheme('light');
  }
});

// Initial load
loadProjects();
populateProjects();
loadTasks();
loadTheme();
renderTasks();
