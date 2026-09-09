export function renderFooter() {
    return `
        <footer class="footer">
            <div class="container footer-inner">
                <div>© 2026 Арина Николаева · Веб-разработчик</div>
                <div>
                    <a href="#" id="footerTelegram">Telegram</a>
                    <a href="#" id="footerVK">ВКонтакте</a>
                    <a href="#" id="footerEmail">Email</a>
                </div>
            </div>
        </footer>
    `;
}

export function initFooter() {
    document.getElementById('footerTelegram')?.addEventListener('click', () => {
        alert('Telegram: @arina_psychologist');
    });
    document.getElementById('footerVK')?.addEventListener('click', () => {
        alert('ВКонтакте: vk.com/arina_psychologist');
    });
    document.getElementById('footerEmail')?.addEventListener('click', () => {
        alert('Email: arina@psychologist.ru');
    });
}