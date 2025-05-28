document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling para los links del navbar
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

    // Inicializar Toasts de Bootstrap
    const toastLiveExample = document.getElementById('liveToast');
    if (toastLiveExample) {
        const toastTriggers = document.querySelectorAll('.product-toast-trigger');
        if (toastTriggers.length > 0) {
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastTriggers.forEach(toastTrigger => {
                toastTrigger.addEventListener('click', (event) => {
                    const customMessage = event.currentTarget.dataset.toastMessage;
                    const card = event.currentTarget.closest('.card');
                    const productName = card ? card.querySelector('.card-title').textContent : 'Tauro Café';
                    
                    toastLiveExample.querySelector('.toast-header strong').textContent = productName;
                    if (customMessage) {
                        toastLiveExample.querySelector('.toast-body').textContent = customMessage;
                    } else {
                        toastLiveExample.querySelector('.toast-body').textContent = `Has mostrado interés en ${productName}. ¡Excelente elección!`;
                    }
                    toastBootstrap.show();
                });
            });
        }
    }

    // Inicializar el Carousel Principal explícitamente
    const mainCarouselElement = document.getElementById('mainCarousel'); // ID del carousel
    if (mainCarouselElement) {
        const carousel = new bootstrap.Carousel(mainCarouselElement, {
            interval: false, // Para que NO se mueva automáticamente. Pon un número (ej. 5000 para 5 seg) si quieres auto-slide.
            wrap: true,      // Si el carousel debe ciclar continuamente.
            // ride: false    // 'carousel' para iniciar automáticamente al cargar, false para no hacerlo.
                             // (No es necesario si `interval` es false y no quieres auto-play)
        });
    }
});