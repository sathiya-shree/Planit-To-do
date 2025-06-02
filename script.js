// script.js

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const suggestionsList = document.getElementById("suggestions-list");
const productivityCanvas = document.getElementById("productivity-chart");
const ctx = productivityCanvas.getContext("2d");
const dailyTipEl = document.getElementById("daily-tip");
const quoteEl = document.getElementById("quote");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.className = task.completed ? "completed" : "";
    li.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
      updateProductivity();
      updateSuggestions();
    };
    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text.length === 0) return alert("Please enter a task.");
  tasks.push({ text, completed: false, date: new Date().toISOString().slice(0,10) });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  updateProductivity();
  updateSuggestions();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  updateProductivity();
  updateSuggestions();
}

// Productivity tracking for last 7 days
function getLast7Days() {
  let days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  return days;
}

function updateProductivity() {
  const last7Days = getLast7Days();
  const dailyCompleted = last7Days.map(day => {
    return tasks.filter(t => t.completed && t.date === day).length;
  });
  drawChart(last7Days, dailyCompleted);
}

function drawChart(days, counts) {
  const w = productivityCanvas.width;
  const h = productivityCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const margin = 30;
  const chartWidth = w - margin * 2;
  const chartHeight = h - margin * 2;

  const maxVal = Math.max(...counts, 1);

  // Axes
  ctx.strokeStyle = "#00f7ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, h - margin);
  ctx.lineTo(w - margin, h - margin);
  ctx.stroke();

  const barWidth = chartWidth / days.length * 0.6;
  ctx.fillStyle = "rgba(0, 255, 255, 0.6)";

  days.forEach((day, i) => {
    const barHeight = (counts[i] / maxVal) * chartHeight;
    const x = margin + i * (chartWidth / days.length) + (chartWidth / days.length - barWidth) / 2;
    const y = h - margin - barHeight;
    ctx.fillRect(x, y, barWidth, barHeight);

    const dayLabel = new Date(day).toLocaleDateString("en-US", { weekday: "short" });
    ctx.fillStyle = "#00f7ff";
    ctx.font = "12px Segoe UI";
    ctx.fillText(dayLabel, x, h - margin + 15);

    ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
  });
}

// Suggestions logic
const baseSuggestions = [
  "Review your calendar for upcoming meetings",
  "Prioritize tasks that took longer yesterday",
  "Set a 25-minute Pomodoro timer for deep work",
  "Take a 5-minute break every hour",
  "Tackle your hardest task first",
  "Clear your email inbox",
  "Plan tomorrow's top 3 tasks",
  "Organize your workspace for better focus",
  "Update your project progress",
  "Reflect on what slowed you down today"
];

function getSuggestions() {
  const today = new Date().getDay();
  const suggestions = [];

  if (today === 1) suggestions.push("Plan your week ahead!");
  if (today === 5) suggestions.push("Wrap up loose ends before weekend.");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0,10);

  const incompleteYesterday = tasks.filter(t => !t.completed && t.date === yesterdayStr).length;
  if (incompleteYesterday > 3) {
    suggestions.push("You have tasks pending from yesterday. Prioritize them.");
  }

  while (suggestions.length < 4) {
    const random = baseSuggestions[Math.floor(Math.random() * baseSuggestions.length)];
    if (!suggestions.includes(random)) suggestions.push(random);
  }

  return suggestions;
}

function updateSuggestions() {
  const suggestions = getSuggestions();
  suggestionsList.innerHTML = "";
  suggestions.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    suggestionsList.appendChild(li);
  });
}

// Daily tip and quote
const productivityTips = [
  "Focus on one task at a time for better results.",
  "Break big tasks into smaller, manageable chunks.",
  "Use a timer to maintain focus and avoid burnout.",
  "Eliminate distractions by turning off notifications.",
  "Take regular breaks to recharge your mind.",
  "Keep your workspace tidy to boost creativity.",
  "Set clear, achievable goals every day."
];

const quotes = [
  "“The secret of getting ahead is getting started.” – Mark Twain",
  "“Don’t watch the clock; do what it does. Keep going.” – Sam Levenson",
  "“Productivity is being able to do things that you were never able to do before.” – Franz Kafka",
  "“Start where you are. Use what you have. Do what you can.” – Arthur Ashe",
  "“Your limitation—it’s only your imagination.”",
  "“Push yourself, because no one else is going to do it for you.”",
  "“Great things never come from comfort zones.”"
];

function updateDailyTipAndQuote() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / (1000*60*60*24));
  dailyTipEl.textContent = productivityTips[dayOfYear % productivityTips.length];
  quoteEl.textContent = quotes[dayOfYear % quotes.length];
}

// Initialize
renderTasks();
updateProductivity();
updateSuggestions();
updateDailyTipAndQuote();
