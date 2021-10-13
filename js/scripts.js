const elForm = document.querySelector(".todo-form");
const elInputTodo = elForm.querySelector(".todo-input");
const elTodoList = document.querySelector(".todo-list");
const elTodoTemplate = document.querySelector("#todo-item--template").content;
const elAllCount = document.querySelector(".all-count");
const elCompletedCount = document.querySelector(".completed-count");
const elUncompletedCount = document.querySelector(".uncompleted-count");
const elCountsWrapper = document.querySelector(".count__wrapper");

const todosArr = JSON.parse(window.localStorage.getItem("todos")) || [];

function updateTodos() {
  window.localStorage.setItem("todos", JSON.stringify(todosArr));
  renderTodos(todosArr, elTodoList);
}


elCountsWrapper.addEventListener("click", (evt) => {
  if (evt.target.matches(".all-count__btn")) {
    renderCounts(todosArr);
    renderTodos(todosArr, elTodoList);
  }

  if (evt.target.matches(".completed-count__btn")) {
    const completedTodos = todosArr.filter((todo) => todo.isCompleted);

    renderCounts(todosArr);
    renderTodos(completedTodos, elTodoList);
  }

  if (evt.target.matches(".uncompleted-count__btn")) {
    const uncompletedTodos = todosArr.filter((todo) => !todo.isCompleted);

    renderCounts(todosArr);
    renderTodos(uncompletedTodos, elTodoList);
  }
});



function renderCounts(todosArr) {
  elAllCount.textContent = todosArr.length || 0;
  let completeCount = 0;

  todosArr.forEach((todo) => {
    if (todo.isCompleted) {
      completeCount++;
    }
  });

  elCompletedCount.textContent = completeCount;
  elUncompletedCount.textContent = todosArr.length - completeCount;
}

function handleDeleteTodo(evt) {
  const todoId = evt.target.dataset.todoId;

  const foundTodoIndex = todosArr.findIndex((item) => item.id == todoId);

  todosArr.splice(foundTodoIndex, 1);

  updateTodos();
  renderCounts(todosArr);
}

function handleCompleteTodo(evt) {
  const todoId = evt.target.dataset.todoId;

  const foundTodo = todosArr.find((item) => item.id == todoId);

  foundTodo.isCompleted = !foundTodo.isCompleted;

  updateTodos();
  renderCounts(todosArr);
}

function renderTodos(todosArr, element) {
  element.innerHTML = null;

  const todoFragmentList = document.createDocumentFragment();

  todosArr.forEach((todo) => {
    const todoTemplate = elTodoTemplate.cloneNode(true);

    const todoTitleSpan = todoTemplate.querySelector(
      ".todo-item-complete-text"
    );
    const todoDeleteBtn = todoTemplate.querySelector(".todo-item-delete-btn");
    const todoCompleteInput = todoTemplate.querySelector(
      ".todo-input-complete"
    );

    if (todo.isCompleted) {
      todoTitleSpan.classList.add("text-black");
      todoTitleSpan.style.textDecoration = "line-through";
    }

    todoTitleSpan.textContent = todo.title;
    todoDeleteBtn.dataset.todoId = todo.id;
    todoCompleteInput.dataset.todoId = todo.id;
    todoCompleteInput.checked = todo.isCompleted;



    todoDeleteBtn.addEventListener("click", handleDeleteTodo);
    todoCompleteInput.addEventListener("click", handleCompleteTodo);

    todoFragmentList.appendChild(todoTemplate);
  });

  element.appendChild(todoFragmentList);
}

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const inputTodo = elInputTodo.value.trim();

  const uniqueId = todosArr[todosArr.length - 1]
    ? todosArr[todosArr.length - 1].id
    : 0;

  todosArr.push({
    id: uniqueId + 1,
    title: inputTodo,
    isCompleted: false,
  });

  updateTodos();

  elInputTodo.value = null;
});

renderCounts(todosArr);
renderTodos(todosArr, elTodoList);
