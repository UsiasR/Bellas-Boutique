document.addEventListener("DOMContentLoaded", function () {

  // referencias al modal
  var modalEl = document.getElementById('modalVistaRapida');
  var modalVistaRapida = new bootstrap.Modal(modalEl);

  var imgEl = document.getElementById('vr-img');
  var nombreEl = document.getElementById('vr-nombre');
  var precioEl = document.getElementById('vr-precio');
  var badgeAgotadoEl = document.getElementById('vr-badge-agotado');
  var colorGroup = document.getElementById('vr-color-group');
  var colorWrapper = document.getElementById('vr-color-wrapper');
  var tallaGroup = document.getElementById('vr-talla-group');
  var tallaWrapper = document.getElementById('vr-talla-wrapper');
  var errorEl = document.getElementById('vr-error');
  var qtyInput = document.getElementById('vr-qty-input');
  var btnMenos = document.getElementById('vr-qty-minus');
  var btnMas = document.getElementById('vr-qty-plus');
  var btnAgregar = document.getElementById('vr-btn-agregar');

  var productoActual = null;

 
  // Utilidades
  

  function limpiarSeleccion(grupo) {
    grupo.querySelectorAll('.ek-swatch').forEach(function (b) {
      b.classList.remove('selected');
    });
  }

  // colores y tallas
  function construirSwatches(grupo, wrapper, valores, productoAgotado, opcionesAgotadas) {

    grupo.innerHTML = '';

    if (!valores || valores.length === 0) {
      wrapper.style.display = 'none';
      return;
    }

    wrapper.style.display = 'block';

    opcionesAgotadas = opcionesAgotadas || [];

    valores.forEach(function (valor) {

      var btn = document.createElement('button');

      btn.type = 'button';
      btn.dataset.value = valor;
      btn.textContent = valor;
      btn.classList.add('ek-swatch');

      // Producto completamente agotado
      if (productoAgotado) {

        btn.classList.add('unavailable');
        btn.disabled = true;

      }

      // si talla/color esta agotado se desactiva el botón 
      else if (opcionesAgotadas.includes(valor)) {

        btn.classList.add('unavailable');
        btn.disabled = true;

      }

      // Disponible
      else {

        btn.addEventListener('click', function () {

          limpiarSeleccion(grupo);
          btn.classList.add('selected');
          errorEl.style.display = 'none';

        });

      }

      grupo.appendChild(btn);

    });

  }

  // Producto agotado
  function estaAgotado(wrapper) {
    return !!wrapper.querySelector('.ek-badge-agotado');
  }

  // Lee las tallas 
  function leerOpciones(wrapper) {

    var coloresAttr = wrapper.dataset.colors;
    var tallasAttr = wrapper.dataset.tallas;
    var tallasAgotadasAttr = wrapper.dataset.tallasAgotadas;
    var coloresAgotadosAttr = wrapper.dataset.coloresAgotados;

    return {

      colores: coloresAttr
        ? coloresAttr.split(',').map(function (c) { return c.trim(); }).filter(Boolean)
        : [],

      tallas: tallasAttr
        ? tallasAttr.split(',').map(function (t) { return t.trim(); }).filter(Boolean)
        : [],

      tallasAgotadas: tallasAgotadasAttr
        ? tallasAgotadasAttr.split(',').map(function (t) { return t.trim(); }).filter(Boolean)
        : [],

      coloresAgotados: coloresAgotadosAttr
        ? coloresAgotadosAttr.split(',').map(function (c) { return c.trim(); }).filter(Boolean)
        : []

    };

  }

  // se abre el modal


  window.abrirVistaRapida = function (producto, wrapper) {

    productoActual = producto;

    imgEl.src = producto.image;
    imgEl.alt = producto.name;
    nombreEl.textContent = producto.name;

    precioEl.textContent =
      '₡' +
      producto.price.toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    var agotado = estaAgotado(wrapper);
    var opciones = leerOpciones(wrapper);

    construirSwatches(
      colorGroup,
      colorWrapper,
      opciones.colores,
      agotado,
      opciones.coloresAgotados
    );

    construirSwatches(
      tallaGroup,
      tallaWrapper,
      opciones.tallas,
      agotado,
      opciones.tallasAgotadas
    );

    qtyInput.value = 1;
    errorEl.style.display = 'none';

    badgeAgotadoEl.style.display = agotado ? 'inline-block' : 'none';

    modalVistaRapida.show();

  };


  // Cantidad


  btnMenos.addEventListener('click', function () {

    var val = parseInt(qtyInput.value, 10) || 1;

    if (val > 1)
      qtyInput.value = val - 1;

  });

  btnMas.addEventListener('click', function () {

    var val = parseInt(qtyInput.value, 10) || 1;

    qtyInput.value = val + 1;

  });

 
  // Agregar al carrito


  btnAgregar.addEventListener('click', function () {

    if (!productoActual) return;

    var colorSeleccionado = colorGroup.querySelector('.ek-swatch.selected');
    var tallaSeleccionada = tallaGroup.querySelector('.ek-swatch.selected');

    var necesitaColor = colorWrapper.style.display !== 'none';
    var necesitaTalla = tallaWrapper.style.display !== 'none';

    if (
      (necesitaColor && !colorSeleccionado) ||
      (necesitaTalla && !tallaSeleccionada)
    ) {

      errorEl.style.display = 'block';
      return;

    }

    var color = colorSeleccionado
      ? colorSeleccionado.dataset.value
      : null;

    var talla = tallaSeleccionada
      ? tallaSeleccionada.dataset.value
      : null;

    var idVariante =
      productoActual.id +
      (color ? '-' + color : '') +
      (talla ? '-' + talla : '');

    var nombreVariante =
      productoActual.name +
      (color ? ' - ' + color : '') +
      (talla ? ' - ' + talla : '');

    var cantidad = parseInt(qtyInput.value, 10) || 1;

    for (var i = 0; i < cantidad; i++) {

      window.agregarAlCarrito({

        id: idVariante,
        name: nombreVariante,
        price: productoActual.price,
        image: productoActual.image

      });

    }

    modalVistaRapida.hide();

  });

});