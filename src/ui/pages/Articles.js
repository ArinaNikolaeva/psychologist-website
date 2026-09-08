import { articlesData } from '../../../public/data/articles.js';

export function renderArticles() {
    return `
        <div class="carousel-wrapper">
            <button class="carousel-btn carousel-btn-prev" id="carouselPrev" aria-label="Предыдущая статья">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="carouselTrack">
                    ${articlesData.map((article, index) => `
                        <article class="carousel-slide card-article" data-article-id="${index}">
                            <div class="card-image">
                                <img src="${article.image}" alt="${article.title}" loading="lazy" />
                                <span class="card-category">${article.category}</span>
                            </div>
                            <div class="card-body">
                                <h3>${article.title}</h3>
                                <p>${article.preview}</p>
                                <div class="meta">${article.date} · ${article.readingTime}</div>
                                <button class="btn-read-more" data-article-id="${index}">Читать полностью →</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="carouselNext" aria-label="Следующая статья">›</button>
        </div>
        <div class="carousel-dots" id="carouselDots"></div>
    `;
}