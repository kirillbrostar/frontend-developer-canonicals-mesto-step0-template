// Находим все поп-апы
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Находим элементы формы редактирования профиля
const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

// Находим элементы формы добавления карточки
const cardFormElement = document.querySelector('.popup__form[name="new-place"]');

// Универсальные функции для открытия и закрытия поп-апов
function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}

// Функция для создания карточки
function createCard(name, link) {
  const template = document.getElementById('card-template');
  const cardClone = template.content.cloneNode(true);

  const cardImage = cardClone.querySelector('.card__image');
  const cardTitle = cardClone.querySelector('.card__title');
  const cardLikeButton = cardClone.querySelector('.card__like-button');
  const cardDeleteButton = cardClone.querySelector('.card__delete-button');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Обработчик для лайка
  cardLikeButton.addEventListener('click', () => {
    cardLikeButton.classList.toggle('card__like-button_active');
  });

  // Обработчик для удаления карточки
  cardDeleteButton.addEventListener('click', () => {
    const cardElement = cardDeleteButton.closest('.card'); // находит карточку родителя в дом элементах closest- ищет ближайшую карточку родителя в нашем случаи это card
    cardElement.remove();
  });

  // Обработчик для открытия поп-апа с изображением
  cardImage.addEventListener('click', () => {
    imagePopup.querySelector('.popup__image').src = link;
    imagePopup.querySelector('.popup__image').alt = name;
    imagePopup.querySelector('.popup__caption').textContent = name;
    openModal(imagePopup);
  });

  return cardClone;
}

// Функция для заполнения полей формы редактирования профиля
function fillProfileForm() {
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;
  openModal(profilePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const newName = nameInput.value;
  const newJob = jobInput.value;

  document.querySelector('.profile__title').textContent = newName;
  document.querySelector('.profile__description').textContent = newJob;

  closeModal(profilePopup);
}


// Обработчик отправки формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const cardName = cardFormElement.querySelector('.popup__input_type_card-name').value;
  const cardLink = cardFormElement.querySelector('.popup__input_type_url').value;

  const newCard = createCard(cardName, cardLink);
  document.querySelector('.places__list').prepend(newCard);

  closeModal(cardPopup);
}

// Открытие и закрытие поп-апов
document.querySelector('.profile__edit-button').addEventListener('click', fillProfileForm);
document.querySelector('.profile__add-button').addEventListener('click', () => {
  cardFormElement.reset();
  openModal(cardPopup);
});

profilePopup.querySelector('.popup__close').addEventListener('click', () => {
  closeModal(profilePopup);
});

cardPopup.querySelector('.popup__close').addEventListener('click', () => {
  closeModal(cardPopup);
});

imagePopup.querySelector('.popup__close').addEventListener('click', () => {
  closeModal(imagePopup);
});

// Прикрепляем обработчики к формам
profileFormElement.addEventListener('submit', handleProfileFormSubmit);
cardFormElement.addEventListener('submit', handleCardFormSubmit);


function validateInput(input, errorElement, minLength, maxLength) {  // создается функция с входными параментами 1 это поле ввода 2 это сообщение об ошибке 3 минимальное количество символов 4 максимальное количество символов
  if (input.validity.valueMissing) {// input.validity.valueMissing проверяется если свойство обьекта которое проверяется пустое ли поле и если поля пустое выполняется действия из блока if 
    errorElement.textContent = 'Это поле обязательно для заполнения.'; // если поля пустое выводится текст textContent
    errorElement.classList.add('popup__error_visible');//и выполняется добавление класса которое выводится сообщение об ошибке 
    return false; // данная строка означается что поля не прошла валидность
  } else if (input.type ==="text" && (input.validity.tooShort || input.validity.tooLong)) {// данная строка проверяется input.type ==="text" являетли тип элемента в поле ввода текстовым и  на минимальную input.validity.tooShort и максимальную длину input.validity.tooLong если хоть одно свойство выполняется программа выполнит else if 
    errorElement.textContent = `Должно быть от ${minLength} до ${maxLength} символов.`; // и выполняется заполнение текстом информацией 
    errorElement.classList.add('popup__error_visible'); //и выполняется добавление класса которое выводится сообщение об ошибке 
    return false;// данная строка означается что поля не прошла валидность
  } else if (input.type === 'url' && input.validity.typeMismatch){ // проверяет введена ли url сссылка ,а input.valid.typeMismatch проверяет правильность введеной ссылки
    errorElement.textContent ='Введите корректный URL.';//выводит ошибку о не правильном вводе url
    errorElement.classList.add('popup__error_visible')
    return false;
  } else {
    errorElement.textContent = ''; //выполняется очищение поля errorElement которое ранее выводила ошибку или не выводило 
    errorElement.classList.remove('popup__error_visible');//удаляется класс с ошибкой которое ранее выводила ошибку
    return true;// данная строка означается что поля  прошла валидность
  }
}


function toggleButtonState(button, isFormValid) { // это функция принимает на вход кнопку и проверку на валидноть 
  if (isFormValid) {//проверяет прошла ли форма валидность 
    button.disabled = false; // если прошла делает кнопку активной 
  } else { //если форма не прошла валидность 
    button.disabled = true; // если не прошла делает кнопку неактивной 
  }
}

function setEventListeners(form) { //функция принимает парамент форму для которой нужно построить обработчик события 
  const inputs = form.querySelectorAll('.popup__input'); //находит все элементы в форме с классом .popup__input
  const button = form.querySelector('.popup__button');//находит все элементы в форме с классом .popup__button кнопка сохранения
  inputs.forEach(input => { //перебирает все элементы в inputs с помощью forEach и выполняется код внутри функции 
    input.addEventListener('input', () => { //добавляем обработчик события input для текущего поля ввода и это событие срабатывает каждый раз когда чтото изменятся в нем допустим при наборе текста 
      const errorElement = form.querySelector(`#${input.name}-error`);//находит все элементы в forme которые имею id - error 
      const isInputValid = validateInput(input, errorElement, input.minLength, input.maxLength); //это строка проверяет прошло ли поле ввода валидность 
      const isFormValid = Array.from(inputs).every(input => input.validity.valid);//превращает inputs в массив и проверяет прошло ли поле валидацию и возвращает true если все поля прошли проверку
      toggleButtonState(button, isFormValid);//вызывает функцию активацию или деактивации кнопки 
    });
  });
}

document.querySelectorAll('.popup__form').forEach(form => {// находит все формы с классом popup__form и перебирает ее с помощью forEach
  setEventListeners(form);//принимает к ним вызов функции setEventListeners для проверки одновременно двух и более полей ввода 
});

const newCard = document.querySelector('form[name="new-place"]');//находит форму и принимает к ней обработчик событий чтобы если что то введено не верно не сохранять карточку и заблокировать кнопку 
setEventListeners(newCard);


function closePopup(popup) {
  popup.classList.remove('popup_is-opened'); // Удаляем правильный класс
}

function handleOverlayClick(event) { // данная функция вызывает при клике на попан она проверяет был ли клик на оверплан если был закрывает попан
  const overlay = event.target.closest('.popup__overlay'); // это рамка вокруг контейнера метод closest ищет родительский элемент оверлейта и если был клик не по оверлейту вернет null
  const content = event.target.closest('.popup__content');//это контейнер метод closest ищет родительский элемент контента и если был клик не по контенту вернет null
  // и в общем метод closest ищет элемент родителя и если это не он возвращает null 
  if (overlay && !content) { // Закрываем попап только при клике на оверлей, но не на контент и если был клик на overlay он закроет попан 
    closePopup(event.currentTarget);//event.currentTarget это элемент, на котором висит обработчик события (в данном случае — попап) closePopup вызывает для закрытия попана
  }
}

// Добавляем обработчик клика на все попапы
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', handleOverlayClick);
});


// //Функция setEventListeners настраивает обработчики событий для всех полей ввода внутри формы. Вот что происходит:
// Настройка обработчиков событий:
// Для каждого поля ввода добавляется обработчик события input, который срабатывает при изменении значения в поле.
// Валидация поля:
// При каждом изменении значения в поле вызывается функция validateInput, которая проверяет, прошло ли поле валидацию.
// Если поле не прошло валидацию, отображается сообщение об ошибке.
// Проверка валидности всей формы:
// После проверки каждого поля проверяется валидность всей формы с помощью метода every.
// Если все поля прошли валидацию, форма считается валидной.
// Управление состоянием кнопки:
// В зависимости от валидности формы кнопка «Сохранить» становится активной или неактивной с помощью функции toggleButtonState.



// // Находим все поп-апы
// const profilePopup = document.querySelector('.popup_type_edit'); //редактирование профиля
// const cardPopup = document.querySelector('.popup_type_new-card'); //добавления карточки 
// const imagePopup = document.querySelector('.popup_type_image'); //изображением
// // Универсальные функции для открытия и закрытия поп-апов
// function openModal(popup) {
//   popup.classList.add('popup_is-opened') //принимает в качестве аргумента поп-ап и добавляет ему класс 
// }

// function closeModal(popup) {
//   popup.classList.remove('popup_is-opened')//принимает в качестве аргумента поп-ап и удаляет ему класс
// }

// // Функция создания карточки
// function createCard(name,link){ //создание функции которая создает карточки и примает в качестве аргумента имя карточки и ее ссылку
//  const template = document.getElementById('card-template');//находит элемент по его id
//  const cardClone = template.content.cloneNode(true);//клонирование карточки шаблона

//  const cardImage = document.querySelector('.card__image');//добавление картинки карточки
//  const cardTitle = document.querySelector('.card__title');//добавление заголовка карточки
 
//  const cardLikeButton = cardClone.querySelector('.card__like-button');//находим в карточку клона кнопку лайка 
//  const cardDeleteButton = cardClone.querySelector('.card__delete-button')//в карточку клона кнопку кнопку удаление лайка
 
//  cardImage.src = link; //установить ссылку на изображение
//  cardImage.alt = name;  //установить альтернативный текст для изображения
//  cardTitle.textContent = name;  //установить текст заголовка
// }

// // Обработчик для лайка
// cardLikeButton.addEventListener('click', () => {
//   cardLikeButton.classList.toggle('card__like-button_active'); //добавляет кнопке лайк и делает ее активнов 
// });

// // Обработчик для удаления карточки
//  cardDeleteButton.addEventListener('click',()=>{ //удаляем карточку по клику 
//   cardClone.remove();
//  })

//   // Обработчик для открытия поп-апа с изображением
//   cardImage.addEventListener('click',()=>{    //Когда пользователь кликает на изображение карточки, выполняются следующие действия:
//   imagePopup.querySelector('.popup__image').src = link ; //устанавливается ссылка с изображением
//   imagePopup.querySelector('.popup__image').alt = name ; //устанавливается альтернативный текст в атрибуте alt 
//   imagePopup.querySelector('.popup__caption').textContent = name; //устанавливается название карточки в тестовом содержимом textContent в классе popup__cartion
//   openModal(imagePopup); //вызывается функция openModal которая добавляет класс popup_is-opened и делает карточку видимой 
//   })


// // Редактирование профиля
//   const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');//находим элемент в html с разделом name форму профиля
//   const nameInput = profileFormElement.querySelector('.popup__input_type_name');// находим поля ввода имени 
//   const jobInput = profileFormElement.querySelector('.popup__input_type_description')// находим поля ввода занятия 

//  function handleCardFormSubmit(evt) { //создает функцию которая принимает на вход данные получение профиля
//   evt.preventDefault()//это строка отменят перезагрузку страницы
//   const newName = nameInput.value; //присвает значение нового имени введеного пользователем 
//   const newJob = jobInput.value;  //присвает значение нового занятие введоного пользователем 

//   document.querySelector('.profile__title').textContent = newName;//присвает новое значение имени тестовое классу 
//   document.querySelector('.profile__description').textContent = newJob;//присвает новое значение занятости тестовое классу 
//   closeModal(profilePopup); //закрывает редактирование профиля
//  }

// profileFormElement.addEventListener('submit', handleCardFormSubmit); //вызывается обработчик событий который сохраняет форму введеное пользователем благодаря submit это происходит в реальном времени без перезагрузки.

// // Добавление карточки
//  const cardFormElement = document.querySelector('.popup__form[name="new-place"]')// находит элемент в html форму карточки 
//  function handleCardFormSubmit(evt) {
//   evt.preventDefault();//отменяет обновление страницы на экране 
//    const cardName = cardFormElement.querySelector('.popup__input_type_card-name').value;// знание поля ввода пользователя название карточки 
//    const cardLink = cardFormElement.querySelector('.popup__input_type_url').value;// знание поля ввода пользователя ссылки на карточку 
//    const newCard = createCard(cardName,cardLink);//в переменую присваевается вызов функции которая примимает в качестве аргумента имя карточки и ссылку 
//    document.querySelector('.places__list').prepend(newCard)//добавляет новую карточку в начала списка благодаря prepend(newCard)
//    closeModal(cardPopup);//закрывает форму добавление карточек 
//  }
// cardFormElement.addEventListener('submit', handleCardFormSubmit);//вызывается обработчик событий который сохраняет новую карточку в реальном времени благодаря submit это происходит в реальном времени без перезагрузки.
// // Открытие и закрытие поп-апов
//  document.querySelector('.profile__edit-button').addEventListener('click',()=>{// добавляется обработчик событий открытия профиля 
//   nameInput.value = document.querySelector('.profile__title').textContent;// в него поступают данные которые пользователь вводил ранее и поля заполняют данными имяни 
//   jobInput.value = document.querySelector('.profile__description').textContent;// в него поступают данные которые пользователь вводил ранее и поля заполняют данными занятости
//   openModal(profilePopup);// открывается редактирование профиля 
//  })

// document.querySelector('.profile__add-button').addEventListener('click', () => { // добавляется обработчик события формы добавление карточки 
//   cardFormElement.reset(); // очищается форма поля формы карточки благодаря .reset()
//   openModal(cardPopup); // открывает форму заполнение карточки 
// });

// profilePopup.querySelector('.popup__close').addEventListener('click', () => { //добавляет обработчик событие кнопке закрытия редактирования профиля
//   closeModal(profilePopup); // закрывает редактирование профиля
// });

// cardPopup.querySelector('.popup__close').addEventListener('click', () => { //добавляет обработчик событие кнопке закрытия добавление карточки
//   closeModal(cardPopup); // закрывает редактирование добавление карточки 
// });

// imagePopup.querySelector('.popup__close').addEventListener('click', () => {//добавляет обработчик событие кнопке просмотра карточки карточка закрывается
//   closeModal(imagePopup); //закрывает просмотр карточки 
// });


