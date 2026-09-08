export function initCarousel(trackId, prevBtnId, nextBtnId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !prevBtn || !nextBtn) return;

    // Поддерживаем и .carousel-slide (статьи) и .review-card (отзывы)
    const slides = track.querySelectorAll('.carousel-slide, .review-card');
    const total = slides.length;
    const perView = window.innerWidth < 768 ? 1 : 2;
    const gap = 24;
    let current = 0;

    if (total <= perView) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        return;
    }

    function update(animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        const w = track.parentElement?.offsetWidth || 800;
        const slideW = Math.floor((w - gap * (perView - 1)) / perView);
        track.style.transform = `translateX(-${current * (slideW + gap)}px)`;

        const dots = dotsContainer?.querySelectorAll('.carousel-dot') || [];
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        // СТРЕЛКИ ИСЧЕЗАЮТ НА КРАЯХ
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= total - perView;

        // Визуально скрываем кнопки (чтобы они не просто были disabled, а исчезали)
        prevBtn.style.opacity = current === 0 ? '0' : '1';
        prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = current >= total - perView ? '0' : '1';
        nextBtn.style.pointerEvents = current >= total - perView ? 'none' : 'auto';
    }

    prevBtn.addEventListener('click', () => {
        if (current > 0) {
            current--;
            update(true);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (current < total - perView) {
            current++;
            update(true);
        }
    });

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= total - perView; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                current = i;
                update(true);
            });
            dotsContainer.appendChild(dot);
        }
    }

    setTimeout(() => update(false), 50);

    console.log(`🔄 Карусель "${trackId}" инициализирована: ${total} слайдов, ${perView} на экран`);
}