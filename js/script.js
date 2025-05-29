document.addEventListener('DOMContentLoaded', function () {
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1 && document.querySelector(this.getAttribute('href'))) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    const mainCarouselElement = document.getElementById('mainCarousel'); // ID del carousel
    if (mainCarouselElement) {
        const carousel = new bootstrap.Carousel(mainCarouselElement, {
            interval: 3000, 
            wrap: true,      
            ride: true,   
        });
    }
});