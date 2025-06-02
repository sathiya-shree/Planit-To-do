// Simple task list with categories
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const closeModalBtn = document.getElementById("close-modal");
const onboardingModal = document.getElementById("onboarding-modal");

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

closeModalBtn.addEventListener("click", () => {
  onboardingModal.style.display = "none";
});

// Task array and filter state
let tasks = [];
let filter = "all";

function addTask() {
  const taskText = taskInput.value.trim();
  const category = categorySelect.value;

  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    category,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `<span class="task-category">[${task.category}]</span> ${task.text} 
                    <button title="Delete task">&times;</button>`;

    li.querySelector("button").addEventListener("click", e => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    });

    li.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
}

// Theme toggle (dark/light)
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

// Initialize with sample tasks if needed
renderTasks();
