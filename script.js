'use strict';

// ===========================
// Получение элементов DOM
// ===========================

const blogCards = document.getElementById('blog-cards');
const blogEmpty = document.getElementById('blog-empty');
const blogNext = document.getElementById('blog-next');
const loader = document.getElementById('loader');
const addArticleSection = document.getElementById('add-article-section');
const addArticleForm = document.getElementById('add-article-form');
const formFieldset = document.getElementById('form-fieldset');
const btnCreateArticle = document.getElementById('btn-create-article');
const btnCancelArticle = document.getElementById('btn-cancel-article');
const btnShowStats = document.getElementById('btn-show-stats');
const statsDialog = document.getElementById('stats-dialog');
const statsDialogClose = document.getElementById('stats-dialog-close');
const statsArticlesCount = document.getElementById('stats-articles-count');
const statsCommentsCount = document.getElementById('stats-comments-count');
const blogCardTemplate = document.getElementById('blog-card-template');

// Ключ для localStorage
const STORAGE_KEY = 'blog_articles';

// ===========================
// ЛОАДЕР (ДЗ 8)
// ===========================

/**
 * Показывает лоадер и скрывает контейнер статей
 */
function showLoader() {
    loader.hidden = false;
    blogCards.hidden = true;
    blogEmpty.hidden = true;
    blogNext.hidden = true;
}

/**
 * Скрывает лоадер и показывает контейнер статей
 */
function hideLoader() {
    loader.hidden = true;
    blogCards.hidden = false;
}

/**
 * Имитация задержки загрузки (ДЗ 8)
 * @param {number} ms — задержка в миллисекундах
 * @returns {Promise}
 */
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

// ===========================
// БЛОКИРОВКА ФОРМЫ (ДЗ 8)
// ===========================

/**
 * Блокирует все поля и кнопки формы через fieldset
 */
function disableForm() {
    formFieldset.disabled = true;
}

/**
 * Разблокирует все поля и кнопки формы
 */
function enableForm() {
    formFieldset.disabled = false;
}

// ===========================
// РАБОТА С localStorage (ДЗ 7)
// ===========================

/**
 * Получает массив статей из localStorage
 * @returns {Array} массив объектов статей
 */
function getArticlesFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

/**
 * Сохраняет массив статей в localStorage
 * @param {Array} articles — массив объектов статей
 */
function saveArticlesToStorage(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

/**
 * Добавляет одну статью в localStorage
 * @param {Object} article — объект { id, title, text, date, datetime }
 */
function addArticleToStorage(article) {
    const articles = getArticlesFromStorage();
    articles.push(article);
    saveArticlesToStorage(articles);
}

/**
 * Удаляет статью из localStorage по id
 * @param {string} id — уникальный идентификатор статьи
 */
function removeArticleFromStorage(id) {
    const articles = getArticlesFromStorage();
    const filtered = articles.filter(function (article) {
        return article.id !== id;
    });
    saveArticlesToStorage(filtered);
}

// ===========================
// УПРАВЛЕНИЕ ПУСТЫМ СОСТОЯНИЕМ (ДЗ 7)
// ===========================

/**
 * Обновляет видимость заглушки "Нет статей" и кнопки "Далее"
 */
function updateEmptyState() {
    const hasArticles = blogCards.querySelectorAll('.blog-card').length > 0;
    blogEmpty.hidden = hasArticles;
    blogNext.hidden = !hasArticles;
}

// ===========================
// СТАТИСТИКА
// ===========================

/**
 * Подсчитывает количество статей на странице
 * @returns {number} количество статей
 */
function countArticles() {
    return blogCards.querySelectorAll('.blog-card').length;
}

/**
 * Обновляет данные в диалоге статистики
 */
function updateStats() {
    statsArticlesCount.textContent = countArticles();
    statsCommentsCount.textContent = 0;
}

// Открытие диалога по кнопке "Показать статистику"
btnShowStats.addEventListener('click', function () {
    updateStats();
    statsDialog.showModal();
});

// Закрытие диалога по крестику
statsDialogClose.addEventListener('click', function () {
    statsDialog.close();
});

// Закрытие диалога при клике вне него (на backdrop)
statsDialog.addEventListener('click', function (event) {
    // Если клик был на самом элементе dialog (т.е. на backdrop), а не на его содержимом
    if (event.target === statsDialog) {
        statsDialog.close();
    }
});

// ===========================
// УПРАВЛЕНИЕ ФОРМОЙ (ПОКАЗ/СКРЫТИЕ)
// ===========================

/**
 * Показать форму добавления статьи с анимацией
 */
function showArticleForm() {
    addArticleSection.hidden = false;
    // Небольшая задержка, чтобы браузер успел отрисовать элемент до запуска анимации
    requestAnimationFrame(function () {
        addArticleSection.classList.add('visible');
    });
    // Прокручиваем к форме
    addArticleSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Скрыть форму добавления статьи с анимацией
 */
function hideArticleForm() {
    addArticleSection.classList.remove('visible');
    // Ждём окончания анимации перед скрытием
    addArticleSection.addEventListener('transitionend', function handler() {
        addArticleSection.hidden = true;
        addArticleSection.removeEventListener('transitionend', handler);
    });
}

/**
 * Очистка формы через form.reset()
 */
function resetForm() {
    addArticleForm.reset();
}

// Показать форму по кнопке "Создать статью"
btnCreateArticle.addEventListener('click', function () {
    showArticleForm();
});

// Обработчик кнопки "Отмена"
btnCancelArticle.addEventListener('click', function () {
    resetForm();
    hideArticleForm();
});

// ===========================
// ФОРМАТИРОВАНИЕ ДАТ
// ===========================

/**
 * Форматирует дату в читаемый вид
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return 'Опубликовано: ' + day + ' ' + month + ' ' + year;
}

/**
 * Форматирует дату для атрибута datetime
 * @param {Date} date
 * @returns {string}
 */
function formatDatetime(date) {
    return date.toISOString().split('T')[0];
}

// ===========================
// РЕНДЕРИНГ КАРТОЧЕК
// ===========================

/**
 * Создаёт карточку статьи из шаблона и добавляет на страницу
 * @param {Object} article — объект { id, title, text, date, datetime }
 */
function renderCard(article) {
    const clone = blogCardTemplate.content.cloneNode(true);

    // Устанавливаем data-id для идентификации при удалении
    const card = clone.querySelector('.blog-card');
    card.dataset.id = article.id;

    // Заполняем данными
    clone.querySelector('h4').textContent = article.title;

    // Текст статьи (показываем в featured-карточке)
    const textEl = clone.querySelector('.blog-card-text');
    if (textEl) {
        textEl.textContent = article.text;
    }

    const timeEl = clone.querySelector('time');
    timeEl.textContent = article.date;
    timeEl.setAttribute('datetime', article.datetime);

    // Добавляем карточку в сетку
    blogCards.appendChild(clone);
}

/**
 * Отрисовывает все статьи из массива
 * @param {Array} articles — массив объектов статей
 */
function renderAllArticles(articles) {
    // Очищаем контейнер
    blogCards.innerHTML = '';

    // Рендерим каждую статью
    articles.forEach(function (article) {
        renderCard(article);
    });

    // Обновляем состояние пустой страницы
    updateEmptyState();
}

// ===========================
// ДОБАВЛЕНИЕ СТАТЬИ (через форму) с имитацией загрузки (ДЗ 8)
// ===========================

// Используем submit событие формы
addArticleForm.addEventListener('submit', async function (event) {
    // Предотвращаем стандартную отправку формы
    event.preventDefault();

    const title = document.getElementById('article-title').value.trim();
    const text = document.getElementById('article-text').value.trim();

    if (title === '' || text === '') {
        alert('Пожалуйста, введите заголовок и текст статьи');
        return;
    }

    // Блокируем форму, чтобы нельзя было повторно нажать или изменить данные (ДЗ 8)
    disableForm();

    const now = new Date();

    // Создаём объект статьи
    const article = {
        id: Date.now().toString(),
        title: title,
        text: text,
        date: formatDate(now),
        datetime: formatDatetime(now)
    };

    // Имитация задержки сохранения (ДЗ 8)
    await delay(800);

    // Сохраняем в localStorage
    addArticleToStorage(article);

    // Рендерим карточку на странице
    renderCard(article);

    // Обновляем состояние
    updateEmptyState();
    resetForm();
    enableForm();
    hideArticleForm();
});

// ===========================
// УДАЛЕНИЕ СТАТЬИ
// ===========================

// Делегирование: один обработчик на весь контейнер
blogCards.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-delete')) {
        const card = event.target.closest('.blog-card');

        if (card) {
            const id = card.dataset.id;
            removeArticleFromStorage(id); // Удаляем из localStorage
            card.remove();       // Удаляем из DOM
            updateEmptyState();  // Обновляем состояние
            updateStats();
        }
    }
});

// ===========================
// ИНИЦИАЛИЗАЦИЯ: загрузка статей с лоадером (ДЗ 8)
// ===========================

/**
 * Асинхронная инициализация: показывает лоадер,
 * имитирует задержку загрузки, затем рендерит статьи
 */
async function init() {
    // Показываем лоадер
    showLoader();

    // Имитация загрузки данных (например, запрос к серверу)
    await delay(1500);

    // Загружаем данные из localStorage
    const articles = getArticlesFromStorage();

    // Скрываем лоадер
    hideLoader();

    // Отрисовываем статьи
    renderAllArticles(articles);
}

init();
