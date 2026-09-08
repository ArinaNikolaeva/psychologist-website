import { reviewsData } from '../../../public/data/reviews.js';

const categoryMap = {
    'отношения': { color: '#D48B6A', label: 'Отношения' },
    'самооценка': { color: '#6A9C89', label: 'Самооценка' },
    'кризис': { color: '#C47A7A', label: 'Кризис' },
    'эмоции': { color: '#B8A08A', label: 'Эмоции' },
    'коммуникация': { color: '#7A9BA8', label: 'Коммуникация' }
};

export function renderReviews() {
    return `
        <div class="carousel-wrapper reviews-carousel">
            <button class="carousel-btn carousel-btn-prev" id="reviewsPrev">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="reviewsTrack">
                    ${reviewsData.map((review) => {
                        const category = categoryMap[review.category] || { color: '#888', label: review.category };
                        return `
                            <div class="review-card" data-review-id="${review.id}">
                                <div class="review-category-tag" style="background: ${category.color};">${category.label}</div>
                                <div class="review-card-body">
                                    <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                                    <p>"${review.text}"</p>
                                    <cite>— ${review.name}</cite>
                                    <div class="review-date">${review.date}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="reviewsNext">›</button>
        </div>
        <div class="carousel-dots" id="reviewsDots"></div>
    `;
}