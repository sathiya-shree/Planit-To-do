
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const tagSelect = document.getElementById("tag-select");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} [${task.tag}]`;
    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", () => toggleTask(index));
    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    delBtn.onclick = e => {
      e.stopPropagation();
      deleteTask(index);
    };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();
  const tag = tagSelect.value;
  if (!text) return;
  tasks.push({ text, tag, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
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
    const filtered = tasks.filter(t => type === "active" ? !t.completed : t.completed);
    taskList.innerHTML = "";
    filtered.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = `${task.text} [${task.tag}]`;
      if (task.completed) li.classList.add("completed");
      li.addEventListener("click", () => toggleTask(index));
      const delBtn = document.createElement("button");
      delBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      delBtn.onclick = e => {
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

// Journal saving
document.getElementById("save-journal").addEventListener("click", () => {
  const journalText = document.getElementById("journal-input").value.trim();
  if (journalText) {
    alert("Journal saved!");
    document.getElementById("journal-input").value = "";
  }
});

// Random quote
const quotes = [
  "Believe in yourself.",
  "Every day is a second chance.",
  "Stay focused and never give up.",
  "Small steps every day.",
  "Progress, not perfection."
];
document.getElementById("quote-random").textContent = quotes[Math.floor(Math.random() * quotes.length)];
