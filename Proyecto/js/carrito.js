document.addEventListener("DOMContentLoaded", function () {

  var carrito = []; //  nombre, precio, imagen, cantidad 
  var COSTO_ENVIO = 3220; // Costo fijo de envío en colones

  // ---------- Utilidades ----------

  function limpiarPrecio(texto) {
    // Quita el símbolo ₡, espacios y separadores de miles, deja solo números y un punto decimal
    var limpio = texto.replace(/[^\d.,]/g, '').replace(/,/g, '');
    var partes = limpio.split('.').filter(Boolean);
    if (partes.length >= 2) {
      var decimales = partes.pop();
      limpio = partes.join('') + '.' + decimales;
    }
    return parseFloat(limpio) || 0;
  }

  function formatearPrecio(numero) {
    return '₡' + numero.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Extrae nombre, precio e imagen del producto a partir del botón agregar al carrito
  function obtenerInfoProducto(boton) {
    var wrapper = boton.closest('.ek-product-img-wrapper');
    var img = wrapper.querySelector('img');
    var tarjeta = boton.closest('.ek-product-card') || boton.closest('.ropa');

    var nombre, precioTexto;

    if (tarjeta.classList.contains('ek-product-card')) {
      // Tarjetas del carrusel "Los Favoritos"
      nombre = tarjeta.querySelector('.ek-name').textContent.trim();
      precioTexto = tarjeta.querySelector('.ek-price').textContent.trim();
    } else {
      // Tarjetas de "Nuevos Ingresos" (estructura con <p> simples)
      var parrafos = tarjeta.querySelectorAll('p');
      nombre = parrafos[0].textContent.trim();
      precioTexto = parrafos[1].textContent.trim();
    }

    return {
      name: nombre,
      price: limpiarPrecio(precioTexto),
      image: img.getAttribute('src')
    };
  }

  // ---------- Lógica del carrito ----------

  function agregarAlCarrito(producto) {
    var existente = carrito.find(function (item) { return item.name === producto.name; });
    if (existente) {
      existente.qty += 1;
    } else {
      carrito.push({ name: producto.name, price: producto.price, image: producto.image, qty: 1 });
    }
    renderizarCarrito();
  }

  window.agregarAlCarrito = agregarAlCarrito;

  function cambiarCantidad(nombre, delta) {
    var item = carrito.find(function (i) { return i.name === nombre; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      carrito = carrito.filter(function (i) { return i.name !== nombre; });
    }
    renderizarCarrito();
  }

  function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(function (i) { return i.name !== nombre; });
    renderizarCarrito();
  }

  // ---------- Renderizado ----------

  function renderizarCarrito() {
    var contenedor = document.getElementById('cart-items-container');
    var mensajeVacio = document.getElementById('cart-empty-message');
    var badge = document.getElementById('cart-count');

    var totalItems = carrito.reduce(function (acc, item) { return acc + item.qty; }, 0);
    badge.textContent = totalItems;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
      mensajeVacio.style.display = 'block';
    } else {
      mensajeVacio.style.display = 'none';

      carrito.forEach(function (item) {
        var fila = document.createElement('div');
        fila.className = 'd-flex mb-3 pb-3 border-bottom';
        fila.innerHTML =
          '<img src="' + item.image + '" alt="' + item.name + '" style="width: 70px; height: 90px; object-fit: cover;" class="me-3">' +
          '<div class="flex-grow-1">' +
          '<p class="mb-1 small fw-semibold">' + item.name + '</p>' +
          '<p class="mb-2 small text-secondary">' + formatearPrecio(item.price) + '</p>' +
          '<div class="d-flex align-items-center gap-2">' +
          '<button class="btn btn-sm btn-outline-secondary rounded-0 py-0 px-2 btn-restar" data-nombre="' + item.name + '">-</button>' +
          '<span class="small">' + item.qty + '</span>' +
          '<button class="btn btn-sm btn-outline-secondary rounded-0 py-0 px-2 btn-sumar" data-nombre="' + item.name + '">+</button>' +
          '</div>' +
          '</div>' +
          '<button class="btn btn-sm text-secondary btn-eliminar" data-nombre="' + item.name + '"><i class="bx bx-trash"></i></button>';
        contenedor.appendChild(fila);
      });
    }

    var subtotal = carrito.reduce(function (acc, item) { return acc + (item.price * item.qty); }, 0);
    var envio = carrito.length > 0 ? COSTO_ENVIO : 0;
    var descuento = 0;
    var total = subtotal - descuento + envio;

    document.getElementById('cart-subtotal').textContent = formatearPrecio(subtotal);
    document.getElementById('cart-discount').textContent = '- ' + formatearPrecio(descuento);
    document.getElementById('cart-shipping').textContent = formatearPrecio(envio);
    document.getElementById('cart-total').textContent = formatearPrecio(total);
  }

  // ---------- Event listeners ----------

  // Clic en cualquier botón "Agregar al carrito" (delegación de eventos, funciona para todas las tarjetas)
  document.addEventListener('click', function (e) {
    var botonAgregar = e.target.closest('.ek-add-cart-btn');
    if (botonAgregar) {
      var producto = obtenerInfoProducto(botonAgregar);
      agregarAlCarrito(producto);
    }

    var botonSumar = e.target.closest('.btn-sumar');
    if (botonSumar) {
      cambiarCantidad(botonSumar.dataset.nombre, 1);
    }

    var botonRestar = e.target.closest('.btn-restar');
    if (botonRestar) {
      cambiarCantidad(botonRestar.dataset.nombre, -1);
    }

    var botonEliminar = e.target.closest('.btn-eliminar');
    if (botonEliminar) {
      eliminarDelCarrito(botonEliminar.dataset.nombre);
    }
  });

  // Render inicial (carrito vacío)
  renderizarCarrito();  

});

