document.addEventListener('DOMContentLoaded', function () {
    const carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];

    const resumenContenedor = document.getElementById('resumen-compra-pago');
    const contadorPago = document.getElementById('contador-pago');
    const totalPago = document.getElementById('total-pago');
    const formulario = document.getElementById('formulario-pago');

    function renderizarResumen() {
        resumenContenedor.innerHTML = '';
        if (carrito.length === 0) {
            resumenContenedor.innerHTML = '<li class="list-group-item">No hay productos para pagar.</li>';
            if (formulario) formulario.querySelector('button[type="submit"]').disabled = true;
            return;
        }

        let totalGeneral = 0;
        let totalItems = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.nombre}</h6>
                    <small class="text-muted">Cantidad: ${item.cantidad}</small>
                </div>
                <span class="text-muted">$${(item.precio * item.cantidad).toFixed(2)}</span>
            `;
            resumenContenedor.appendChild(li);
            totalGeneral += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        if (contadorPago) contadorPago.textContent = totalItems;
        if (totalPago) totalPago.textContent = `$${totalGeneral.toFixed(2)}`;
    }

    const radioEnvio = document.getElementById('envio');
    const radioRetiro = document.getElementById('retiro');
    const camposEnvio = document.getElementById('campos-envio');
    const camposRetiro = document.getElementById('campos-retiro');
    const inputDireccion = document.getElementById('direccion');
    const selectSucursal = document.getElementById('sucursal');

    function toggleEntrega() {
        if (radioEnvio.checked) {
            camposEnvio.style.display = 'block';
            camposRetiro.style.display = 'none';
            inputDireccion.required = true;
            selectSucursal.required = false;
        } else {
            camposEnvio.style.display = 'none';
            camposRetiro.style.display = 'block';
            inputDireccion.required = false;
            selectSucursal.required = true;
        }
    }

    radioEnvio.addEventListener('change', toggleEntrega);
    radioRetiro.addEventListener('change', toggleEntrega);

    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (formulario.checkValidity()) {

                const historial = JSON.parse(localStorage.getItem('historialComprasTauroCafe')) || [];
                const carritoActual = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];

                if(carritoActual.length === 0) {
                    alert("Error: El carrito está vacío.");
                    return;
                }
                
                const totalCompra = carritoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                
                const nuevaCompra = {
                    id: Date.now(), 
                    fecha: new Date().toLocaleDateString('es-AR'),
                    items: carritoActual,
                    total: totalCompra,
                    entrega: {
                        metodo: radioEnvio.checked ? 'Envío a Domicilio' : 'Retirar en Sucursal',
                        detalle: radioEnvio.checked ? inputDireccion.value : selectSucursal.options[selectSucursal.selectedIndex].text,
                        contacto: {
                            email: document.getElementById('email').value,
                            telefono: document.getElementById('telefono').value
                        }
                    }
                };

                historial.push(nuevaCompra);
                localStorage.setItem('historialComprasTauroCafe', JSON.stringify(historial));
                // Vacia el carrito actual
                localStorage.removeItem('carritoTauroCafe');

                alert('¡Compra realizada con éxito! Serás redirigido a tu historial de compras.');
                window.location.href = 'mis-compras.html';
            }
            
            formulario.classList.add('was-validated');
        });
    }

    renderizarResumen();
    toggleEntrega();
});