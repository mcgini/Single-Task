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
        itemDiv.textContent = 'No tasks to display.';
    }
}

function setupSwipe() {
    const card = document.getElementById('taskCard');
    const doneOverlay = document.getElementById('doneOverlay');
    const nextOverlay = document.getElementById('nextOverlay');
    if (!card) return;

    let hammer = new Hammer(card);
    let isDragging = false;
    let startX = 0;

    hammer.on('panstart', function(ev) {
        isDragging = true;
        startX = ev.center.x;
        card.style.transition = 'none';
    });

    hammer.on('panmove', function(ev) {
        if (!isDragging) return;
        let deltaX = ev.center.x - startX;
        card.style.transform = `translateX(${deltaX}px)`;

        if (deltaX < 0) {
            doneOverlay.style.opacity = Math.min(-deltaX / 100, 1);
        } else {
            nextOverlay.style.opacity = Math.min(deltaX / 100, 1);
        }
    });

    hammer.on('panend', function(ev) {
        isDragging = false;
        card.style.transition = 'transform 0.3s ease-out';
        
        if (ev.deltaX < -100) {
            // Swipe left - mark as done
            todoItems.splice(currentItemIndex, 1);
            localStorage.setItem('todoItems', JSON.stringify(todoItems));
            if (currentItemIndex >= todoItems.length) {
                currentItemIndex = 0;
            }
        } else if (ev.deltaX > 100) {
            // Swipe right - next task
            currentItemIndex = (currentItemIndex + 1) % todoItems.length;
        }

        card.style.transform = 'translateX(0)';
        doneOverlay.style.opacity = 0;
        nextOverlay.style.opacity = 0;
        showCurrentItem();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderList();
    showCurrentItem();
    setupSwipe();
});