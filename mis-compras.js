document.addEventListener('DOMContentLoaded', () => {
    const historialContainer = document.getElementById('historial-compras-container');
    const historial = JSON.parse(localStorage.getItem('historialComprasTauroCafe')) || [];

    if (historial.length === 0) {
        historialContainer.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                Aún no has realizado ninguna compra. ¡Explora nuestros <a href="index.html#granos" class="alert-link">productos</a>!
            </div>
        `;
        return;
    }
    historial.sort((a, b) => b.id - a.id);

    historial.forEach(compra => {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item', 'mb-3');

        let itemsHtml = '';
        compra.items.forEach(item => {
            itemsHtml += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.nombre} (x${item.cantidad})</span>
                    <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                </li>`;
        });

        accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading-${compra.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${compra.id}" aria-expanded="false" aria-controls="collapse-${compra.id}">
                    <div class="d-flex w-100 justify-content-between pe-3">
                        <strong>Compra #${compra.id}</strong>
                        <span>Fecha: ${compra.fecha}</span>
                        <span>Total: $${compra.total.toFixed(2)}</span>
                    </div>
                </button>
            </h2>
            <div id="collapse-${compra.id}" class="accordion-collapse collapse" aria-labelledby="heading-${compra.id}" data-bs-parent="#historial-compras-container">
                <div class="accordion-body">
                    <div class="row">
                        <div class="col-md-7">
                            <h5>Productos</h5>
                            <ul class="list-group mb-3">
                                ${itemsHtml}
                            </ul>
                        </div>
                        <div class="col-md-5">
                            <h5>Detalles de Entrega y Contacto</h5>
                            <p>
                                <strong>Método:</strong> ${compra.entrega.metodo}<br>
                                <strong>Detalle:</strong> ${compra.entrega.detalle}<br>
                                <strong>Email:</strong> ${compra.entrega.contacto.email}<br>
                                ${compra.entrega.contacto.telefono ? `<strong>Teléfono:</strong> ${compra.entrega.contacto.telefono}` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        historialContainer.appendChild(accordionItem);
    });
});