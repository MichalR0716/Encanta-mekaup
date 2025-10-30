// Función principal del carrusel
function initCarousel() {
    const carousel = document.getElementById('mainCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.carousel-control.prev');
    const next = carousel.querySelector('.carousel-control.next');
    const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    let index = 0;
    let isTransitioning = false;

    function update(newIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        index = newIndex;
        const percent = -index * 100;
        track.style.transform = `translateX(${percent}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    function startAutoplay() {
        return setInterval(() => {
            const newIndex = (index + 1) % slides.length;
            update(newIndex);
        }, 5000);
    }

    // Event Listeners
    prev?.addEventListener('click', () => {
        const newIndex = (index - 1 + slides.length) % slides.length;
        update(newIndex);
    });

    next?.addEventListener('click', () => {
        const newIndex = (index + 1) % slides.length;
        update(newIndex);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (index === i) return;
            update(i);
        });
    });

    // Iniciar carrusel
    update(0);
    let autoplayTimer = startAutoplay();

    // Pausar/reanudar autoplay en hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayTimer);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoplayTimer = startAutoplay();
    });

    // Soporte de teclado
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev?.click();
        if (e.key === 'ArrowRight') next?.click();
    });
}

// Exportar la función para uso global
window.initCarousel = initCarousel;