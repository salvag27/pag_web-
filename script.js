document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = toastLiveExample ? new bootstrap.Toast(toastLiveExample, { delay: 3000 }) : null;

    function showToast(message, title = "Tauro Café") {
        if (toastBootstrap) {
            const toastBody = toastLiveExample.querySelector('.toast-body');
            const toastHeaderStrong = toastLiveExample.querySelector('.toast-header strong');
            if (toastBody) toastBody.textContent = message;
            if (toastHeaderStrong) toastHeaderStrong.textContent = title;
            toastBootstrap.show();
        }
    }

    document.querySelectorAll('.product-toast-trigger').forEach(button => {
        button.addEventListener('click', function() {
            const message = this.dataset.toastMessage || "Acción realizada.";
            showToast(message);
        });
    });


const sucursalImagePlaceholders = document.querySelectorAll('#foto-sucursal-placeholder, #foto-sucursal-placeholder-detail');
sucursalImagePlaceholders.forEach(img => {
    img.onerror = function() {
        this.alt = "Imagen de sucursal no disponible";
    };
    if (img.src.endsWith('TU_FOTO_SUCURSALES.jpg') || img.src.endsWith('placeholder_sucursal.jpg')) {
        img.src = 'https://via.placeholder.com/250x150/A08A7A/4a3b31?text=Nuestra+Sucursal';
    }
})
});
