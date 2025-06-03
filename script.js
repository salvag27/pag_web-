document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {

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

    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartItemCountEls = document.querySelectorAll('.cart-item-count');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyCartMessage = cartItemsContainer ? cartItemsContainer.querySelector('.empty-cart-message') : null;

    const CART_STORAGE_KEY = 'tauroCafeCart';

    function saveCartToLocalStorage() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            if (emptyCartMessage) {
                cartItemsContainer.appendChild(emptyCartMessage.cloneNode(true));
            } else {
                cartItemsContainer.innerHTML = '<p class="text-center text-muted empty-cart-message">Tu carrito está vacío.</p>';
            }
            if (checkoutButton) checkoutButton.disabled = true;
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h6>${item.name}</h6>
                        <p>Precio: $${parseFloat(item.price).toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="btn btn-sm btn-quantity decrease-quantity" data-id="${item.id}"><i class="bi bi-dash-lg"></i></button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="btn btn-sm btn-quantity increase-quantity" data-id="${item.id}"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </div>
                    <div class="cart-item-actions ms-auto text-end">
                        <p class="mb-1 fw-bold">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        <button class="btn btn-sm btn-remove-item" data-id="${item.id}"><i class="bi bi-trash3"></i> Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                totalPrice += parseFloat(item.price) * item.quantity;
                totalItems += item.quantity;
            });
            if (checkoutButton) checkoutButton.disabled = false;
        }

        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
        cartItemCountEls.forEach(el => el.textContent = totalItems);
    }

    function addToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
        }
        showToast(`"${productName}" agregado al carrito.`);
        saveCartToLocalStorage();
        renderCart();
    }

    function updateQuantity(productId, newQuantity) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                cart.splice(itemIndex, 1);
                showToast(`Producto eliminado del carrito.`);
            } else {
                cart[itemIndex].quantity = newQuantity;
            }
            saveCartToLocalStorage();
            renderCart();
        }
    }

    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            showToast(`"${removedItemName}" eliminado del carrito.`);
            saveCartToLocalStorage();
            renderCart();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.add-to-cart-btn') || event.target.closest('.add-to-cart-btn-detail')) {
            const button = event.target.closest('.add-to-cart-btn') || event.target.closest('.add-to-cart-btn-detail');
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;
            let image = button.dataset.image;

            if (!image) {
                const card = button.closest('.product-card');
                if (card) {
                    const imgEl = card.querySelector('.product-image');
                    if (imgEl) image = imgEl.src;
                }
            }
            if (!image && document.getElementById('product-image')) {
                image = document.getElementById('product-image').src;
            }

            if (id && name && price && image) {
                addToCart(id, name, price, image);
            } else {
                console.error("Faltan datos del producto para agregar al carrito:", {id, name, price, image});
                showToast("Error al agregar producto. Faltan datos.", "Error");
            }
        }

        if (event.target.closest('.increase-quantity')) {
            const button = event.target.closest('.increase-quantity');
            const productId = button.dataset.id;
            const item = cart.find(i => i.id === productId);
            if (item) updateQuantity(productId, item.quantity + 1);
        }

        if (event.target.closest('.decrease-quantity')) {
            const button = event.target.closest('.decrease-quantity');
            const productId = button.dataset.id;
            const item = cart.find(i => i.id === productId);
            if (item) updateQuantity(productId, item.quantity - 1);
        }

        if (event.target.closest('.btn-remove-item')) {
            const button = event.target.closest('.btn-remove-item');
            const productId = button.dataset.id;
            removeFromCart(productId);
        }
    });

    loadCartFromLocalStorage();

    const cartOffcanvas = document.getElementById('cartOffcanvas');
    if (cartOffcanvas) {
        cartOffcanvas.addEventListener('show.bs.offcanvas', () => {
            loadCartFromLocalStorage();
        });
    }
});

const sucursalImagePlaceholders = document.querySelectorAll('#foto-sucursal-placeholder, #foto-sucursal-placeholder-detail');
sucursalImagePlaceholders.forEach(img => {
    img.onerror = function() {
        this.alt = "Imagen de sucursal no disponible";
    };
    if (img.src.endsWith('TU_FOTO_SUCURSALES.jpg') || img.src.endsWith('placeholder_sucursal.jpg')) {
        img.src = 'https://via.placeholder.com/250x150/A08A7A/4a3b31?text=Nuestra+Sucursal';
    }
});

if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
        if (cart.length > 0) {
            showToast("¡Gracias por tu compra! (Función de checkout no implementada)", "Compra Exitosa");
            showToast("Tu carrito está vacío.", "Atención");
        }
    });
}
