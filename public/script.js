const authPanel = document.getElementById("authPanel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");
const logoutButton = document.getElementById("logoutButton");
const userName = document.getElementById("userName");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filterSelect");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let currentUser = JSON.parse(localStorage.getItem("taskflowUser"));
let tasks = [];

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

function openDashboard(user) {
  currentUser = user;
  localStorage.setItem("taskflowUser", JSON.stringify(user));
  authPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  userName.textContent = user.name;
  loadTasks();
}

function openAuth() {
  localStorage.removeItem("taskflowUser");
  currentUser = null;
  dashboard.classList.add("hidden");
  authPanel.classList.remove("hidden");
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

async function loadTasks() {
  tasks = await apiRequest(`/api/tasks?userId=${currentUser.id}`);
  renderTasks();
}

function renderTasks() {
  const selectedFilter = filterSelect.value;
  const visibleTasks = tasks.filter((task) => {
    if (selectedFilter === "completed") {
      return task.completed;
    }

    if (selectedFilter === "pending") {
      return !task.completed;
    }

    return true;
  });

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter((task) => task.completed).length;
  pendingTasks.textContent = tasks.filter((task) => !task.completed).length;

  if (visibleTasks.length === 0) {
    taskList.innerHTML = `<p class="hint">No tasks found. Add your first task above.</p>`;
    return;
  }

  taskList.innerHTML = visibleTasks
    .map((task) => {
      return `
        <article class="task-card ${task.priority.toLowerCase()}-task ${task.completed ? "completed" : ""}">
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask('${task.id}', ${!task.completed})">
          <div>
            <h3>${task.title}</h3>
            <div class="task-meta">
              <span class="badge">Due: ${task.dueDate}</span>
              <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
          </div>
          <button class="delete-button" onclick="deleteTask('${task.id}')">Delete</button>
        </article>
      `;
    })
    .join("");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const user = await apiRequest("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
      })
    });

    openDashboard(user);
  } catch (error) {
    showMessage(error.message, true);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const user = await apiRequest("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
      })
    });

    openDashboard(user);
  } catch (error) {
    showMessage(error.message, true);
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  await apiRequest("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: currentUser.id,
      title: document.getElementById("taskTitle").value,
      dueDate: document.getElementById("taskDueDate").value,
      priority: document.getElementById("taskPriority").value
    })
  });

  taskForm.reset();
  document.getElementById("taskPriority").value = "Medium";
  loadTasks();
});

filterSelect.addEventListener("change", renderTasks);
logoutButton.addEventListener("click", openAuth);

async function toggleTask(taskId, completed) {
  await apiRequest(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });

  loadTasks();
}

async function deleteTask(taskId) {
  await apiRequest(`/api/tasks/${taskId}`, {
    method: "DELETE"
  });

  loadTasks();
}

if (currentUser) {
  openDashboard(currentUser);
}
