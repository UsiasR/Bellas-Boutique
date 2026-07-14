document.addEventListener("DOMContentLoaded", function () {
    var botones = document.querySelectorAll('.btn-filter');

    botones.forEach(function (boton) {
        boton.addEventListener('click', function () {
            var categoria = boton.dataset.categoria; // Todo, top, falda, vestido

            if (categoria.toLowerCase() === 'todo') {
                mostrarTodosLosElementos();
            } else {
                ocultarElementos();
                var elementos = document.querySelectorAll('.ropa');
                elementos.forEach(function (elemento) {
                    var valor = elemento.getAttribute('data-type');
                    if (valor && valor.toLowerCase() === categoria.toLowerCase()) {
                        elemento.style.display = 'block';
                    }
                });
            }
        });
    });

    function ocultarElementos() {
        var elementos = document.querySelectorAll('.ropa');
        elementos.forEach(function (elemento) {
            elemento.style.display = 'none';
        });
    }

    function mostrarTodosLosElementos() {
        var elementos = document.querySelectorAll('.ropa');
        elementos.forEach(function (elemento) {
            elemento.style.display = 'block';
        });
    }
});