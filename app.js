const inputContainer = document.getElementById("input-container");
const taskList = document.getElementById("task-list");
const filterButtons = document.getElementById("filter-buttons");
const darkModeIcon = document.getElementById("dark-mode-icon");
const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

loadTasks();

inputContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

taskList.addEventListener("change", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const taskContainer = e.target.closest(".task-container");
    const taskTitle = taskContainer.querySelector(".task-title");
    taskTitle.classList.toggle("completed", e.target.checked); // ставим класс completed если чекбокс отмечен
    saveTasks();
  }
});

filterButtons.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const filter = e.target.dataset.filter;
    filterTasks(filter);
    filterButtons.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
  }
});

async function loadTasks() {
  const response = await fetch(API_URL);
  const data = await response.json();
  data.forEach((todo) => renderTasks(todo.title, todo.completed, false));
  loadLocalTasks();
}

function loadLocalTasks() {
  const localTasks = JSON.parse(localStorage.getItem("localTasks")) || [];
  console.log(localTasks);
  localTasks.forEach((todo) => renderTasks(todo.title, todo.completed, true));
}

function renderTasks(title, completed = false, local) {
  const taskContainer = document.createElement("li");
  taskContainer.className = "task-container";
  local
    ? taskContainer.classList.add("local-task")
    : taskContainer.classList.remove("local-task");
  const checkboxAndTitle = document.createElement("label");
  checkboxAndTitle.className = "checkbox-and-title";
  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  checkboxInput.className = "checkbox";
  checkboxInput.checked = completed;
  const taskTitle = document.createElement("span");
  taskTitle.className = "task-title";
  taskTitle.textContent = `${title}`;
  taskTitle.classList.toggle("completed", completed);
  checkboxAndTitle.appendChild(checkboxInput);
  checkboxAndTitle.appendChild(taskTitle);
  taskContainer.appendChild(checkboxAndTitle);
  const featuresDiv = document.createElement("div");
  featuresDiv.className = "features";
  const reminderIcon = document.createElement("img");
  reminderIcon.src = "reminder.svg";
  reminderIcon.className = "reminder-icon";
  reminderIcon.alt = "Set Reminder";
  featuresDiv.appendChild(reminderIcon);
  const removeButton = document.createElement("button");
  removeButton.className = "button remove-button";
  removeButton.textContent = "Удалить";
  removeButton.addEventListener("click", () => {
    taskList.removeChild(taskContainer);
    saveTasks();
    checkEmptyList();
  });
  featuresDiv.appendChild(removeButton);
  taskContainer.appendChild(featuresDiv);
  taskList.appendChild(taskContainer);
}

function addTask() {
  const input = document.getElementById("task-input");
  const title = input.value.trim();
  if (title) {
    renderTasks(title, false, true);
    input.value = "";
    saveTasks();
    checkEmptyList();
  }
}

// соханяем только локальные таски
function saveTasks() {
  const tasks = Array.from(taskList.querySelectorAll("li.local-task")).map(
    (task) => {
      const checkbox = task.querySelector(".checkbox");
      const title = task.querySelector(".task-title").textContent;
      return {
        title: title,
        completed: checkbox.checked,
      };
    }
  );
  localStorage.setItem("localTasks", JSON.stringify(tasks));
}

function checkEmptyList() {
  const noTasksIcon = document.getElementById("no-tasks-icon");
  if (taskList.querySelectorAll("li.task-container").length === 0) {
    noTasksIcon.style.display = "block"; // показываем иконку если нет задач
  } else {
    noTasksIcon.style.display = "none";
  }
}

darkModeIcon.addEventListener("click", () => {
  const h1Title = document.getElementById("title");
  const container = document.getElementById("container");
  const taskList = document.getElementById("task-list");
  const taskContainers = document.querySelectorAll(".task-container");
  document.body.classList.toggle("dark-mode");
  h1Title.classList.toggle("dark-mode");
  container.classList.toggle("dark-mode");
  taskList.classList.toggle("dark-mode");
  taskContainers.forEach((task) => {
    task.classList.toggle("dark-mode");
  });
  darkModeIcon.src = document.body.classList.contains("dark-mode")
    ? "light.svg"
    : "dark.svg";
});

function filterTasks(filter) {
  const tasks = taskList.querySelectorAll("li.task-container");
  tasks.forEach((task) => {
    const checkbox = task.querySelector(".checkbox");
    if (filter === "all") {
      task.style.display = "flex";
    } else if (filter === "completed") {
      task.style.display = checkbox.checked ? "flex" : "none";
    } else if (filter === "active") {
      task.style.display = checkbox.checked ? "none" : "flex";
    }
  });
}
