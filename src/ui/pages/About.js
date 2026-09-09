// ==========================================
// ABOUT
// ==========================================

import { siteConfig } from '/data/siteConfig.js';

export function renderAbout() {
    const person = siteConfig.person;
    const images = siteConfig.images;

    return `
        <div class="about-grid">
            <div class="about-image animate-on-scroll">
                <img src="${images.aboutPhoto}" alt="${person.name}" />
            </div>
            <div class="about-content animate-on-scroll" style="animation-delay: 0.1s;">
                <h3 data-editable="about.name">${person.name}</h3>
                <div class="about-experience" data-editable="about.experience">${person.shortProfession}</div>
                <p data-editable="about.intro"><strong>Привет! Я ${person.name}.</strong> ${person.bio}</p>
                <p data-editable="about.description">${person.description}</p>
                <div class="about-meta">
                    ${siteConfig.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}