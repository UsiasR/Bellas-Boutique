document.addEventListener("DOMContentLoaded", function () {

  var listaDeseados = []; // nombre, precio, imagen

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

  function obtenerInfoProducto(link) {
    var wrapper = link.closest('.ek-product-img-wrapper');
    var img = wrapper.querySelector('img');
    var tarjeta = link.closest('.ek-product-card') || link.closest('.ropa');

    var nombre, precioTexto;

    if (tarjeta.classList.contains('ek-product-card')) {
      nombre = tarjeta.querySelector('.ek-name').textContent.trim();
      precioTexto = tarjeta.querySelector('.ek-price').textContent.trim();
    } else {
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

  function actualizarIconoBoton(boton, activo) {
    var icono = boton.querySelector('i');
    boton.classList.toggle('active', activo);
    icono.classList.toggle('bx-heart', !activo);
    icono.classList.toggle('bxs-heart', activo);
  }

  function alternarDeseado(boton) {
    var producto = obtenerInfoProducto(boton);
    var yaExiste = listaDeseados.some(function (item) { return item.name === producto.name; });

    if (yaExiste) {
      listaDeseados = listaDeseados.filter(function (item) { return item.name !== producto.name; });
    } else {
      listaDeseados.push(producto);
    }

    // Sincroniza el ícono en todas las tarjetas de ese mismo producto (por si se repite en el carrusel)
    document.querySelectorAll('.ek-wishlist-btn').forEach(function (btn) {
      var info = obtenerInfoProducto(btn);
      if (info.name === producto.name) {
        actualizarIconoBoton(btn, !yaExiste);
      }
    });

    renderizarDeseados();
  }

  function eliminarDeseado(nombre) {
    listaDeseados = listaDeseados.filter(function (item) { return item.name !== nombre; });
    document.querySelectorAll('.ek-wishlist-btn').forEach(function (btn) {
      var info = obtenerInfoProducto(btn);
      if (info.name === nombre) actualizarIconoBoton(btn, false);
    });
    renderizarDeseados();
  }

  function renderizarDeseados() {
    var contenedor = document.getElementById('wishlist-items-container');
    var mensajeVacio = document.getElementById('wishlist-empty-message');
    var badge = document.getElementById('wishlist-count');

    badge.textContent = listaDeseados.length;
    contenedor.innerHTML = '';

    if (listaDeseados.length === 0) {
      mensajeVacio.style.display = 'block';
    } else {
      mensajeVacio.style.display = 'none';
      listaDeseados.forEach(function (item) {
        var fila = document.createElement('div');
        fila.className = 'd-flex mb-3 pb-3 border-bottom';
        fila.innerHTML =
          '<img src="' + item.image + '" alt="' + item.name + '" style="width: 70px; height: 90px; object-fit: cover;" class="me-3">' +
          '<div class="flex-grow-1">' +
            '<p class="mb-1 small fw-semibold">' + item.name + '</p>' +
            '<p class="mb-0 small text-secondary">' + formatearPrecio(item.price) + '</p>' +
          '</div>' +
          '<button class="btn btn-sm text-secondary btn-eliminar-deseado" data-nombre="' + item.name + '"><i class="bx bx-trash"></i></button>';
        contenedor.appendChild(fila);
      });
    }
  }

  document.addEventListener('click', function (e) {
    var botonDeseado = e.target.closest('.ek-wishlist-btn');
    if (botonDeseado) {
      e.preventDefault(); // evita que el <a href="#"> haga scroll al inicio
      alternarDeseado(botonDeseado);
    }

    var botonEliminarDeseado = e.target.closest('.btn-eliminar-deseado');
    if (botonEliminarDeseado) {
      eliminarDeseado(botonEliminarDeseado.dataset.nombre);
    }
  });

  renderizarDeseados();

});