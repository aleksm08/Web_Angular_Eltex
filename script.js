'use strict';

// ===========================
// Получение элементов DOM
// ===========================

const blogCards = document.getElementById('blog-cards');
const blogEmpty = document.getElementById('blog-empty');
const blogNext = document.getElementById('blog-next');
const addArticleSection = document.getElementById('add-article-section');
const addArticleForm = document.getElementById('add-article-form');
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

// // Поля формы добавления
// const inputTitle = document.getElementById('article-title');
// const inputText = document.getElementById('article-text');

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
 * Доработка ДЗ6: используем form.reset() для очистки формы
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
// ДОБАВЛЕНИЕ СТАТЬИ (через форму)
// ===========================

// Доработка ДЗ5: используем submit событие формы
addArticleForm.addEventListener('submit', function (event) {
    // Предотвращаем стандартную отправку формы
    event.preventDefault();

    const title = document.getElementById('article-title').value.trim();
    const text = document.getElementById('article-text').value.trim();

    if (title === '' || text === '') {
        alert('Пожалуйста, введите заголовок и текст статьи');
        return;
    }

    const now = new Date();

    // Создаём объект статьи
    const article = {
        id: Date.now().toString(),
        title: title,
        text: text,
        date: formatDate(now),
        datetime: formatDatetime(now)
    };

    // Сохраняем в localStorage (ДЗ 7)
    addArticleToStorage(article);

    // Рендерим карточку на странице
    renderCard(article);

    // Обновляем состояние
    updateEmptyState();
    resetForm();
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

            // Удаляем из localStorage
            removeArticleFromStorage(id);

            // Удаляем из DOM
            card.remove();

            // Обновляем состояние
            updateEmptyState();
            updateStats();
        }
    }
});

// ===========================
// ИНИЦИАЛИЗАЦИЯ: загрузка статей из localStorage (ДЗ 7)
// ===========================

function init() {
    const articles = getArticlesFromStorage();
    renderAllArticles(articles);
}

init();
