// ==========================================
// FAQ
// ==========================================

import { faqData } from '../../../public/data/faq.js';

export function renderFAQ() {
    return `
        <div class="faq-list">
            ${faqData.map((item, index) => `
                <div class="faq-item ${index === 0 ? 'open' : ''} animate-on-scroll" style="animation-delay: ${(index * 0.05).toFixed(2)}s;">
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer">${item.answer}</div>
                </div>
            `).join('')}
        </div>
    `;
}