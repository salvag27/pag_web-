
let carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const botonesAgregar = document.querySelectorAll('.botonAgregarTauro'); 
    const offcanvasCarrito = document.getElementById("carritoOffcanvasTauro"); 

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-nombre');
            const precio = parseFloat(this.getAttribute('data-precio'));
            const imagen = this.getAttribute('data-imagen');

            if (id && nombre && !isNaN(precio) && imagen) {
                agregarAlCarrito(id, nombre, precio, imagen);
            } else {
                console.error("Faltan datos en el botón para agregar al carrito:", this.dataset);
            }
        });
    });

    if (offcanvasCarrito) {
        offcanvasCarrito.addEventListener("show.bs.offcanvas", function () {
            mostrarCarrito();
        });
    }
    actualizarContadorIconoCarrito();
});

function agregarAlCarrito(idProducto, nombreProducto, precioProducto, imagenProducto) {
    const itemEnCarrito = carrito.find(p => p.id === idProducto);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        carrito.push({ id: idProducto, nombre: nombreProducto, precio: precioProducto, imagen: imagenProducto, cantidad: 1 });
    }
    localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
    mostrarMensajeToast(`"${nombreProducto}" agregado al carrito.`);
    actualizarContadorIconoCarrito();
}

function mostrarCarrito() {
    carrito = JSON.parse(localStorage.getItem('carritoTauroCafe')) || [];
    const contenedor = document.getElementById('listaCarritoTauro');
    contenedor.innerHTML = ''; 

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-muted p-3">No hay productos en el carrito todavía.</p>`;
        actualizarContadorIconoCarrito();
        return;
    }

    carrito.forEach(item => {
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

    let total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('mt-3', 'pt-3', 'border-top', 'text-end');
    totalDiv.innerHTML = `<h5>Total: <strong class="text-primary">$${total.toFixed(2)}</strong></h5>`;
    contenedor.appendChild(totalDiv);

    if (carrito.length > 0 && !document.getElementById('contenedorBotonesEdicionTauro')) {
        const contenedorBotonesEdicion = document.createElement('div');
        contenedorBotonesEdicion.id = `contenedorBotonesEdicionTauro`;
        contenedorBotonesEdicion.classList.add('mt-4', 'd-grid', 'gap-2'); 

        const botonVaciar = document.createElement('button');
        botonVaciar.innerHTML = `Vaciar Carrito`;
        botonVaciar.classList.add('btn', 'btn-outline-danger');
        botonVaciar.addEventListener('click', () => {
            carrito = [];
            localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
            mostrarCarrito();
            mostrarMensajeToast("Carrito vaciado.");
        });

        const botonPagar = document.createElement('button');
        botonPagar.innerHTML = `Finalizar Compra`;
        botonPagar.classList.add('btn', 'btn-primary');
        botonPagar.addEventListener('click', () => {
        
            window.location.href = 'pago.html';
        });

        contenedorBotonesEdicion.appendChild(botonVaciar);
        contenedorBotonesEdicion.appendChild(botonPagar);
        contenedor.appendChild(contenedorBotonesEdicion);
    }
    
    asignarListenersBotonesInternosCarrito();
    actualizarContadorIconoCarrito();
}

function asignarListenersBotonesInternosCarrito() {
    document.querySelectorAll('.botonAumentarCantidad').forEach(boton => {
        let nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        nuevoBoton.addEventListener('click', () => {
            const id = nuevoBoton.getAttribute('data-id');
            const item = carrito.find(p => p.id === id);
            if (item) {
                item.cantidad += 1;
                localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
                mostrarCarrito(); 
            }
        });
    });

    document.querySelectorAll('.botonDisminuirCantidad').forEach(boton => {
        let nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        nuevoBoton.addEventListener('click', () => {
            const id = nuevoBoton.getAttribute('data-id');
            const itemIndex = carrito.findIndex(p => p.id === id); 
            if (itemIndex !== -1) {
                if (carrito[itemIndex].cantidad > 1) {
                    carrito[itemIndex].cantidad -= 1;
                } else {
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
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem('carritoTauroCafe', JSON.stringify(carrito));
            mostrarCarrito();
            mostrarMensajeToast("Producto eliminado del carrito.");
        });
    });
}

function mostrarMensajeToast(mensaje) {
    const toastEl = document.getElementById('productoAgregadoTauroToast'); 
    if (!toastEl) {
        console.error("Elemento Toast 'productoAgregadoTauroToast' no encontrado.");
        alert(mensaje); 
        return;
    }
    const toastBody = toastEl.querySelector('.toast-body p'); 
    if (toastBody) {
        toastBody.textContent = mensaje;
    } else {
        toastEl.querySelector('.toast-body').textContent = mensaje; 
    }
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function actualizarContadorIconoCarrito() {
    const spansContador = document.querySelectorAll('.contador-carrito-display'); 
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    spansContador.forEach(span => {
        span.textContent = totalItems;
    });
}