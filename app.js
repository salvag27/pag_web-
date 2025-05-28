const productos = [];

document.getElementById('formulario')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value.trim());

  if (nombre && !isNaN(precio) && precio > 0) {
    productos.push({ nombre, precio });
    renderProductos();
    this.reset();
  } else {
    alert("Por favor ingrese un nombre válido y un precio mayor a 0.");
  }
});

function renderProductos() {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos cargados aún.</p>';
    return;
  }

  productos.forEach((producto, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${producto.nombre}</strong> - $${producto.precio.toFixed(2)}</p>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  renderProductos();
}
