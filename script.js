const input = document.querySelector("input");
const statusItems = document.querySelectorAll(".status-container > span");
let taskContainer = document.querySelector(".task-container");
let todos = JSON.parse(localStorage.getItem("todo-list"));
!todos && (todos = []);

let editedTask;
let isEditing = false;

// Function to show task in UI
function showTask(status = "all") {
  let filteredTodos = todos.filter((taskItem) => {
    return status == "all" ? taskItem : taskItem.status == status;
  });
  let taskItems = "";
  filteredTodos.forEach((taskItem, index) => {
    taskItems += `
    <li>
      <label for="${index}">
        <input onClick="handleChecked(this)" type="checkbox" name="" id="${index}" ${
      taskItem.status == "completed" && "checked"
    } />
        <span class="${taskItem.status}">${taskItem.name}</span>
      </label>
      <div class="task-setting-container">
        <span>...</span>
        <div class="task-setting">
          <span onclick="editTask(${index})">Edit</span>
          <span onclick="deleteTask(${index})">Delete</span>
        </div>
      </div>
    </li>
    `;
  });
  taskContainer.innerHTML = taskItems;
  // let filteredTodos = todos.filter((taskItem) => taskItem.status == "pending");
  // console.log(todos);
  // console.log(filteredTodos);
}
showTask();

//function to set the to-do list on local storage
const setToLocal = () =>
  localStorage.setItem("todo-list", JSON.stringify(todos));

//after writing a task and hitting Enter, the task will be stored in the local storage and it is shown in the UI
input.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    if (!isEditing) {
      e.preventDefault();

      let taskInfo = { name: input.value, status: "pending" };
      todos.push(taskInfo);
      showTask();
      input.value = "";
    } else {
      editedTask.innerHTML = input.value;
      let editedTaskId = editedTask.previousElementSibling.id;
      todos[editedTaskId].name = editedTask.innerHTML;
      isEditing = false;
    }
    setToLocal();
  }
});

//when a user clicks a task to complete or pending
function handleChecked(selectedTask) {
  //when a task is checked, the status will be Completed
  todos[selectedTask.id].status = selectedTask.checked
    ? "completed"
    : "pending";

  let taskName = selectedTask.parentNode.lastElementChild;
  taskName.className = "";
  taskName.classList.add(todos[selectedTask.id].status);
  setToLocal();
}

//function to delete task
function deleteTask(id) {
  let selectedTask = document.getElementById(id);
  let selectedTaskContainer = selectedTask.parentNode.parentNode;
  selectedTaskContainer.remove();
  todos.splice(id, 1);
  setToLocal();
}

//function to edit task
function editTask(id) {
  isEditing = true;
  let selectedTask = document.getElementById(id);
  editedTask = selectedTask.nextElementSibling;
  input.value = editedTask.innerHTML;
  input.focus();
}

// -----Filtering section-----

//function for showing status
function showStatus() {
  statusItems.forEach((status) => status.classList.remove("active"));
  this.classList.add("active");
}

for (let status of statusItems) {
  status.addEventListener("click", showStatus.bind(status));
}

//function to clear all the tasks and show all
document.getElementById("status-all").addEventListener("click", function () {
  showTask();
});

//function to show pending tasks
document
  .getElementById("status-pending")
  .addEventListener("click", function () {
    showTask("pending");
  });

//function to show completed tasks
document
  .getElementById("status-completed")
  .addEventListener("click", function () {
    showTask("completed");
    setToLocal();
  });

//Clearing all the tasks
document.getElementById("status-clear").addEventListener("click", function () {
  taskContainer.innerHTML = "";
  todos = [];
  setToLocal();
});
