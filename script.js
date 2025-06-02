let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const categorySelect = document.getElementById("category-select");
const journal = document.getElementById("daily-journal");
const onboardingModal = document.getElementById("onboarding-modal");
const closeModalBtn = document.getElementById("close-modal");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "active") filteredTasks = tasks.filter(t => !t.completed);
  else if (filter === "completed") filteredTasks = tasks.filter(t => t.completed);

  filteredTasks.forEach((task, index) => {
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

function filterTasks(filter) {
  renderTasks(filter);
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  // Optional: Save theme preference
}

// Journal save/load
function setupJournal() {
  journal.value = localStorage.getItem("journal") || "";
  journal.addEventListener("input", () => {
    localStorage.setItem("journal", journal.value);
  });
}

// Onboarding Modal
function setupModal() {
  const shownBefore = localStorage.getItem("onboardingShown");
  if (!shownBefore) {
    onboardingModal.style.display = "flex";
  }

  closeModalBtn.addEventListener("click", () => {
    onboardingModal.style.display = "none";
    localStorage.setItem("onboardingShown", "true");
  });
}

document.addEventListener('DOMContentLoaded', function () {
  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });

  setupJournal();
  setupModal();
  renderTasks();
});
