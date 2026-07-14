document.addEventListener("DOMContentLoaded", function () {

  /* Elementos */

  var thumbs = document.querySelectorAll(".ek-thumb");
  var mainImage = document.getElementById("main-image");
  var modalImage = document.getElementById("modal-image");
  var modalImagen = document.getElementById("modalImagen");

  var modalPrev = document.getElementById("modal-prev");
  var modalNext = document.getElementById("modal-next");

  var qtyInput = document.getElementById("qty-input");
  var qtyPlus = document.getElementById("qty-plus");
  var qtyMinus = document.getElementById("qty-minus");

  var btnAgregar = document.getElementById("btn-agregar-detalle");
  var errorMsg = document.getElementById("ek-selection-error");

  var colorSeleccionado = null;
  var tallaSeleccionada = null;
  var indiceActual = 0;

  /* Cambio de imagen */

  function cambiarImagen(thumb) {

    if (!mainImage) return;

    mainImage.src = thumb.src;

    thumbs.forEach(function (t) {
      t.classList.remove("active");
    });

    thumb.classList.add("active");
  }

   /* mostrar la imagen grande */

  function mostrarImagen(indice) {

    if (!thumbs.length) return;

    var imagenes = Array.from(thumbs).map(function (t) {
      return t.src;
    });

    if (indice < 0) indice = imagenes.length - 1;
    if (indice >= imagenes.length) indice = 0;

    indiceActual = indice;

    if (mainImage) {
      mainImage.src = imagenes[indice];
    }

    if (modalImage) {
      modalImage.src = imagenes[indice];
    }

    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle("active", i === indice);
    });
  }

  /* miniaturas */

  thumbs.forEach(function (thumb, index) {

    thumb.addEventListener("click", function () {
      indiceActual = index;
      cambiarImagen(thumb);
    });

  });

   /* ventana emergente */

  if (modalPrev) {

    modalPrev.addEventListener("click", function () {

      indiceActual--;

      if (indiceActual < 0) {
        indiceActual = thumbs.length - 1;
      }

      mostrarImagen(indiceActual);

    });

  }

  if (modalNext) {

    modalNext.addEventListener("click", function () {

      indiceActual++;

      if (indiceActual >= thumbs.length) {
        indiceActual = 0;
      }

      mostrarImagen(indiceActual);

    });

  }

  if (modalImagen) {

    modalImagen.addEventListener("show.bs.modal", function () {

      if (modalImage && mainImage) {
        modalImage.src = mainImage.src;
      }

    });

  }

   /* colores de los botones */

  document.querySelectorAll(".ek-color-group .ek-swatch").forEach(function (btn) {

    btn.addEventListener("click", function () {

      document.querySelectorAll(".ek-color-group .ek-swatch").forEach(function (b) {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
      colorSeleccionado = btn.dataset.value;

    });

  });

   /* botones de las tallas */

  document.querySelectorAll(".ek-size-group .ek-swatch:not(.unavailable)").forEach(function (btn) {

    btn.addEventListener("click", function () {

      document.querySelectorAll(".ek-size-group .ek-swatch").forEach(function (b) {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
      tallaSeleccionada = btn.dataset.value;

    });

  });

 /* cantidad */

  if (qtyPlus) {

    qtyPlus.addEventListener("click", function () {
      qtyInput.value = parseInt(qtyInput.value, 10) + 1;
    });

  }

  if (qtyMinus) {

    qtyMinus.addEventListener("click", function () {

      var cantidad = parseInt(qtyInput.value, 10);

      if (cantidad > 1) {
        qtyInput.value = cantidad - 1;
      }

    });

  }

   /* agrega al carrito */

  if (btnAgregar) {

    btnAgregar.addEventListener("click", function () {

      if (!colorSeleccionado || !tallaSeleccionada) {

        errorMsg.style.display = "block";
        return;

      }

      errorMsg.style.display = "none";

      var producto = {
        name: "TOP BEIGE (" + colorSeleccionado + ", " + tallaSeleccionada + ")",
        price: 16500,
        image: mainImage.src,
        qty: parseInt(qtyInput.value, 10)
      };

      if (typeof window.agregarAlCarrito === "function") {

        for (var i = 0; i < producto.qty; i++) {
          window.agregarAlCarrito(producto);
        }

      } else {

        alert("Agregado al carrito: " + producto.name);

      }

    });

  }

});