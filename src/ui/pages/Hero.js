export function renderHero(data) {
    return `
        <section class="section section-hero" id="home">
            <div class="section-bg" style="background-image: url('${data.bgImage}');"></div>
            <div class="section-overlay"></div>
            <div class="container hero-inner">
                <div class="hero-text">
                    <!-- ✅ data-editable="hero.name" -->
                    <h1 class="animate-on-scroll" data-editable="hero.name">${data.name}</h1>
                    
                    <!-- ✅ data-editable="hero.subtitle" -->
                    <p class="subtitle animate-on-scroll" data-editable="hero.subtitle" style="animation-delay: 0.1s;">
                        ${data.subtitle}
                    </p>
                    
                    <!-- ✅ data-editable="hero.description" -->
                    <p class="description animate-on-scroll" data-editable="hero.description" style="animation-delay: 0.2s;">
                        ${data.description}
                    </p>
                    
                    <div class="hero-actions animate-on-scroll" style="animation-delay: 0.3s;">
                        <a href="#contacts" class="btn btn-primary">Связаться</a>
                        <a href="#about" class="btn btn-outline">Узнать больше</a>
                    </div>
                </div>
                <div class="hero-image animate-on-scroll" style="animation-delay: 0.15s;">
                    <img src="${data.photo}" alt="${data.name}" />
                </div>
            </div>
        </section>
    `;
}