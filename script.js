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

// Поля формы добавления
const inputTitle = document.getElementById('article-title');
const inputText = document.getElementById('article-text');

// ===========================
// СТАТИСТИКА
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

// Очистка полей формы (Пункт 1 и 2 задания)
function resetForm() {
    inputTitle.value = '';
    inputText.value = '';
}

// Показать форму по кнопке "Создать статью"
btnCreateArticle.addEventListener('click', function () {
    showArticleForm();
});

// Обработчик кнопки "Отмена" (Пункт 2 задания)
btnCancelArticle.addEventListener('click', () => {
    resetForm();
    hideArticleForm();
});

// ===========================
// ДОБАВЛЕНИЕ СТАТЬИ (Пункт 1 задания)
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
    blogCards.prepend(clone);
    updateStats();
}

// Добавление поста по кнопке "Добавить" (с mock-данными)
btnAddArticle.addEventListener('click', () => {
    const title = inputTitle.value.trim();
    const text = inputText.value.trim();

    if (title === '' || text === '') {
        alert('Пожалуйста, введите заголовок и текст статьи');
        return;
    }

    const now = new Date();
    addPost(title, formatDate(now), formatDatetime(now));

    // Сброс и скрытие (Пункт 1)
    resetForm();
    hideArticleForm();
});

// ===========================
// УДАЛЕНИЕ СТАТЬИ (Пункт 3 задания)
// ===========================

// Используем делегирование: вешаем один обработчик на весь контейнер
blogCards.addEventListener('click', (event) => {
    // Проверяем, нажали ли мы на кнопку удаления (крестик)
    if (event.target.classList.contains('btn-delete')) {
        // Находим ближайшую карточку к этому крестику
        const card = event.target.closest('.blog-card');
        
        if (card) {
            // Удаляем карточку из DOM
            card.remove();
            // Обновляем статистику после удаления
            updateStats();
        }
    }
});