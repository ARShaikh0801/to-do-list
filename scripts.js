document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const deletedTasksList = document.getElementById('deleted-tasks-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    function createTaskElement(taskText) {
        const listItem = document.createElement('li');
        const taskTextElement = document.createElement('span');
        const horizontalLine = document.createElement('hr');

        taskTextElement.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        listItem.appendChild(taskTextElement);
        listItem.appendChild(deleteBtn);

        taskList.appendChild(listItem);
        taskList.appendChild(horizontalLine);

        deleteBtn.addEventListener('click', function () {
            // Add to history before removing
            addToHistory(taskText);
            
            // Remove from main list
            taskList.removeChild(listItem);
            taskList.removeChild(horizontalLine);
        });

        taskTextElement.addEventListener('click', function () {
            taskTextElement.classList.toggle('task-completed');
        });
    }

    function addToHistory(taskText) {
        const historyItem = document.createElement('li');
        historyItem.classList.add('history-item');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('history-task');
        
        const timestamp = document.createElement('span');
        timestamp.textContent = new Date().toLocaleTimeString();
        timestamp.classList.add('timestamp');
        
        historyItem.appendChild(taskSpan);
        historyItem.appendChild(timestamp);
        
        deletedTasksList.appendChild(historyItem);
    }

    function clearHistory() {
        deletedTasksList.innerHTML = '';
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert("Please Enter A Task");
            return;
        }

        createTaskElement(taskText);
        taskInput.value = '';
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    
    clearHistoryBtn.addEventListener('click', clearHistory);
});