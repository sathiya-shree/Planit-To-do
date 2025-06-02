// ==========================
// Task Management
// ==========================

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
  updateCalendar();
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

// ==========================
// Quote of the Day
// ==========================

async function fetchQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quote-text").textContent = `"${data.content}"`;
    document.getElementById("quote-author").textContent = `— ${data.author}`;
  } catch {
    document.getElementById("quote-text").textContent = "Stay positive and keep planning!";
    document.getElementById("quote-author").textContent = "";
  }
}
fetchQuote();

// ==========================
// Productivity Tracker
// ==========================

function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function updateProductivity() {
  const today = getToday
::contentReference[oaicite:0]{index=0}
 
