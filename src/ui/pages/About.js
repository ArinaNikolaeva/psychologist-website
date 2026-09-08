export function renderAbout(data) {
    return `
        <div class="about-grid">
            <div class="about-image animate-on-scroll">
                <img src="${data.image}" alt="${data.name}" />
            </div>
            <div class="about-content animate-on-scroll" style="animation-delay: 0.1s;">
                <p class="about-experience">${data.experience}</p>
                <p><strong>Привет! Я ${data.name}.</strong> ${data.intro}</p>
                <p>${data.description}</p>
                <div class="about-meta">
                    ${data.meta.map(m => `<span>${m}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}