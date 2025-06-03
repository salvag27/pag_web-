

let carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const botonesAgregar = document.querySelectorAll('.botonAgregarTauro'); // Clase de los botones de Tauro Café
    const offcanvasCarrito = document.getElementById("carritoOffcanvasTauro"); // ID del offcanvas de Tauro Café

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function (e) {
            e.preventDefault();
            // Obtener datos del producto desde los data-attributes del botón
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-nombre');
            const precio = parseFloat(this.getAttribute('data-precio')); // Convertir precio a número
            const imagen = this.getAttribute('data-imagen'); // Nueva: obtener la imagen

            // Validar que los datos necesarios estén presentes
            if (id && nombre && !isNaN(precio) && imagen) {
                agregarAlCarrito(id, nombre, precio, imagen);
            } else {
                console.error("Faltan datos en el botón para agregar al carrito:", this.dataset);
                // Podrías mostrar un mensaje de error al usuario aquí también
            }
        });
    });

    if (offcanvasCarrito) {
        offcanvasCarrito.addEventListener("show.bs.offcanvas", function () {
            mostrarCarrito();
        });
    }
    actualizarContadorIconoCarrito(); // Actualizar contador al cargar
});

function agregarAlCarrito(idProducto, nombreProducto, precioProducto, imagenProducto) {
    const itemEnCarrito = carrito.find(p => p.id === idProducto);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        // Guardar también la imagen
        carrito.push({ 
            id: idProducto, 
            nombre: nombreProducto, 
            precio: precioProducto, 
            imagen: imagenProducto, // Nueva propiedad
            cantidad: 1 
        });
    }
    localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
    mostrarMensajeToast(`"${nombreProducto}" agregado al carrito.`);
    actualizarContadorIconoCarrito();
}

function mostrarCarrito() {
    carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];
    const contenedor = document.getElementById('listaCarritoTauro'); // ID del contenedor en Tauro Café
    contenedor.innerHTML = ''; // Limpiar el contenedor antes de redibujar

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-muted p-3">No hay productos en el carrito todavía.</p>`;
        actualizarContadorIconoCarrito(); // Asegurar que el contador esté en 0
        return;
    }

    carrito.forEach(item => {
        // Crear estructura HTML para cada producto en el carrito (incluyendo imagen)
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-en-carrito', 'd-flex', 'align-items-start', 'mb-3', 'pb-3', 'border-bottom');
        productoDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.nombre}</h6>
                <p class="mb-1 text-muted small">Precio: $${item.precio.toFixed(2)}</p>
                <div class="d-flex align-items-center justify-content-start">
                    <button class="btn btn-outline-secondary btn-sm botonDisminuirCantidad" data-id="${item.id}" style="padding: 0.1rem 0.4rem;">-</button>
                    <span class="mx-2 px-2 border rounded" style="min-width: 30px; text-align:center;">${item.cantidad}</span>
                    <button class="btn btn-outline-secondary btn-sm botonAumentarCantidad" data-id="${item.id}" style="padding: 0.1rem 0.4rem;">+</button>
                </div>
            </div>
            <button class="btn btn-outline-danger btn-sm ms-auto botonEliminarDelCarrito" data-id="${item.id}" style="padding: 0.2rem 0.5rem;">
                <i class="bi bi-trash3"></i>
            </button>
        `;
        contenedor.appendChild(productoDiv);
    });

    // Calcular y mostrar el total
    let total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('mt-3', 'pt-3', 'border-top', 'text-end');
    totalDiv.innerHTML = `<h5>Total: <strong class="text-primary">$${total.toFixed(2)}</strong></h5>`;
    contenedor.appendChild(totalDiv);

    // Botones de Vaciar y Pagar (si el carrito no está vacío)
    if (carrito.length > 0 && !document.getElementById('contenedorBotonesEdicionTauro')) {
        const contenedorBotonesEdicion = document.createElement('div');
        contenedorBotonesEdicion.id = `contenedorBotonesEdicionTauro`;
        contenedorBotonesEdicion.classList.add('mt-4', 'd-grid', 'gap-2'); // Usar d-grid para que los botones ocupen el ancho

        const botonVaciar = document.createElement('button');
        botonVaciar.innerHTML = `Vaciar Carrito`;
        botonVaciar.id = `botonVaciarCarrito`;
        botonVaciar.classList.add('btn', 'btn-outline-danger');
        botonVaciar.addEventListener('click', () => {
            carrito = [];
            localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
            mostrarCarrito(); // Actualizar la vista
            mostrarMensajeToast("Carrito vaciado.");
        });

        const botonPagar = document.createElement('button');
        botonPagar.innerHTML = `Finalizar Compra`;
        botonPagar.id = `botonPagar`;
        botonPagar.classList.add('btn', 'btn-primary');
        botonPagar.addEventListener('click', () => {
            alert('Procediendo al pago (simulación)...');
            // Aquí iría la lógica para redirigir a una página de pago o procesar el pedido
        });

        contenedorBotonesEdicion.appendChild(botonVaciar);
        contenedorBotonesEdicion.appendChild(botonPagar);
        contenedor.appendChild(contenedorBotonesEdicion);
    }
    
    // Reasignar listeners a los nuevos botones +/- y eliminar
    asignarListenersBotonesInternosCarrito();
    actualizarContadorIconoCarrito();
}

function asignarListenersBotonesInternosCarrito() {
    document.querySelectorAll('.botonAumentarCantidad').forEach(boton => {
        // Para evitar duplicar listeners, removemos el viejo y agregamos uno nuevo.
        // Una forma más limpia es clonar el nodo.
        let nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        nuevoBoton.addEventListener('click', () => {
            const id = nuevoBoton.getAttribute('data-id');
            const item = carrito.find(p => p.id === id);
            if (item) {
                item.cantidad += 1;
                localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
                mostrarCarrito(); // Redibujar para actualizar cantidad y total
            }
        });
    });

    document.querySelectorAll('.botonDisminuirCantidad').forEach(boton => {
        let nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        nuevoBoton.addEventListener('click', () => {
            const id = nuevoBoton.getAttribute('data-id');
            const itemIndex = carrito.findIndex(p => p.id === id); // Necesitamos el índice para poder eliminar
            if (itemIndex !== -1) {
                if (carrito[itemIndex].cantidad > 1) {
                    carrito[itemIndex].cantidad -= 1;
                } else {
                    // Si la cantidad es 1, disminuir significa eliminar el producto
                    carrito.splice(itemIndex, 1);
                }
                localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
                mostrarCarrito();
            }
        });
    });

    document.querySelectorAll('.botonEliminarDelCarrito').forEach(boton => {
        let nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        nuevoBoton.addEventListener('click', () => {
            const id = nuevoBoton.getAttribute('data-id');
            carrito = carrito.filter(p => p.id !== id); // Filtrar para eliminar
            localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
            mostrarCarrito();
            mostrarMensajeToast("Producto eliminado del carrito.");
        });
    });
}

function mostrarMensajeToast(mensaje) {
    const toastEl = document.getElementById('productoAgregadoTauroToast'); // ID del Toast en Tauro Café
    if (!toastEl) {
        console.error("Elemento Toast 'productoAgregadoTauroToast' no encontrado.");
        alert(mensaje); // Fallback si el toast no existe
        return;
    }
    const toastBody = toastEl.querySelector('.toast-body p'); // El <p> dentro del toast-body
    if (toastBody) {
        toastBody.textContent = mensaje; // Usar textContent para seguridad
    } else {
        toastEl.querySelector('.toast-body').textContent = mensaje; // Fallback si no hay <p>
    }
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function actualizarContadorIconoCarrito() {
    const spansContador = document.querySelectorAll('.contador-carrito-display'); // Clase para el span del contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    spansContador.forEach(span => {
        span.textContent = totalItems;
    });
}