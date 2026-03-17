/**
 * To-Do List Application
 * Features: Add, complete, delete tasks with localStorage persistence
 * and deleted-task history tracking.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const deletedTasksList = document.getElementById('deleted-tasks-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const emptyState = document.getElementById('empty-state');
    const emptyHistory = document.getElementById('empty-history');
    const taskCountEl = document.getElementById('task-count');

    // --- State ---
    let tasks = [];
    let history = [];

    // --- LocalStorage ---
    const TASKS_KEY = 'todo_tasks';
    const HISTORY_KEY = 'todo_history';

    function saveTasks() {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    function saveHistory() {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function loadData() {
        try {
            tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
            history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch {
            tasks = [];
            history = [];
        }
    }

    // --- Rendering ---
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = task.text;
            if (task.completed) span.classList.add('task-completed');

            span.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

            deleteBtn.addEventListener('click', () => {
                addToHistory(task.text);
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                renderHistory();
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        updateEmptyState();
        updateTaskCount();
    }

    function renderHistory() {
        deletedTasksList.innerHTML = '';
        history.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('history-item');

            const taskSpan = document.createElement('span');
            taskSpan.textContent = item.text;
            taskSpan.classList.add('history-task');

            const timestamp = document.createElement('span');
            timestamp.textContent = item.time;
            timestamp.classList.add('timestamp');

            li.appendChild(taskSpan);
            li.appendChild(timestamp);
            deletedTasksList.appendChild(li);
        });

        updateEmptyHistory();
    }

    // --- UI Helpers ---
    function updateEmptyState() {
        emptyState.classList.toggle('hidden', tasks.length > 0);
    }

    function updateEmptyHistory() {
        emptyHistory.classList.toggle('hidden', history.length > 0);
    }

    function updateTaskCount() {
        if (tasks.length === 0) {
            taskCountEl.textContent = '';
            return;
        }
        const completed = tasks.filter(t => t.completed).length;
        taskCountEl.textContent = `${completed}/${tasks.length} completed`;
    }

    // --- Actions ---
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) {
            taskInput.classList.add('shake');
            taskInput.addEventListener('animationend', () => {
                taskInput.classList.remove('shake');
            }, { once: true });
            taskInput.focus();
            return;
        }

        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    function addToHistory(taskText) {
        history.push({
            text: taskText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        saveHistory();
    }

    function clearHistory() {
        history = [];
        saveHistory();
        renderHistory();
    }

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') addTask();
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // --- Initialize ---
    loadData();
    renderTasks();
    renderHistory();
});