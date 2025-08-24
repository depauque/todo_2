const inputContainer = document.getElementById("input-container");
const taskList = document.getElementById("task-list");
const filterButtons = document.getElementById("filter-buttons");
const darkModeIcon = document.getElementById("dark-mode-icon");

loadTasks();

if (localStorage.getItem("theme") === "dark") {
  toggleDarkMode();
}

inputContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

taskList.addEventListener("change", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const taskContainer = e.target.closest(".task-container");
    const taskTitle = taskContainer.querySelector(".task-title");
    taskTitle.classList.toggle("completed", e.target.checked);
    saveTasks();
  }
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-icon")) {
    const taskContainer = e.target.closest(".task-container");
    const taskTitleElement = taskContainer.querySelector(".task-title");
    const currentTitle = taskTitleElement.textContent;
    const newTitle = prompt("Редактировать задачу:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
      taskTitleElement.textContent = newTitle.trim();
      saveTasks();
    }
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

darkModeIcon.addEventListener("click", () => toggleDarkMode());

function loadTasks() {
  const localTasks = JSON.parse(localStorage.getItem("localTasks")) || [];
  localTasks.forEach((todo) => renderTasks(todo.title, todo.completed, true));
  checkEmptyList();
}

function renderTasks(title, completed = false, local) {
  const taskContainer = document.createElement("li");
  taskContainer.className = document.body.classList.contains("dark-mode")
    ? "task-container dark-mode"
    : "task-container";
  if (local) {
    taskContainer.classList.add("local-task");
  }
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
  const editIcon = document.createElement("img");
  editIcon.src = "edit.svg";
  editIcon.className = "edit-icon";
  editIcon.alt = "Edit task";
  featuresDiv.appendChild(editIcon);
  const removeButton = document.createElement("button");
  removeButton.className = "button remove-button";
  removeButton.addEventListener("click", () => {
    taskList.removeChild(taskContainer);
    saveTasks();
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
  }
}

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
  checkEmptyList();
}

function checkEmptyList() {
  const noTasksIcon = document.getElementById("no-tasks-icon");
  if (taskList.querySelectorAll("li.task-container").length === 0) {
    noTasksIcon.style.display = "block";
  } else {
    noTasksIcon.style.display = "none";
  }
}

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

function toggleDarkMode() {
  const h1Title = document.getElementById("title");
  const container = document.getElementById("container");
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
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}
