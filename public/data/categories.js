// ==========================================
// КАТЕГОРИИ ДЛЯ СТАТЕЙ, ОТЗЫВОВ И ТЕМ
// ==========================================

// === КАТЕГОРИИ ДЛЯ ОТЗЫВОВ ===
export const reviewCategories = [
    { value: 'отношения', label: 'Отношения' },
    { value: 'самооценка', label: 'Самооценка' },
    { value: 'кризис', label: 'Кризис' },
    { value: 'эмоции', label: 'Эмоции' },
    { value: 'коммуникация', label: 'Коммуникация' },
    { value: 'разработка', label: 'Веб-разработка' },
    { value: 'бизнес', label: 'Бизнес' }
];

// === КАТЕГОРИИ ДЛЯ СТАТЕЙ ===
export const articleCategories = [
    'Отношения',
    'Кризисы',
    'Самооценка',
    'Психология',
    'Эмоции',
    'Коммуникация',
    'Веб-разработка',
    'Бизнес'
];

// === MAP ДЛЯ ОТОБРАЖЕНИЯ КАТЕГОРИЙ (цвет + подпись) ===
export const categoryMap = {
    'отношения': { color: '#D48B6A', label: 'Отношения' },
    'самооценка': { color: '#6A9C89', label: 'Самооценка' },
    'кризис': { color: '#C47A7A', label: 'Кризис' },
    'эмоции': { color: '#B8A08A', label: 'Эмоции' },
    'коммуникация': { color: '#7A9BA8', label: 'Коммуникация' },
    'разработка': { color: '#A88B6A', label: 'Веб-разработка' },
    'бизнес': { color: '#6A8B9C', label: 'Бизнес' }
};

// === ХЕЛПЕРЫ ===
export function getCategoryLabel(value) {
    const found = reviewCategories.find(c => c.value === value);
    return found ? found.label : value;
}

export function getCategoryColor(value) {
    return categoryMap[value]?.color || '#888';
}

export function getCategoryInfo(value) {
    return categoryMap[value] || { color: '#888', label: value };
}