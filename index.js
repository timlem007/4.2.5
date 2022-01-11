// Отрисовка страницы
const app = createElement("div", "app");
document.body.prepend(app);

const input = createElement("input", "input-data");
const inputBlockList = createElement("ul", "input-block-list");
const resultList = createElement("ul", "result-list");

app.append(input);
app.append(inputBlockList);
app.append(resultList);
// Функция создания элемента
function createElement(elementName, className) {
  const element = document.createElement(elementName);
  if (className) {
    element.classList.add(className);
  }
  return element;
}
// Создание выпадающего списка
async function searchList(event) {
  
  if (event.keyCode !== 32 && input.value !== '') {
    let add = await searchUsers(input.value);
    inputResultRemove();
    add.items.forEach((el) => {
      const inputList = createElement("li", "input-list");
      inputList.innerHTML = el.name;
      inputBlockList.append(inputList);

      inputList.addEventListener("click", {
        handleEvent: resultLists,
        name: el.name,
        full_name: el.full_name,
        stars: el.stargazers_count,
      });
    });
  } if (input.value === '') {
    inputResultRemove()
  }
}
// Создание списка результатов
function resultLists() {
  const resultListBlock = createElement("li", "result-list-block");
  const resultListBlockText = createElement("span", "result-list-block-text");
  const resultListBlockDivider = createElement( "span", "result-list-block-divider");
  // Слушатель события при клике по выпадающему списку
  resultListBlockDivider.addEventListener("click", {
    handleEvent: resultListShift,
    blockDelete: resultListBlock,
    el: resultListBlockDivider,
  });

  resultListBlockText.innerHTML = `Name: ${this.name}<br>Owner: ${this.full_name}<br>Stars: ${this.stars}`;

  inputResultRemove();
  input.value = "";

  resultList.append(resultListBlock);
  resultListBlock.append(resultListBlockText);
  resultListBlock.append(resultListBlockDivider);
}
// Функция удаления элемента результата
function resultListShift(e) {
  this.blockDelete.remove();
  this.el.removeEventListener("click", {
    handleEvent: resultListShift,
    blockDelete: this.blockDelete,
  });
}
// Функция очистки выпадающего списока
function inputResultRemove() {
  const inputResult = document.querySelectorAll(".input-list");
  inputResult.forEach((el) => {
    el.removeEventListener("click", {
      handleEvent: resultLists,
      name: el.name,
      full_name: el.full_name,
      stars: el.stargazers_count,
    });
    el.remove()
  });
}
// Запрос данных
async function searchUsers(text) {
  return await fetch(
    `https://api.github.com/search/repositories?q=${text}&per_page=5`
  ).then((res) => {
    if (res.ok) {
      return res.json().then(res);
    }
  });
}
// Слушатель события при вводе данных
input.addEventListener("keyup", debounce(searchList, 500));
// Задержка
function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
}