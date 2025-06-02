let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const categorySelect = document.getElementById("category-select");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
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

  updateProductivity();
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

function filterTasks(type) {
  if (type === "all") renderTasks();
  else {
    const filtered = tasks.filter(t =>
      type === "active" ? !t.completed : t.completed
    );
    taskList.innerHTML = "";
    filtered.forEach((task, index) => {
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
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

renderTasks();

// =====================
// Quote of the Day
// =====================

async function fetchQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quote-text").textContent = `"${data.content}"`;
    document.getElementById("quote-author").textContent = `— ${data.author}`;
  } catch {
    // Hardcoded backup quote
    document.getElementById("quote-text").textContent = `"Success is not final, failure is not fatal: It is the courage to continue that counts."`;
    document.getElementById("quote-author").textContent = "— Winston Churchill";
  }
}
fetchQuote();

// =====================
// Productivity Tracker
// =====================

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function updateProductivity() {
  const today = getToday();
  const todayTasks = tasks.filter(t => t.completed && t.date === today);
  document.getElementById("tasks-today").textContent = todayTasks.length;
}

// =====================
// Journal Storage
// =====================

const journal = document.getElementById("daily-journal");
journal.value = localStorage.getItem("dailyJournal") || "";

journal.addEventListener("input", () => {
  localStorage.setItem("dailyJournal", journal.value);
});

// =====================
// Modal Behavior
// =====================

const modal = document.getElementById("onboarding-modal");
const closeBtn = document.getElementById("close-modal");
if (!localStorage.getItem("seenOnboarding")) {
  modal.style.display = "block";
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  localStorage.setItem("seenOnboarding", "true");
});
