document.addEventListener("DOMContentLoaded", function () {

  var carrito = []; // id, nombre, precio, imagen, cantidad
  var COSTO_ENVIO = 3220; // Costo fijo de envío en colones

  // se limpia el precio de símbolos y se convierte a número flotante

  function limpiarPrecio(texto) {
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

  // Extrae nombre, precio, imagen e id del producto a partir del botón agregar al carrito
  function obtenerInfoProducto(boton) {
    var wrapper = boton.closest('.ek-product-img-wrapper');
    var img = wrapper.querySelector('img');
    var tarjeta = boton.closest('.ek-product-card') || boton.closest('.ropa');

    var nombre, precioTexto;

    if (tarjeta.classList.contains('ek-product-card')) {
      nombre = tarjeta.querySelector('.ek-name').textContent.trim();
      precioTexto = tarjeta.querySelector('.ek-price').textContent.trim();
    } else {
      var parrafos = tarjeta.querySelectorAll('p');
      nombre = parrafos[0].textContent.trim();
      precioTexto = parrafos[1].textContent.trim();
    }

    // se usa data-product-id para agregar el producto a la lista de deseados, ya que el nombre puede repetirse
    // si falta ese atributo, se avisa por consola para que sea fácil detectar
    var idExplicito = wrapper.dataset.productId;
    if (!idExplicito) {
      console.warn('Falta data-product-id en la tarjeta de "' + nombre + '". El carrito no funcionará correctamente para este producto.');
    }

    return {
      id: idExplicito,
      name: nombre,
      price: limpiarPrecio(precioTexto),
      image: img.getAttribute('src')
    };
  }

  // logica para el carrito de compras

  function agregarAlCarrito(producto) {
    var existente = carrito.find(function (item) { return item.id === producto.id; });
    if (existente) {
      existente.qty += 1;
    } else {
      carrito.push({ id: producto.id, name: producto.name, price: producto.price, image: producto.image, qty: 1 });
    }
    renderizarCarrito();
  }

  window.agregarAlCarrito = agregarAlCarrito;

  function cambiarCantidad(id, delta) {
    var item = carrito.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      carrito = carrito.filter(function (i) { return i.id !== id; });
    }
    renderizarCarrito();
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (i) { return i.id !== id; });
    renderizarCarrito();
  }

  // mostar en pantalla el carrito, subtotal, envio, descuento y total

  function renderizarCarrito() {
    var contenedor = document.getElementById('cart-items-container');
    var mensajeVacio = document.getElementById('cart-empty-message');
    var badge = document.getElementById('cart-count');
    var elSubtotal = document.getElementById('cart-subtotal');
    var elDescuento = document.getElementById('cart-discount');
    var elEnvio = document.getElementById('cart-shipping');
    var elTotal = document.getElementById('cart-total');

    // Verificar que todos los elementos existen antes de continuar
    var faltantes = [];
    if (!contenedor) faltantes.push('cart-items-container');
    if (!mensajeVacio) faltantes.push('cart-empty-message');
    if (!badge) faltantes.push('cart-count');
    if (!elSubtotal) faltantes.push('cart-subtotal');
    if (!elDescuento) faltantes.push('cart-discount');
    if (!elEnvio) faltantes.push('cart-shipping');
    if (!elTotal) faltantes.push('cart-total');

    if (faltantes.length > 0) {
      console.error('renderizarCarrito: faltan estos elementos en el HTML:', faltantes.join(', '));
      return; // salir sin explotar
    }
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
          '<button class="btn btn-sm btn-outline-secondary rounded-0 py-0 px-2 btn-restar" data-id="' + item.id + '">-</button>' +
          '<span class="small">' + item.qty + '</span>' +
          '<button class="btn btn-sm btn-outline-secondary rounded-0 py-0 px-2 btn-sumar" data-id="' + item.id + '">+</button>' +
          '</div>' +
          '</div>' +
          '<button class="btn btn-sm text-secondary btn-eliminar" data-id="' + item.id + '"><i class="bx bx-trash"></i></button>';
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

  // eventos de click para agregar, sumar, restar y eliminar del carrito

  document.addEventListener('click', function (e) {
    var botonAgregar = e.target.closest('.ek-add-cart-btn');
    if (botonAgregar) {
      var producto = obtenerInfoProducto(botonAgregar);
      var wrapper = botonAgregar.closest('.ek-product-img-wrapper');

      // Si existe la vista rápida se abre y se
      // agrega directo, para forzar la elección de color y talla.
      if (typeof window.abrirVistaRapida === 'function') {
        window.abrirVistaRapida(producto, wrapper);
      } else {
        agregarAlCarrito(producto);
      }
    }

    var botonSumar = e.target.closest('.btn-sumar');
    if (botonSumar) {
      cambiarCantidad(botonSumar.dataset.id, 1);
    }

    var botonRestar = e.target.closest('.btn-restar');
    if (botonRestar) {
      cambiarCantidad(botonRestar.dataset.id, -1);
    }

    var botonEliminar = e.target.closest('.btn-eliminar');
    if (botonEliminar) {
      eliminarDelCarrito(botonEliminar.dataset.id);
    }
  });

  renderizarCarrito();

});

