// ==========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА (САЙДБАР)
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

export function initAdminPanel() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) {
        console.warn('AdminPanel: кнопка "Панель" не найдена');
        return;
    }

    panelBtn.addEventListener('click', () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            showNotification('⛔ Доступ запрещён. Войдите как администратор.', 'error');
            return;
        }
        openAdminSidebar();
    });

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        panelBtn.style.display = 'inline-block';
    }

    console.log('🛠️ AdminPanel инициализирован');
}

// ==========================================
// ХЕЛПЕРЫ ДАННЫХ
// ==========================================

// === КОНТАКТЫ ===
function getContacts() {
    const saved = localStorage.getItem('siteContacts');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return { ...siteConfig.contacts };
}

function saveContacts(contacts) {
    localStorage.setItem('siteContacts', JSON.stringify(contacts));
}

// === ОБРАЗОВАНИЕ ===
function getEducation() {
    const saved = localStorage.getItem('siteEducation');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return siteConfig.person.education || [];
}

function saveEducation(education) {
    localStorage.setItem('siteEducation', JSON.stringify(education));
}

// === СЕРТИФИКАТЫ ===
function getCertificates() {
    const saved = localStorage.getItem('siteCertificates');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return siteConfig.person.certificates || [];
}

function saveCertificates(certificates) {
    localStorage.setItem('siteCertificates', JSON.stringify(certificates));
}

// ==========================================
// БОКОВАЯ ПАНЕЛЬ
// ==========================================

function openAdminSidebar() {
    if (document.querySelector('.admin-sidebar')) return;

    const stats = getStats();
    const contacts = getContacts();
    const education = getEducation();

    const overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';

    const sidebar = document.createElement('aside');
    sidebar.className = 'admin-sidebar';
    sidebar.innerHTML = `
        <div class="admin-sidebar-header">
            <h2>⚙ Панель администратора</h2>
            <button class="admin-sidebar-close" id="adminSidebarClose">✕</button>
        </div>

        <div class="admin-sidebar-body">
            <!-- === СТАТИСТИКА === -->
            <div class="admin-section-title">Статистика сайта</div>
            <div class="admin-stats">
                <div class="stat-item">
                    <span class="stat-icon">◈</span>
                    <span class="stat-value">${stats.articles}</span>
                    <span class="stat-label">Статей</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">❝</span>
                    <span class="stat-value">${stats.reviews}</span>
                    <span class="stat-label">Отзывов</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">?</span>
                    <span class="stat-value">${stats.faq}</span>
                    <span class="stat-label">FAQ</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">✎</span>
                    <span class="stat-value">${stats.editable}</span>
                    <span class="stat-label">Блоков</span>
                </div>
            </div>

            <!-- === СВЯЗЬ СО МНОЙ === -->
            <div class="admin-section-title">Связь со мной</div>
            <div class="admin-contacts-tile" id="adminContactsTile">
                <div class="contact-preview">
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">✈</span>
                        <span class="contact-preview-value" id="previewTelegram">${contacts.telegram || '—'}</span>
                    </div>
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">◈</span>
                        <span class="contact-preview-value" id="previewVk">${contacts.vk || '—'}</span>
                    </div>
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">✉</span>
                        <span class="contact-preview-value" id="previewEmail">${contacts.email || '—'}</span>
                    </div>
                </div>
                <button class="admin-btn admin-btn-primary" id="editContactsBtn">
                    ✎ Изменить контакты
                </button>
            </div>

            <!-- === ОБРАЗОВАНИЕ === -->
            <div class="admin-section-title">Образование</div>
            <div class="admin-education-tile" id="adminEducationTile">
                <div class="education-preview">
                    <div class="education-preview-item">
                        <span class="education-preview-icon">◈</span>
                        <span class="education-preview-count" id="previewEducationCount">${education.length}</span>
                        <span class="education-preview-label">записей</span>
                    </div>
                    <div class="education-preview-list" id="previewEducationList">
                        ${education.slice(0, 3).map(item => `
                            <div class="education-preview-row">
                                <span class="education-preview-dot">${item.icon || '◈'}</span>
                                <span class="education-preview-title">${item.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="admin-btn admin-btn-primary" id="editEducationBtn">
                    ✎ Редактировать образование
                </button>
            </div>

            <!-- === РЕЖИМ РЕДАКТИРОВАНИЯ === -->
            <div class="admin-section-title">Режим редактирования</div>
            <div class="admin-info">
                <p>Нажмите <strong>✎ Редактировать</strong> на любом тексте с оранжевым контуром.</p>
                <p>Изменения сохраняются в <code>localStorage</code>.</p>
            </div>

            <!-- === ДЕЙСТВИЯ === -->
            <div class="admin-section-title">Действия</div>
            <div class="admin-actions">
                <button class="admin-btn admin-btn-danger" id="adminClearData">
                    ⊘ Очистить данные
                </button>
                <button class="admin-btn admin-btn-secondary" id="adminRefreshData">
                    ↻ Обновить статистику
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
        sidebar.classList.add('active');
    });

    // === ЗАКРЫТИЕ ===
    function closeSidebar() {
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            sidebar.remove();
        }, 300);
    }

    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelector('#adminSidebarClose').addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeSidebar();
            document.removeEventListener('keydown', escHandler);
        }
    });

    // === РЕДАКТИРОВАНИЕ КОНТАКТОВ ===
    sidebar.querySelector('#editContactsBtn')?.addEventListener('click', () => {
        openContactsEditor(sidebar);
    });

    // ✅ РЕДАКТИРОВАНИЕ ОБРАЗОВАНИЯ — ЭТОГО НЕ БЫЛО!
    sidebar.querySelector('#editEducationBtn')?.addEventListener('click', () => {
        openEducationEditor(sidebar);
    });

    // === ОЧИСТКА ДАННЫХ ===
    sidebar.querySelector('#adminClearData')?.addEventListener('click', () => {
        if (confirm('⚠ Вы уверены, что хотите очистить все сохранённые данные?')) {
            localStorage.removeItem('editorData');
            localStorage.removeItem('siteContacts');
            localStorage.removeItem('siteEducation');
            localStorage.removeItem('siteCertificates');
            showNotification('⊘ Все данные очищены', 'success');
            const newStats = getStats();
            updateStatsDisplay(sidebar, newStats);
        }
    });

    // === ОБНОВЛЕНИЕ СТАТИСТИКИ ===
    sidebar.querySelector('#adminRefreshData')?.addEventListener('click', () => {
        const newStats = getStats();
        updateStatsDisplay(sidebar, newStats);
        showNotification('↻ Статистика обновлена', 'success');
    });
}

// === РЕДАКТОР ОБРАЗОВАНИЯ ===
function openEducationEditor(sidebar) {
    const education = getEducation();
    const certificates = getCertificates();

    const editorOverlay = document.createElement('div');
    editorOverlay.className = 'education-editor-overlay';

    const editor = document.createElement('div');
    editor.className = 'education-editor';
    editor.innerHTML = `
        <div class="education-editor-header">
            <h3>✎ Редактирование образования</h3>
            <button class="education-editor-close" id="educationEditorClose">✕</button>
        </div>

        <div class="education-editor-body">
            <div class="education-editor-list" id="educationList">
                ${education.map((item, index) => renderEducationItem(item, index)).join('')}
            </div>

            <button class="admin-btn admin-btn-secondary" id="addEducationBtn" style="margin-top: 12px;">
                + Добавить запись
            </button>

            <div class="education-editor-divider"></div>

            <div class="form-group">
                <label>Сертификаты (через запятую)</label>
                <textarea id="certificatesInput" rows="3" placeholder="Сертификат 1, Сертификат 2">${certificates.join(', ')}</textarea>
            </div>
        </div>

        <div class="education-editor-actions">
            <button class="admin-btn admin-btn-primary" id="saveEducationBtn">
                Сохранить
            </button>
            <button class="admin-btn admin-btn-secondary" id="cancelEducationBtn">
                ✕ Отмена
            </button>
        </div>
    `;

    document.body.appendChild(editorOverlay);
    document.body.appendChild(editor);

    requestAnimationFrame(() => {
        editorOverlay.classList.add('active');
        editor.classList.add('active');
    });

    let currentEducation = [...education];

    // === ЗАКРЫТИЕ ===
    function closeEditor() {
        editorOverlay.classList.remove('active');
        editor.classList.remove('active');
        setTimeout(() => {
            editorOverlay.remove();
            editor.remove();
        }, 300);
    }

    editorOverlay.addEventListener('click', closeEditor);
    editor.querySelector('#educationEditorClose').addEventListener('click', closeEditor);
    editor.querySelector('#cancelEducationBtn').addEventListener('click', closeEditor);

    // === ОБРАБОТЧИКИ ПОЛЕЙ ===
    function attachEducationHandlers(container, list) {
        container.querySelectorAll('.education-item-editor').forEach((el, index) => {
            el.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    const field = input.dataset.field;
                    list[index][field] = input.value;
                });
            });

            el.querySelector('.education-remove')?.addEventListener('click', () => {
                list.splice(index, 1);
                const listEl = container.querySelector('#educationList');
                listEl.innerHTML = list.map((item, i) => renderEducationItem(item, i)).join('');
                attachEducationHandlers(container, list);
            });
        });
    }

    attachEducationHandlers(editor, currentEducation);

    // === ДОБАВИТЬ ЗАПИСЬ ===
    editor.querySelector('#addEducationBtn').addEventListener('click', () => {
        currentEducation.push({
            type: 'Курсы',
            title: 'Название',
            specialization: 'Специализация',
            year: '2026',
            icon: '◈',
            description: ''
        });
        const list = editor.querySelector('#educationList');
        list.innerHTML = currentEducation.map((item, i) => renderEducationItem(item, i)).join('');
        attachEducationHandlers(editor, currentEducation);
    });

    // === СОХРАНИТЬ ===
    editor.querySelector('#saveEducationBtn').addEventListener('click', () => {
        saveEducation(currentEducation);

        const certs = editor.querySelector('#certificatesInput').value
            .split(',')
            .map(c => c.trim())
            .filter(Boolean);
        saveCertificates(certs);

        sidebar.querySelector('#previewEducationCount').textContent = currentEducation.length;
        sidebar.querySelector('#previewEducationList').innerHTML = currentEducation.slice(0, 3).map(item => `
            <div class="education-preview-row">
                <span class="education-preview-dot">${item.icon || '◈'}</span>
                <span class="education-preview-title">${item.title}</span>
            </div>
        `).join('');

        showNotification('✓ Образование сохранено', 'success');
        closeEditor();
    });
}

// === РЕНДЕР ОДНОЙ ЗАПИСИ ОБРАЗОВАНИЯ ===
function renderEducationItem(item, index) {
    return `
        <div class="education-item-editor">
            <div class="education-item-editor-header">
                <span>Запись ${index + 1}</span>
                <button type="button" class="education-remove" title="Удалить">✕</button>
            </div>

            <!-- Строка 1: иконка, тип, год -->
            <div class="education-item-editor-grid">
                <input type="text" data-field="icon" value="${item.icon || '◈'}" placeholder="◈" maxlength="2">
                <input type="text" data-field="type" value="${item.type || ''}" placeholder="Тип (Курсы)">
                <input type="text" data-field="year" value="${item.year || ''}" placeholder="Год">
            </div>

            <!-- Строка 2: название -->
            <input type="text" data-field="title" value="${item.title || ''}" placeholder="Название учебного заведения" style="margin-top: 10px;">

            <!-- Строка 3: специализация -->
            <input type="text" data-field="specialization" value="${item.specialization || ''}" placeholder="Специализация" style="margin-top: 10px;">

            <!-- Строка 4: описание -->
            <input type="text" data-field="description" value="${item.description || ''}" placeholder="Описание (необязательно)" style="margin-top: 10px;">

            <!-- ✅ БЛОК ДЛЯ ПРИКРЕПЛЕНИЯ ФАЙЛОВ (визуально) -->
            <div class="education-file-upload">
                <div class="education-file-label">
                    <span>Прикрепить документ</span>
                </div>
                <div class="education-file-dropzone" data-index="${index}">
                    <span class="education-file-placeholder">
                        Перетащите файл сюда или нажмите для выбора
                    </span>
                    <span class="education-file-hint">PDF, JPG, PNG · до 5 МБ</span>
                </div>
                <div class="education-file-preview" id="filePreview-${index}">
                    <!-- здесь будут прикреплённые файлы -->
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// РЕДАКТОР КОНТАКТОВ
// ==========================================

function openContactsEditor(sidebar) {
    const contacts = getContacts();

    const editorOverlay = document.createElement('div');
    editorOverlay.className = 'contacts-editor-overlay';

    const editor = document.createElement('div');
    editor.className = 'contacts-editor';
    editor.innerHTML = `
        <div class="contacts-editor-header">
            <h3>✎ Редактирование контактов</h3>
            <button class="contacts-editor-close" id="contactsEditorClose">✕</button>
        </div>

        <form id="contactsForm" class="contacts-editor-form">
            <div class="form-group">
                <label for="contactTelegram">Telegram</label>
                <input type="text" id="contactTelegram" value="${contacts.telegram || ''}" placeholder="@username">
            </div>
            <div class="form-group">
                <label for="contactVk">ВКонтакте</label>
                <input type="text" id="contactVk" value="${contacts.vk || ''}" placeholder="vk.com/username">
            </div>
            <div class="form-group">
                <label for="contactEmail">Email</label>
                <input type="email" id="contactEmail" value="${contacts.email || ''}" placeholder="email@example.com">
            </div>

            <div class="contacts-editor-actions">
                <button type="submit" class="admin-btn admin-btn-primary">
                    ✎ Сохранить
                </button>
                <button type="button" class="admin-btn admin-btn-secondary" id="contactsEditorCancel">
                    ✕ Отмена
                </button>
            </div>
        </form>
    `;

    document.body.appendChild(editorOverlay);
    document.body.appendChild(editor);

    requestAnimationFrame(() => {
        editorOverlay.classList.add('active');
        editor.classList.add('active');
    });

    function closeEditor() {
        editorOverlay.classList.remove('active');
        editor.classList.remove('active');
        setTimeout(() => {
            editorOverlay.remove();
            editor.remove();
        }, 300);
    }

    editorOverlay.addEventListener('click', closeEditor);
    editor.querySelector('#contactsEditorClose').addEventListener('click', closeEditor);
    editor.querySelector('#contactsEditorCancel').addEventListener('click', closeEditor);

    editor.querySelector('#contactsForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const newContacts = {
            telegram: document.getElementById('contactTelegram').value.trim(),
            vk: document.getElementById('contactVk').value.trim(),
            email: document.getElementById('contactEmail').value.trim()
        };

        saveContacts(newContacts);

        sidebar.querySelector('#previewTelegram').textContent = newContacts.telegram || '—';
        sidebar.querySelector('#previewVk').textContent = newContacts.vk || '—';
        sidebar.querySelector('#previewEmail').textContent = newContacts.email || '—';

        showNotification('✓ Контакты сохранены', 'success');
        closeEditor();
    });
}

// ==========================================
// СТАТИСТИКА
// ==========================================

function updateStatsDisplay(container, stats) {
    const statValues = container.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = stats.articles;
        statValues[1].textContent = stats.reviews;
        statValues[2].textContent = stats.faq;
        statValues[3].textContent = stats.editable;
    }
}

function getStats() {
    const articles = document.querySelectorAll('.carousel-slide, .article-card').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;

    return { articles, reviews, faq, editable };
}

// ==========================================
// УВЕДОМЛЕНИЯ
// ==========================================

function showNotification(message, type = 'info') {
    document.querySelectorAll('.admin-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10001;
        animation: slideUp 0.4s ease;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.95rem;
        background: ${type === 'error' ? 'rgba(255, 68, 68, 0.9)' : type === 'success' ? 'rgba(45, 107, 79, 0.9)' : 'rgba(255, 107, 53, 0.9)'};
        color: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}