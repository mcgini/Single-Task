let todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
let currentItemIndex = 0;

function addItem() {
    const newItem = document.getElementById('newItem').value.trim();
    if (newItem) {
        todoItems.push(newItem);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        document.getElementById('newItem').value = '';
        renderList();
    }
}

function renderList() {
    const list = document.getElementById('todoList');
    if (!list) return;
    
    list.innerHTML = '';
    todoItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editItem(index);
        li.appendChild(editButton);
        list.appendChild(li);
    });
}

function editItem(index) {
    const newItem = prompt('Edit your item:', todoItems[index]);
    if (newItem !== null) {
        todoItems[index] = newItem.trim();
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        renderList();
    }
}

function showCurrentItem() {
    const itemDiv = document.getElementById('currentItem');
    if (!itemDiv) return;
    
    if (todoItems.length > 0) {
        itemDiv.textContent = todoItems[currentItemIndex];
    } else {
        itemDiv.textContent = 'No items to display.';
    }
}

function setupSwipe() {
    const element = document.getElementById('currentItem');
    if (!element) return;

    const hammer = new Hammer(element);
    hammer.on('swipeleft swiperight', function(ev) {
        if (ev.type === 'swipeleft') {
            // Mark as done (remove item)
            todoItems.splice(currentItemIndex, 1);
        } else if (ev.type === 'swiperight') {
            // View next item
            currentItemIndex = (currentItemIndex + 1) % todoItems.length;
        }
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        showCurrentItem();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderList();
    showCurrentItem();
    setupSwipe();
});