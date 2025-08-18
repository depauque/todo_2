const inputContainer = document.getElementById("input-container");
const taskList = document.getElementById("task-list");
const filterButtons = document.getElementById("filter-buttons");

inputContainer.addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

function addTask() {
  const input = document.getElementById("task-input");
  const name = input.value.trim();
  if (name) {
    const taskContainer = document.createElement("div");
    taskContainer.className = "task-container";
    const checkboxAndTitle = document.createElement("label");
    checkboxAndTitle.className = "checkbox-and-title";
    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.className = "checkbox";
    const taskTitle = document.createElement("li");
    taskTitle.className = "task-title";
    taskTitle.textContent = `${taskList.children.length + 1}. ${name}`;
    checkboxAndTitle.appendChild(checkboxInput);
    checkboxAndTitle.appendChild(taskTitle);
    console.log(taskTitle);
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
    removeButton.addEventListener("click", function () {
      taskList.removeChild(taskContainer);
    });
    featuresDiv.appendChild(removeButton);
    taskContainer.appendChild(featuresDiv);
    taskList.appendChild(taskContainer);
    input.value = "";
    renderTasks();
  }
}

function renderTasks() {}
