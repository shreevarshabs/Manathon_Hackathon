 
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const subject = document.getElementById("subject");
const deadline = document.getElementById("deadline");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterStatus = document.getElementById("filterStatus");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("smartStudentTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("smartStudentTasks", JSON.stringify(tasks));
}

function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

function renderTasks() {
    taskList.replaceChildren();

    const searchText = searchTask.value.trim().toLowerCase();
    const status = filterStatus.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.subject.toLowerCase().includes(searchText);

        const matchesStatus =
            status === "All" ||
            (status === "Completed" && task.completed) ||
            (status === "Pending" && !task.completed);

        return matchesSearch && matchesStatus;
    });

    if (filteredTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = tasks.length === 0
            ? "No tasks yet. Add your first study task!"
            : "No tasks match your search or filter.";
        taskList.appendChild(message);
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "task-item";
        if (task.completed) {
            card.classList.add("completed");
        }

        const info = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = task.title;

        const details = document.createElement("p");
        details.className = "task-details";
        details.textContent =
            `${task.subject} | Due: ${task.deadline} | Priority: ${task.priority}`;

        info.append(title, details);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(info, actions);
        taskList.appendChild(card);
    });

    updateSummary();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const taskSubject = subject.value.trim();
    const taskDeadline = deadline.value;

    if (!title || !taskSubject || !taskDeadline) {
        alert("Please fill in all required fields.");
        return;
    }

    tasks.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title,
        subject: taskSubject,
        deadline: taskDeadline,
        priority: priority.value,
        completed: false
    });

    saveTasks();
    taskForm.reset();
    priority.value = "Medium";
    renderTasks();
});

searchTask.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

renderTasks();
