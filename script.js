let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const categorySelect = document.getElementById("category-select");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
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
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 400,
  });
  calendar.render();
});

// Journal Save
const journal = document.getElementById("daily-journal");
journal.value = localStorage.getItem("journal") || "";
journal.addEventListener("input", () => {
  localStorage.setItem("journal", journal.value);
});

// Init
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});
renderTasks();
