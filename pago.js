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

    // Lógica para mostrar/ocultar campos de envío/retiro
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

    // Simulación de envío de formulario
    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (formulario.checkValidity()) {
                // Formulario válido, simular compra
                alert('¡Compra realizada con éxito! Gracias por elegir Tauro Café.');
                
                // Vaciar carrito
                localStorage.removeItem('carritoTauroCafe');
                
                // Redirigir al inicio
                window.location.href = 'index.html';
            }
            
            formulario.classList.add('was-validated');
        });
    }

    // Carga inicial
    renderizarResumen();
    toggleEntrega(); // Asegura que el estado inicial de los radio buttons sea correcto
});