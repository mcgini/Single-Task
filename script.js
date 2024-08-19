let todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
let currentItemIndex = 0;

function addItem() {
    const newItem = document.getElementById('newItem').value;
    if (newItem) {
        todoItems.push(newItem);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        document.getElementById('newItem').value = '';
        renderList();
    }
}

function renderList() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todoItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editItem(index);
        li.appendChild(editButton);
        list.appendChild(li);
    });
}

function editItem(index) {
    const newItem = prompt('Edit your item:', todoItems[index]);
    if (newItem) {
        todoItems[index] = newItem;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        renderList();
    }
}

function showCurrentItem() {
    const itemDiv = document.getElementById('currentItem');
    if (todoItems.length > 0) {
        itemDiv.textContent = todoItems[currentItemIndex];
    } else {
        itemDiv.textContent = 'No items to display.';
    }
}

function handleSwipe(event) {
    if (event.deltaX > 0) {
        // Swipe right
        currentItemIndex = (currentItemIndex + 1) % todoItems.length;
    } else {
        // Swipe left
        todoItems.splice(currentItemIndex, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        if (currentItemIndex >= todoItems.length) {
            currentItemIndex = 0;
        }
    }
    showCurrentItem();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('todoList')) {
        renderList();
    }
    if (document.getElementById('currentItem')) {
        showCurrentItem();
        document.body.addEventListener('swiped', handleSwipe);
    }
});