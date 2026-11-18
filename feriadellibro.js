function inicializarCarrusel(idCarrusel) {
    const contenedor = document.getElementById(idCarrusel);
    if (!contenedor) return;

    const track = contenedor.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = contenedor.querySelector('.carousel-button.next');
    const prevButton = contenedor.querySelector('.carousel-button.prev');
    const dotsNav = contenedor.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
        track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';
        dots.forEach((dot, idx) => {
            dot.classList.toggle('current-slide', idx === targetIndex);
        });
    };

    nextButton.addEventListener('click', () => {
        let currentIndex = slides.findIndex(slide => track.style.transform.includes(`-${slides.indexOf(slide) * 100}%`));
        if (currentIndex === -1 || track.style.transform === "") currentIndex = 0;
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
        let currentIndex = slides.findIndex(slide => track.style.transform.includes(`-${slides.indexOf(slide) * 100}%`));
        if (currentIndex === -1 || track.style.transform === "") currentIndex = 0;
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(prevIndex);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        moveToSlide(targetIndex);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrusel('carrusel1');
    inicializarCarrusel('carrusel2');
});