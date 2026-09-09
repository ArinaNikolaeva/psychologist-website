// ==========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА
// ==========================================

export function initAdminPanel() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) {
        console.warn('AdminPanel: кнопка "Панель" не найдена');
        return;
    }

    // Обновляем обработчик
    panelBtn.addEventListener('click', () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            showNotification('⛔ Доступ запрещён. Войдите как администратор.', 'error');
            return;
        }

        openAdminModal();
    });

    // Если админ уже залогинен — показываем кнопку
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        panelBtn.style.display = 'inline-block';
    }

    console.log('🛠️ AdminPanel инициализирован');
}

// === ОТКРЫТЬ МОДАЛЬНОЕ ОКНО ПАНЕЛИ ===
function openAdminModal() {
    const stats = getStats();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.className = 'admin-modal-overlay';
    modal.innerHTML = `
        <div class="admin-modal">
            <div class="admin-modal-header">
                <h2>🛠️ Панель администратора</h2>
                <button class="admin-modal-close" id="adminModalClose">✕</button>
            </div>
            
            <div class="admin-modal-body">
                <div class="admin-stats">
                    <div class="stat-item">
                        <span class="stat-icon">📄</span>
                        <span class="stat-value">${stats.articles}</span>
                        <span class="stat-label">Статей</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">💬</span>
                        <span class="stat-value">${stats.reviews}</span>
                        <span class="stat-label">Отзывов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">❓</span>
                        <span class="stat-value">${stats.faq}</span>
                        <span class="stat-label">FAQ</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">✏️</span>
                        <span class="stat-value">${stats.editable}</span>
                        <span class="stat-label">Редактируемых блоков</span>
                    </div>
                </div>
                
                <div class="admin-info">
                    <h3>💡 Режим редактирования</h3>
                    <p>Нажмите <strong>✎ Редактировать</strong> на любом тексте с оранжевым контуром, чтобы изменить его.</p>
                    <p>📝 Изменения сохраняются в <code>localStorage</code> и остаются после перезагрузки.</p>
                </div>
                
                <div class="admin-actions">
                    <button class="admin-btn admin-btn-danger" id="adminClearData">
                        🗑️ Очистить все данные
                    </button>
                    <button class="admin-btn admin-btn-secondary" id="adminRefreshData">
                        🔄 Обновить статистику
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику на оверлей
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Закрытие по кнопке "✕"
    modal.querySelector('#adminModalClose').addEventListener('click', () => {
        modal.remove();
    });
    
    // Очистка данных
    modal.querySelector('#adminClearData')?.addEventListener('click', () => {
        if (confirm('⚠️ Вы уверены, что хотите очистить все сохранённые данные?\nЭто действие необратимо.')) {
            localStorage.removeItem('editorData');
            showNotification('🗑️ Все данные очищены', 'success');
            // Обновляем статистику
            const newStats = getStats();
            updateStatsDisplay(modal, newStats);
        }
    });
    
    // Обновление статистики
    modal.querySelector('#adminRefreshData')?.addEventListener('click', () => {
        const newStats = getStats();
        updateStatsDisplay(modal, newStats);
        showNotification('🔄 Статистика обновлена', 'success');
    });
}

// === ОБНОВЛЕНИЕ СТАТИСТИКИ В МОДАЛКЕ ===
function updateStatsDisplay(modal, stats) {
    const statValues = modal.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = stats.articles;
        statValues[1].textContent = stats.reviews;
        statValues[2].textContent = stats.faq;
        statValues[3].textContent = stats.editable;
    }
}

// === ПОДСЧЁТ СТАТИСТИКИ ===
function getStats() {
    const articles = document.querySelectorAll('.carousel-slide').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;

    return { articles, reviews, faq, editable };
}

// === УВЕДОМЛЕНИЯ ===
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
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