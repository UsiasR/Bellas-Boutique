  // linea de separación de tabs
  function switchModalTab(tab) {
    const isLogin = tab === 'login';
    const line    = document.getElementById('tab-line');

    document.getElementById('panel-login').classList.toggle('show',    isLogin);
    document.getElementById('panel-login').classList.toggle('active',  isLogin);
    document.getElementById('panel-registro').classList.toggle('show',   !isLogin);
    document.getElementById('panel-registro').classList.toggle('active', !isLogin);

    document.getElementById('tab-login').classList.toggle('text-dark',  isLogin);
    document.getElementById('tab-login').classList.toggle('text-muted', !isLogin);
    document.getElementById('tab-registro').classList.toggle('text-dark',  !isLogin);
    document.getElementById('tab-registro').classList.toggle('text-muted',  isLogin);

    if (isLogin) {
      line.style.left  = '1rem';
      line.style.width = 'calc(50% - 1rem)';
    } else {
      line.style.left  = '50%';
      line.style.width = 'calc(50% - 1rem)';
    }
  }

  // ojo para la contraseña
  function togglePwd(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // regex para validar que solo se ingresen letras y espacios (nombres, apellidos)
  document.addEventListener('input', function (e) {
    if (e.target.classList.contains('solo-letras')) {
      e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    }
  });

  // regex para validar que solo se ingresen números (teléfono)
  document.addEventListener('input', function (e) {
    if (e.target.classList.contains('solo-numeros')) {
      e.target.value = e.target.value.replace(/\D/g, '');
    }
  });

  // validar el formularios al precionar enviar 
  document.addEventListener('submit', function (e) {
    const form = e.target.closest('.needs-validation');
    if (!form) return;
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
    }
    form.classList.add('was-validated');
  });