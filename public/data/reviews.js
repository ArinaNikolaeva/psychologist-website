// ==========================================
// ДАННЫЕ ОТЗЫВОВ И УПРАВЛЕНИЕ ИМИ
// ==========================================

// ✅ ОСТАВЛЯЕМ ВАШИ ДАННЫЕ КАК ЕСТЬ
const reviewsData = [
    {
        id: 1,
        name: 'Екатерина',
        date: '15 марта 2026',
        rating: 5,
        category: 'отношения',
        text: 'Арина — потрясающий специалист! За несколько сессий помогла разобраться в сложных отношениях с партнёром. Очень бережный подход и глубокое понимание.',
        criteria: {
            professionalism: 5,
            empathy: 5,
            clarity: 5,
            effectiveness: 5,
            recommendation: 5
        }
    },
    {
        id: 2,
        name: 'Дмитрий',
        date: '2 февраля 2026',
        rating: 5,
        category: 'самооценка',
        text: 'Обратился с проблемой выгорания и низкой самооценки. Арина помогла увидеть ситуацию с другой стороны и найти опору в себе. Очень рекомендую!',
        criteria: {
            professionalism: 5,
            empathy: 4,
            clarity: 5,
            effectiveness: 5,
            recommendation: 5
        }
    },
    {
        id: 3,
        name: 'Ольга',
        date: '20 января 2026',
        rating: 4,
        category: 'эмоции',
        text: 'Хороший специалист. Внимательно слушает, задаёт правильные вопросы. Немного не хватило времени на проработку, но это уже индивидуально.',
        criteria: {
            professionalism: 4,
            empathy: 5,
            clarity: 4,
            effectiveness: 4,
            recommendation: 4
        }
    }
];

// ✅ ЭКСПОРТ ВАШИХ ДАННЫХ (НЕ МЕНЯЕМ)
export { reviewsData };

// === НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С localStorage (НЕ ЛОМАЕМ СТАРЫЕ) ===

const STORAGE_KEY = 'psychologist_reviews';

// Загрузить отзывы из localStorage или базовые
function loadReviews() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed;
            }
        } catch (e) {}
    }
    // Если нет сохранённых — сохраняем базовые
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsData));
    return JSON.parse(JSON.stringify(reviewsData));
}

function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ДОБАВИТЬ ОТЗЫВ (на модерацию)
export function addReview({ name, text, rating, category = 'эмоции', criteria = null }) {
    const reviews = loadReviews();
    const newReview = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        text: text.trim(),
        rating: Number(rating),
        category: category,
        date: new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        isModerated: false,
        criteria: criteria || { // Если критерии не переданы, создаём дефолтные
            professionalism: Number(rating),
            empathy: Number(rating),
            clarity: Number(rating),
            effectiveness: Number(rating),
            recommendation: Number(rating)
        }
    };
    reviews.push(newReview);
    saveReviews(reviews);
    return newReview;
}

// ПОЛУЧИТЬ ОПУБЛИКОВАННЫЕ ОТЗЫВЫ (для обратной совместимости)
export function getPublishedReviews() {
    const all = loadReviews();
    // Если у отзыва нет поля isModerated — считаем его опубликованным
    return all.filter(r => r.isModerated !== false);
}