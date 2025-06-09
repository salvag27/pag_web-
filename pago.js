document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Serás redirigido a la página principal.");
        window.location.href = 'index.html';
        return;
    }

    const resumenContenedor = document.getElementById('resumen-compra-pago');
    const totalElemento = document.getElementById('total-pago');
    const contadorElemento = document.getElementById('contador-pago');
    const formulario = document.getElementById('formulario-pago');
    const radioEnvio = document.getElementById('envio');
    const radioRetiro = document.getElementById('retiro');
    const camposEnvio = document.getElementById('campos-envio');
    const camposRetiro = document.getElementById('campos-retiro');
    const inputDireccion = document.getElementById('direccion');
    const selectSucursal = document.getElementById('sucursal');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');

    function mostrarResumen() {
        resumenContenedor.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
            li.innerHTML = `<div><h6 class="my-0">${item.nombre}</h6><small class="text-muted">Cantidad: ${item.cantidad}</small></div><span class="text-muted">$${(item.precio * item.cantidad).toFixed(2)}</span>`;
            resumenContenedor.appendChild(li);
            total += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        totalElemento.textContent = `$${total.toFixed(2)}`;
        contadorElemento.textContent = totalItems;
    }

    function gestionarOpcionesEntrega() {
        if (radioEnvio.checked) {
            camposEnvio.style.display = 'block';
            camposRetiro.style.display = 'none';
            inputDireccion.required = true;
            selectSucursal.required = false;
            inputTelefono.required = true;
        } else {
            camposEnvio.style.display = 'none';
            camposRetiro.style.display = 'block';
            inputDireccion.required = false;
            selectSucursal.required = true;
            inputTelefono.required = false;
        }
    }

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!formulario.checkValidity()) {
            formulario.classList.add('was-validated');
            return;
        }
        
        const historialCompras = JSON.parse(localStorage.getItem('historialComprasTauroCafe')) || [];
        const totalCompra = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        const nuevaCompra = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-AR'),
            items: carrito,
            total: totalCompra,
            entrega: {
                metodo: radioEnvio.checked ? 'Envío a Domicilio' : 'Retiro en Sucursal',
                detalle: radioEnvio.checked ? inputDireccion.value : selectSucursal.options[selectSucursal.selectedIndex].text,
                contacto: {
                    email: inputEmail.value,
                    telefono: inputTelefono.value
                }
            }
        };

        historialCompras.push(nuevaCompra);

        localStorage.setItem('historialComprasTauroCafe', JSON.stringify(historialCompras));
        
        alert('¡Compra realizada con éxito! Recibirás la factura y el estado del envío en tu correo. Gracias por elegir Tauro Café.');
        
        localStorage.removeItem('carritoTauroCafe');

        window.location.href = 'index.html';
    });
    
    radioEnvio.addEventListener('change', gestionarOpcionesEntrega);
    radioRetiro.addEventListener('change', gestionarOpcionesEntrega);

    mostrarResumen();
    gestionarOpcionesEntrega();
});