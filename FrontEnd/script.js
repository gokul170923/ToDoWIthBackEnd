const container = document.getElementById("container");
const editarea = document.querySelector(".editarea");
const workarea = document.querySelectorAll(".workarea");
const addBtn = document.querySelector("#addnewBtn");
const pendingBtn = document.querySelector("#pendingBtn");
const startedBtn = document.querySelector("#startedBtn");
const completedBtn = document.querySelector("#completedBtn");

// Clear all work areas and edit area
function ClearAll() {
    editarea.innerHTML = "";
    workarea.forEach(area => area.innerHTML = "");
}

// Show toast notification
function showToast(type, message) {
    const toast = document.querySelector(".toast");
    toast.textContent = message;
    toast.classList.add(type);
    setTimeout(() => toast.classList.remove(type), 2000);
}

// Fetch and display tasks for a specific status
async function fetchTasks(status, workareaIndex) {
    try {
        const response = await fetch(`http://localhost:3000/todo/${status}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const tasks = await response.json();
        const workArea = workarea[workareaIndex];
        workArea.innerHTML = "";
        if (tasks.length === 0) {
            workArea.innerHTML = "<div>No tasks found</div>";
            return;
        }
        tasks.forEach(task => {
            const topic = task.topic && task.topic !== "N/a" ? task.topic : "N/a";
            const duration = task.duration && task.duration !== "N/a" ? task.duration : "N/a";
            const amount = task.amount && task.amount !== "N/a" ? task.amount : "N/a";
            workArea.innerHTML += `
                <div class="task">
                    <div class="topic">${topic}</div>
                    <div>${task.task}</div>
                    <div class="taskLast">
                        <div>Duration: ${duration}</div>
                        <div>Amount: ${amount}</div>
                    </div>
                    <div class="extra">
                        <button class="eachBtn" id="editBtn" onclick="editTask(${task.id}, '${topic}', '${task.task}', '${duration}', '${amount}', ${status})"></button>
                        <button class="eachBtn" id="DelBtn" onclick="deleteTask(${task.id}, ${status})"></button>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Fetch tasks error:", error);
        showToast("error", "Failed to load tasks");
    }
}

// Add new task
addBtn.addEventListener("click", () => {
    container.className = "expanded-0";
    ClearAll();
    setTimeout(() => {
        editarea.innerHTML = `
            <fieldset id="task">
                <legend for="task">Add Task</legend>
                <label> Task* : 
                    <textarea name="task" id="tasktext" required></textarea>
                </label>
                <label> Topic :
                    <input type="text" name="topic" id="topictext" placeholder="N/a">
                </label>
                <label> Duration : 
                    <input type="text" name="duration" id="durationtext" placeholder="N/a">
                </label>
                <label> Amount : 
                    <input type="text" name="amount" id="amounttext" placeholder="N/a">
                </label>
                <div>
                    <button class="upperBtn" onclick="AddBtnSave()">Save</button>
                    <button class="upperBtn" onclick="AddBtnCancel()">Cancel</button>
                </div>
            </fieldset>`;
    }, 500);
});

async function AddBtnSave() {
    const taskText = document.querySelector("#tasktext").value.trim();
    const obj = {
        task: taskText,
        topic: document.querySelector("#topictext").value.trim() || "N/a",
        duration: document.querySelector("#durationtext").value.trim() || "N/a",
        amount: document.querySelector("#amounttext").value.trim() || "N/a"
    };
    if (!taskText) {
        showToast("error", "Task is required");
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/todo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showToast("saved", "Task added successfully");
        AddBtnCancel();
        fetchTasks(0, 1); // Refresh pending tasks
    } catch (error) {
        console.error("Add task error:", error);
        showToast("error", "Failed to add task");
    }
}

function AddBtnCancel() {
    ClearAll();
    fetchTasks(0, 1); // Show pending tasks after cancel
}

// Edit task
function editTask(id, topic, task, duration, amount, status) {
    container.className = `expanded-${status}`;
    ClearAll();
    setTimeout(() => {
        editarea.innerHTML = `
            <fieldset id="task">
                <legend for="task">Edit Task</legend>
                <label> Task* : 
                    <textarea name="task" id="tasktext" required>${task}</textarea>
                </label>
                <label> Topic :
                    <input type="text" name="topic" id="topictext" value="${topic}" placeholder="N/a">
                </label>
                <label> Duration : 
                    <input type="text" name="duration" id="durationtext" value="${duration}" placeholder="N/a">
                </label>
                <label> Amount : 
                    <input type="text" name="amount" id="amounttext" value="${amount}" placeholder="N/a">
                </label>
                <div>
                    <button class="upperBtn" onclick="saveEdit(${id}, ${status})">Save</button>
                    <button class="upperBtn" onclick="cancelEdit(${status})">Cancel</button>
                </div>
            </fieldset>`;
    }, 500);
}

async function saveEdit(id, status) {
    const taskText = document.querySelector("#tasktext").value.trim();
    const obj = {
        task: taskText,
        topic: document.querySelector("#topictext").value.trim() || "N/a",
        duration: document.querySelector("#durationtext").value.trim() || "N/a",
        amount: document.querySelector("#amounttext").value.trim() || "N/a",
        status: status
    };
    if (!taskText) {
        showToast("error", "Task is required");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/todo/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showToast("saved", "Task updated successfully");
        cancelEdit(status);
    } catch (error) {
        console.error("Edit task error:", error);
        showToast("error", "Failed to update task");
    }
}

function cancelEdit(status) {
    ClearAll();
    fetchTasks(status, status);
}

// Delete task
async function deleteTask(id, status) {
    try {
        const response = await fetch(`http://localhost:3000/todo/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showToast("saved", "Task deleted successfully");
        fetchTasks(status, status);
    } catch (error) {
        console.error("Delete task error:", error);
        showToast("error", "Failed to delete task");
    }
}

// Pending tasks (status 0)
pendingBtn.addEventListener("click", () => {
    container.className = "expanded-1";
    ClearAll();
    fetchTasks(0, 1);
});

// Started tasks (status 1)
startedBtn.addEventListener("click", () => {
    container.className = "expanded-2";
    ClearAll();
    fetchTasks(1, 2);
});

// Completed tasks (status 2)
completedBtn.addEventListener("click", () => {
    container.className = "expanded-3";
    ClearAll();
    fetchTasks(2, 3);
});
