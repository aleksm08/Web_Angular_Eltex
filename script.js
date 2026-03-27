'use strict';

// ===========================
// Получение элементов DOM
// ===========================

const blogCards = document.getElementById('blog-cards');
const addArticleSection = document.getElementById('add-article-section');
const btnCreateArticle = document.getElementById('btn-create-article');
const btnCancelArticle = document.getElementById('btn-cancel-article');
const btnAddArticle = document.getElementById('btn-add-article');
const btnShowStats = document.getElementById('btn-show-stats');
const statsDialog = document.getElementById('stats-dialog');
const statsDialogClose = document.getElementById('stats-dialog-close');
const statsArticlesCount = document.getElementById('stats-articles-count');
const statsCommentsCount = document.getElementById('stats-comments-count');
const blogCardTemplate = document.getElementById('blog-card-template');

// ===========================
// Пункт 4: Подсчёт статей
// ===========================

/**
 * Подсчитывает количество статей на странице
 * (карточки в сетке + featured-статья)
 * @returns {number} количество статей
 */
function countArticles() {
    const gridArticles = blogCards.querySelectorAll('.blog-card');
    const featuredArticles = document.querySelectorAll('.blog-featured-card');
    return gridArticles.length + featuredArticles.length;
}

/**
 * Обновляет данные в диалоге статистики
 */
function updateStats() {
    statsArticlesCount.textContent = countArticles();
    statsCommentsCount.textContent = 0;
}

// ===========================
// Пункт 4: Диалог статистики
// ===========================

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
// Пункт 5: Показ/скрытие формы
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

// Показать форму по кнопке "Создать статью"
btnCreateArticle.addEventListener('click', function () {
    showArticleForm();
});

// Скрыть форму по кнопке "Отмена"
btnCancelArticle.addEventListener('click', function () {
    hideArticleForm();
});

// ===========================
// Пункт 6: Добавление поста через template
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

/**
 * Добавляет новый пост на страницу, используя template
 * @param {string} title — заголовок статьи
 * @param {string} dateStr — дата в читаемом формате
 * @param {string} datetime — дата для атрибута datetime
 */
function addPost(title, dateStr, datetime) {
    // Клонируем содержимое шаблона
    const clone = blogCardTemplate.content.cloneNode(true);

    // Заполняем данными
    clone.querySelector('h4').textContent = title;
    const timeEl = clone.querySelector('time');
    timeEl.textContent = dateStr;
    timeEl.setAttribute('datetime', datetime);

    // Добавляем карточку в сетку
    blogCards.appendChild(clone);
}

// Mock-данные для добавления поста по кнопке "Добавить"
const mockPosts = [
    'Основы JavaScript для начинающих',
    'Что нового в CSS 2025',
    'Как настроить Git для командной работы',
    'Angular: первые шаги',
    'Секреты продуктивной разработки'
];

let mockIndex = 0;

// Добавление поста по кнопке "Добавить" (с mock-данными)
btnAddArticle.addEventListener('click', function () {
    const now = new Date();
    const title = mockPosts[mockIndex % mockPosts.length];
    const dateStr = formatDate(now);
    const datetime = formatDatetime(now);

    addPost(title, dateStr, datetime);
    mockIndex++;

    // Скрываем форму после добавления
    hideArticleForm();
});
