import { articlesData } from '../../../public/data/articles.js';
import { reviewsData } from '../../../public/data/reviews.js';

export function initModals() {
    // ==========================================
    // МОДАЛКА ДЛЯ СТАТЕЙ
    // ==========================================
    const modal = document.getElementById('articleModal');
    const closeBtn = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalText = document.getElementById('modalText');

    function openArticle(index) {
        const article = articlesData[index];
        if (!article) return;
        modalImage.src = article.image;
        modalCategory.textContent = article.category;
        modalTitle.textContent = article.title;
        modalMeta.textContent = `${article.date} · ${article.readingTime}`;
        modalText.innerHTML = article.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-read-more');
        if (btn) {
            const id = parseInt(btn.dataset.articleId);
            if (!isNaN(id)) openArticle(id);
        }
    });

    document.addEventListener('click', (e) => {
        const slide = e.target.closest('.carousel-slide');
        if (slide && !e.target.closest('.btn-read-more')) {
            const id = parseInt(slide.dataset.articleId);
            if (!isNaN(id)) openArticle(id);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // МОДАЛКА ДЛЯ ОТЗЫВОВ
    // ==========================================
    const rModal = document.getElementById('reviewModal');
    const rClose = document.getElementById('reviewModalClose');
    const rName = document.getElementById('reviewModalName');
    const rStars = document.getElementById('reviewModalStars');
    const rText = document.getElementById('reviewModalText');
    const rDate = document.getElementById('reviewModalDate');
    const rDetails = document.getElementById('reviewModalDetails');

    const detailLabels = {
        contact: 'Контакт с терапевтом',
        understanding: 'Понимание проблемы',
        effectiveness: 'Эффективность',
        atmosphere: 'Атмосфера',
        overall: 'Общее впечатление'
    };

    function openReview(id) {
        const review = reviewsData.find(r => r.id === id);
        if (!review) return;

        // Имя только сверху (один раз)
        if (rName) {
            rName.textContent = review.name;
        }

        rStars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        rText.textContent = review.text;
        rDate.textContent = review.date;

        // Детальная оценка
        if (rDetails) {
            rDetails.innerHTML = Object.keys(detailLabels).map(key => `
                <div class="modal-detail-item">
                    <span class="modal-detail-label">${detailLabels[key]}</span>
                    <span class="modal-detail-stars">${'★'.repeat(review.details[key])}${'☆'.repeat(5 - review.details[key])}</span>
                </div>
            `).join('');
        }

        rModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeReviewModal() {
        rModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const reviewCard = e.target.closest('.review-card');
        if (reviewCard) {
            const id = parseInt(reviewCard.dataset.reviewId);
            if (!isNaN(id)) openReview(id);
        }
    });

    if (rClose) rClose.addEventListener('click', closeReviewModal);
    if (rModal) {
        rModal.addEventListener('click', (e) => {
            if (e.target === rModal) closeReviewModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rModal?.classList.contains('active')) {
            closeReviewModal();
        }
    });

    console.log('✅ Модалки инициализированы');
}