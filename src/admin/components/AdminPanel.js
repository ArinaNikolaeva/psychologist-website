// ==========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА
// ==========================================

export function initAdminPanel() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) {
        console.warn('AdminPanel: кнопка "Панель" не найдена');
        return;
    }

    panelBtn.addEventListener('click', () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            alert('⛔ Доступ запрещён. Войдите как администратор.');
            return;
        }

        const stats = getStats();

        alert(`
🛠️ ПАНЕЛЬ АДМИНИСТРАТОРА

📊 Статистика контента:
━━━━━━━━━━━━━━━━━━━━━
📄 Статей:         ${stats.articles}
💬 Отзывов:        ${stats.reviews}
❓ Вопросов в FAQ:  ${stats.faq}
✏️ Редактируемых блоков: ${stats.editable}

━━━━━━━━━━━━━━━━━━━━━
💡 Режим редактирования:
   Нажмите ✏️ на любом тексте
   с синим контуром, чтобы изменить его.

📝 Изменения сохраняются в localStorage
   и остаются после перезагрузки.
        `);
    });

    console.log('🛠️ AdminPanel инициализирован');
}

// === ПОДСЧЁТ СТАТИСТИКИ ===
function getStats() {
    const articles = document.querySelectorAll('.carousel-slide').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;

    return { articles, reviews, faq, editable };
}