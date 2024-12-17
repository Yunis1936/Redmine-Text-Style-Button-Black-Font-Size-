// ==UserScript==
// @name         Redmine Text Style Button (Black + Font Size)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопку для изменения стиля текста (черный цвет + размер шрифта) в редакторах задач и комментариев Redmine.
// @author       Ты
// @match        https://redmine.lachestry.tech/*
// @match        https://redmine.rigla.ru/*
// @icon         https://www.redmine.org/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Функция добавления кнопки
    function addTextStyleButton(toolbar, textarea) {
        if (!toolbar || !textarea) {
            return;
        }

        // Проверяем, добавлена ли кнопка уже
        if (toolbar.querySelector('.jstb_textstyle')) {
            return;
        }

        // Создание кнопки
        const textStyleButton = document.createElement('button');
        textStyleButton.type = 'button';
        textStyleButton.className = 'jstb_textstyle';
        textStyleButton.title = 'Изменить стиль текста (черный цвет и размер шрифта 20px)';

        // Стили кнопки
        Object.assign(textStyleButton.style, {
            marginRight: '2px',
            width: '24px',
            height: '24px',
            backgroundImage: 'url("https://cdn-icons-png.flaticon.com/256/8173/8173241.png")', // Иконка кнопки
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            border: '1px solid #ccc',
            opacity: '1',
        });

        // Обработчик события клика
        textStyleButton.addEventListener('click', function () {
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            // Получаем выделенный текст
            const selectedText = textarea.value.substring(selectionStart, selectionEnd).trim();
            if (!selectedText) {
                alert('Пожалуйста, выделите текст для изменения стиля.');
                return;
            }

            // Оборачиваем текст в команду %{...}
            const wrappedText = `%{color:black;font-size:20px}${selectedText}%`;

            // Вставляем результат в текстовое поле
            textarea.value =
                textarea.value.substring(0, selectionStart) +
                wrappedText +
                textarea.value.substring(selectionEnd);

            // Возвращаем фокус и обновляем выделение
            textarea.setSelectionRange(selectionStart, selectionStart + wrappedText.length);
            textarea.focus();
        });

        // Добавляем кнопку на панель инструментов
        toolbar.appendChild(textStyleButton);
    }

    // Инициализация кнопки для редакторов описания задачи и комментариев
    function initTextStyleButton() {
        const descriptionToolbar = document.querySelector('.jstElements');
        const descriptionTextarea = document.querySelector('#issue_description');
        if (descriptionToolbar && descriptionTextarea) {
            addTextStyleButton(descriptionToolbar, descriptionTextarea);
        }

        const commentToolbar = document.querySelectorAll('.jstElements')[1];
        const commentTextarea = document.querySelector('#issue_notes');
        if (commentToolbar && commentTextarea) {
            addTextStyleButton(commentToolbar, commentTextarea);
        }
    }

    // Наблюдатель за DOM-изменениями
    const observer = new MutationObserver(initTextStyleButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
