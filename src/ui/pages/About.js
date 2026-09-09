export function renderAbout(data) {
    return `
        <div class="about-grid">
            <div class="about-image animate-on-scroll">
                <img src="${data.image}" alt="${data.name}" />
            </div>
            <div class="about-content animate-on-scroll" style="animation-delay: 0.1s;">
                <!-- ИМЯ — отдельно -->
                <h3 data-editable="about.name" style="display: block; width: 100%;">${data.name}</h3>
                
                <!-- СПЕЦИАЛИЗАЦИЯ — отдельно -->
                <p class="about-experience" data-editable="about.experience" style="display: block; width: 100%;">${data.experience}</p>
                
                <!-- ПЕРВЫЙ АБЗАЦ — отдельно -->
                <p data-editable="about.intro" style="display: block; width: 100%;">
                    <strong>Привет! Я ${data.name}.</strong> ${data.intro}
                </p>
                
                <!-- ВТОРОЙ АБЗАЦ — отдельно -->
                <p data-editable="about.description" style="display: block; width: 100%;">
                    ${data.description}
                </p>
                
                <div class="about-meta">
                    ${data.meta.map(m => `<span>${m}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}