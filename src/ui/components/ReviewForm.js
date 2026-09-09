// ==========================================
// ФОРМА ДОБАВЛЕНИЯ ОТЗЫВА (С РАЗДЕЛЬНЫМИ ОЦЕНКАМИ)
// ==========================================

import { addReview } from '../../../public/data/reviews.js';

const categories = [
    { value: 'отношения', label: 'Отношения' },
    { value: 'самооценка', label: 'Самооценка' },
    { value: 'кризис', label: 'Кризис' },
    { value: 'эмоции', label: 'Эмоции' },
    { value: 'коммуникация', label: 'Коммуникация' }
];

// ✅ КРИТЕРИИ ДЛЯ ОЦЕНКИ (как в развёрнутых отзывах)
const ratingCriteria = [
    { id: 'professionalism', label: 'Профессионализм' },
    { id: 'empathy', label: 'Эмпатия и внимание' },
    { id: 'clarity', label: 'Чёткость объяснений' },
    { id: 'effectiveness', label: 'Эффективность работы' },
    { id: 'recommendation', label: 'Готовность рекомендовать' }
];

export function renderReviewForm() {
    return `
        <div class="review-form-wrapper">
            <button class="btn btn-primary review-add-btn" id="openReviewFormBtn">
                ✎ Оставить отзыв
            </button>
        </div>
    `;
}

export function initReviewForm() {
    const openBtn = document.getElementById('openReviewFormBtn');
    if (openBtn) {
        openBtn.addEventListener('click', openReviewModal);
    }
}

function openReviewModal() {
    if (document.querySelector('.review-form-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'review-form-modal';
    modal.innerHTML = `
        <div class="review-form-overlay">
            <div class="review-form-container">
                <button class="review-form-close" id="reviewFormClose">✕</button>
                <h2>✎ Оставить отзыв</h2>
                <p class="review-form-subtitle">Поделитесь своим опытом работы с Ариной</p>
                
                <form id="reviewForm">
                    <div class="form-group">
                        <label for="reviewName">Ваше имя</label>
                        <input type="text" id="reviewName" placeholder="Например, Екатерина" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewCategory">Тема отзыва</label>
                        <select id="reviewCategory">
                            ${categories.map(cat => 
                                `<option value="${cat.value}">${cat.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- ✅ РАЗДЕЛЬНЫЕ ОЦЕНКИ ПО КРИТЕРИЯМ -->
                    <div class="form-group">
                        <label>Оцените работу по критериям</label>
                        <div class="rating-criteria">
                            ${ratingCriteria.map(criterion => `
                                <div class="rating-criterion">
                                    <span class="criterion-label">${criterion.label}</span>
                                    <div class="criterion-stars" data-criterion="${criterion.id}">
                                        ${[1,2,3,4,5].map(val => 
                                            `<span class="star" data-value="${val}">☆</span>`
                                        ).join('')}
                                    </div>
                                    <input type="hidden" class="criterion-rating" data-criterion="${criterion.id}" value="5">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- ✅ ОБЩАЯ ОЦЕНКА (средняя) -->
                    <div class="form-group">
                        <label>Общая оценка</label>
                        <div class="rating-stars" id="ratingStars">
                            ${[1,2,3,4,5].map(val => 
                                `<span class="star" data-value="${val}">☆</span>`
                            ).join('')}
                        </div>
                        <input type="hidden" id="reviewRating" value="5">
                        <span class="rating-average" id="ratingAverage">Средняя: 5.0</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewText">Ваш отзыв</label>
                        <textarea id="reviewText" rows="5" placeholder="Расскажите о вашем опыте..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary submit-review-btn">
                        ✎ Отправить на модерацию
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalHandlers(modal);
}

function setupModalHandlers(modal) {
    // === ЗАКРЫТИЕ ===
    const closeBtn = modal.querySelector('#reviewFormClose');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('review-form-overlay')) {
            modal.remove();
        }
    });

    // === ЗВЁЗДЫ ДЛЯ КРИТЕРИЕВ ===
    const criteriaContainers = modal.querySelectorAll('.criterion-stars');
    const ratingInputs = modal.querySelectorAll('.criterion-rating');
    const totalInput = modal.querySelector('#reviewRating');
    const averageDisplay = modal.querySelector('#ratingAverage');

    // Храним оценки по критериям
    const criterionRatings = {};
    ratingCriteria.forEach(c => {
        criterionRatings[c.id] = 5;
    });

    criteriaContainers.forEach(container => {
        const criterionId = container.dataset.criterion;
        const stars = container.querySelectorAll('.star');
        let selectedRating = 5;

        // Инициализация
        highlightStars(stars, 5);

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, parseInt(star.dataset.value));
            });

            star.addEventListener('mouseleave', () => {
                highlightStars(stars, selectedRating);
            });

            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.value);
                criterionRatings[criterionId] = selectedRating;
                
                // Обновляем скрытое поле
                const input = container.parentElement.querySelector('.criterion-rating');
                if (input) input.value = selectedRating;
                
                highlightStars(stars, selectedRating);
                updateAverageRating();
            });
        });
    });

    // === ФУНКЦИЯ ПОДСЧЁТА СРЕДНЕЙ ОЦЕНКИ ===
    function updateAverageRating() {
        const values = Object.values(criterionRatings);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const rounded = Math.round(avg * 10) / 10;
        
        totalInput.value = Math.round(avg);
        averageDisplay.textContent = `Средняя: ${rounded.toFixed(1)}`;
        
        // Обновляем общие звёзды
        const mainStars = modal.querySelector('#ratingStars').querySelectorAll('.star');
        highlightStars(mainStars, Math.round(avg));
    }

    // === ОБЩИЕ ЗВЁЗДЫ (для удобства) ===
    const mainStars = modal.querySelector('#ratingStars').querySelectorAll('.star');
    mainStars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            // Устанавливаем всем критериям одинаковую оценку
            ratingCriteria.forEach(c => {
                criterionRatings[c.id] = value;
                const container = modal.querySelector(`.criterion-stars[data-criterion="${c.id}"]`);
                if (container) {
                    const stars = container.querySelectorAll('.star');
                    highlightStars(stars, value);
                    const input = container.parentElement.querySelector('.criterion-rating');
                    if (input) input.value = value;
                }
            });
            updateAverageRating();
        });
    });

    // === ОТПРАВКА ФОРМЫ ===
    const form = modal.querySelector('#reviewForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const category = document.getElementById('reviewCategory').value;
        const text = document.getElementById('reviewText').value.trim();
        const rating = parseInt(totalInput.value) || 5;

        // Собираем оценки по критериям
        const criteriaRatings = {};
        ratingCriteria.forEach(c => {
            const input = modal.querySelector(`.criterion-rating[data-criterion="${c.id}"]`);
            criteriaRatings[c.id] = parseInt(input?.value) || 5;
        });

        if (!name || !text) {
            showToast('⚠ Пожалуйста, заполните все поля', 'warning');
            return;
        }

        if (text.length < 10) {
            showToast('⚠ Отзыв должен содержать минимум 10 символов', 'warning');
            return;
        }

        // Сохраняем отзыв с детальными оценками
        addReview({ 
            name, 
            text, 
            rating, 
            category,
            criteria: criteriaRatings // Сохраняем оценки по критериям
        });
        
        modal.remove();
        showToast('Спасибо! Ваш отзыв отправлен на модерацию.', 'success');
        
        setTimeout(() => {
            if (typeof window.refreshReviews === 'function') {
                window.refreshReviews();
            } else {
                window.location.reload();
            }
        }, 2000);
    });
}

// === ПОДСВЕТКА ЗВЁЗД ===
function highlightStars(stars, count) {
    stars.forEach(star => {
        const value = parseInt(star.dataset.value);
        star.textContent = value <= count ? '★' : '☆';
        star.classList.toggle('active', value <= count);
    });
}

// === УВЕДОМЛЕНИЯ ===
function showToast(message, type = 'info') {
    document.querySelectorAll('.review-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = 'review-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.95rem;
        max-width: 500px;
        text-align: center;
        background: ${type === 'success' ? 'rgba(45, 107, 79, 0.95)' : 'rgba(255, 107, 53, 0.95)'};
        color: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: slideUp 0.4s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}