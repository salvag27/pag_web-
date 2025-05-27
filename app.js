const productos = [];

document.getElementById('formulario')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;

  if (nombre && precio) {
    productos.push({ nombre, precio });
    renderProductos();
    this.reset();
  }
});

function renderProductos() {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos.forEach((p, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${p.nombre}</strong> - $${p.precio}</p>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  renderProductos();
}
