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

// === ПОЛУЧИТЬ КОНТАКТЫ (из localStorage или из siteConfig) ===
function getContacts() {
    const saved = localStorage.getItem('siteContacts');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn('Ошибка загрузки контактов:', e);
        }
    }
    return { ...siteConfig.contacts };
}

// === СОХРАНИТЬ КОНТАКТЫ ===
function saveContacts(contacts) {
    localStorage.setItem('siteContacts', JSON.stringify(contacts));
}

// === ОТКРЫТЬ БОКОВУЮ ПАНЕЛЬ ===
function openAdminSidebar() {
    if (document.querySelector('.admin-sidebar')) return;

    const stats = getStats();
    const contacts = getContacts();

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
                    <span class="stat-icon">❓</span>
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
        openContactsEditor(sidebar, closeSidebar);
    });

    // === ОЧИСТКА ДАННЫХ ===
    sidebar.querySelector('#adminClearData')?.addEventListener('click', () => {
        if (confirm('⚠ Вы уверены, что хотите очистить все сохранённые данные?')) {
            localStorage.removeItem('editorData');
            localStorage.removeItem('siteContacts');
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

// === РЕДАКТОР КОНТАКТОВ ===
function openContactsEditor(sidebar, closeSidebar) {
    const contacts = getContacts();

    // Оверлей поверх сайдбара
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
    editor.querySelector('#contactsEditorClose').addEventListener('click', closeEditor);
    editor.querySelector('#contactsEditorCancel').addEventListener('click', closeEditor);

    // === СОХРАНЕНИЕ ===
    editor.querySelector('#contactsForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const newContacts = {
            telegram: document.getElementById('contactTelegram').value.trim(),
            vk: document.getElementById('contactVk').value.trim(),
            email: document.getElementById('contactEmail').value.trim()
        };

        saveContacts(newContacts);

        // Обновляем превью в сайдбаре
        sidebar.querySelector('#previewTelegram').textContent = newContacts.telegram || '—';
        sidebar.querySelector('#previewVk').textContent = newContacts.vk || '—';
        sidebar.querySelector('#previewEmail').textContent = newContacts.email || '—';

        showNotification('✓ Контакты сохранены', 'success');
        closeEditor();
    });
}

// === ОБНОВЛЕНИЕ СТАТИСТИКИ ===
function updateStatsDisplay(container, stats) {
    const statValues = container.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = stats.articles;
        statValues[1].textContent = stats.reviews;
        statValues[2].textContent = stats.faq;
        statValues[3].textContent = stats.editable;
    }
}

// === ПОДСЧЁТ СТАТИСТИКИ ===
function getStats() {
    const articles = document.querySelectorAll('.carousel-slide, .article-card').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;

    return { articles, reviews, faq, editable };
}

// === УВЕДОМЛЕНИЯ ===
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