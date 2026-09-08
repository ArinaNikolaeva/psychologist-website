export function renderFAQ() {
    return `
        <div class="faq-list">
            <div class="faq-item open animate-on-scroll" style="animation-delay: 0.05s;">
                <div class="faq-question">Чем вы помогаете в отношениях?</div>
                <div class="faq-answer">
                    Я помогаю парам и индивидуально разбираться в сложностях: недопонимание, кризисы, измены,
                    страхи и неуверенность. Мы ищем причины и находим новые способы быть вместе.
                </div>
            </div>
            <div class="faq-item animate-on-scroll" style="animation-delay: 0.1s;">
                <div class="faq-question">Как понять, что пора обратиться?</div>
                <div class="faq-answer">
                    Если вы чувствуете, что зашли в тупик, разговоры не помогают, эмоции зашкаливают — это знак, что пора.
                </div>
            </div>
            <div class="faq-item animate-on-scroll" style="animation-delay: 0.15s;">
                <div class="faq-question">Как проходит консультация?</div>
                <div class="faq-answer">
                    Консультация длится 60 минут. Мы знакомимся, вы рассказываете о своём запросе, я задаю вопросы,
                    чтобы лучше понять ситуацию.
                </div>
            </div>
            <div class="faq-item animate-on-scroll" style="animation-delay: 0.2s;">
                <div class="faq-question">Сколько это стоит?</div>
                <div class="faq-answer">
                    Стоимость консультации — 5000 ₽. Также есть формат пакетных сессий — обсуждаем индивидуально.
                </div>
            </div>
        </div>
    `;
}