(function(){
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, done = false) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if(done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }
    //функция для перезаписывания localStorage
    function rewriteLocalStorage(title) {
        let itemsFromOtherPages = [];
        let savedItems = [];
        for (let i = 0; i < localStorage.length; i++) {
            savedItems[i] = JSON.parse(localStorage.getItem('item' + i));
            if (savedItems[i].itemIndex !== title){
                itemsFromOtherPages.push(savedItems[i]);
            }
        }
        console.log(localStorage.length);
        console.log(itemsFromOtherPages);

        localStorage.clear();
        let allItems = [];
        let allListItems = document.querySelectorAll('.list-group-item');
        for (let i = 0; i < allListItems.length; i++){
            if (allListItems[i].classList.contains('list-group-item-success')){
                let todoItem2 = {
                    nameOfItem: allListItems[i].firstChild.textContent,
                    done: true,
                    itemIndex: title,
                }
                allItems[i] = todoItem2;
            }else{
                let todoItem2 = {
                    nameOfItem: allListItems[i].firstChild.textContent,
                    done: false,
                    itemIndex: title,
                }
                allItems[i] = todoItem2;
            }
        }

        let result = [...allItems, ...itemsFromOtherPages];

        for (let i = 0; i < result.length; i++){
            localStorage.setItem('item' + i, JSON.stringify(result[i]));
        }
        
    }

    function createTodoApp(container, title='Мои дела', todos = []) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        input = todoItemForm.input;
        button = todoItemForm.button;
        button.setAttribute("disabled", "disabled");

        //считывание заметок из памяти при запуске
        let savedItems = [];
        for (let i = 0; i < localStorage.length; i++) {
            savedItems[i] = JSON.parse(localStorage.getItem('item' + i));
            let items = createTodoItem(savedItems[i].nameOfItem, savedItems[i].done);
            
            items.doneButton.addEventListener('click', function() {
                items.item.classList.toggle('list-group-item-success');
                rewriteLocalStorage(title);
            });
    
            items.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    items.item.remove();
                    rewriteLocalStorage(title);
                }
            });
            if (savedItems[i].itemIndex === title) {
                todoList.append(items.item);
            }
        }

        input.addEventListener('input', ()=>{
            if(!input.value){
                button.disabled = true;
            }
            else {
                button.disabled = false;
            }
        });

        //добавление заметок из массива задание 1.2(массив todos)
        for (let i = 0; i < todos.length; i++) {
            let items = createTodoItem(todos[i].name, todos[i].done);
            
            items.doneButton.addEventListener('click', function() {
                items.item.classList.toggle('list-group-item-success');
            });

            items.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    items.item.remove();
                }
            });
            todoList.append(items.item);
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    todoItem.item.remove();
                }
            });

            todoList.append(todoItem.item);
            rewriteLocalStorage(title);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }
    window.createTodoApp = createTodoApp;
    window.createTodoItem = createTodoItem;
})();