let currentPage = 1;
const rowsPerPage = 10;
let currentEntidad = null;
let complaintToDelete = null;

const tbody = document.querySelector('table tbody');
const pagination = document.getElementById('pagination');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deletePasswordInput = document.getElementById('deletePassword');

async function fetchQuejas(entidadId, page = 1, limit = rowsPerPage) {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute('6LeBKKkrAAAAAObCxLb511gIotGRecWMZZOEZhRg', {
          action: 'submit',
        })
        .then(async (token) => {
          try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
              showSessionExpiredModal();
              return reject(new Error('Sesión inactiva'));
            }

            const res = await fetch(
              `/api/complaints?entidadId=${entidadId}&page=${page}&limit=${limit}`,
              {
                headers: {
                  'X-Recaptcha-Token': token,
                  'X-UserEmail': userEmail,
                },
              }
            );

            if (res.status === 401) {
              showSessionExpiredModal();
              return reject(new Error('Sesión inactiva'));
            }

            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

            const data = await res.json();
            resolve(data);
          } catch (err) {
            reject(err);
          }
        });
    });
  });
}

async function renderTable(entidadId, page = 1) {
  const result = await fetchQuejas(entidadId, page, rowsPerPage);
  tbody.innerHTML = '';

  if (result.data && result.data.length) {
    result.data.forEach((q) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${q.id}</td>
        <td>${q.Entity?.nombre || 'Sin entidad'}</td>
        <td>${q.description}</td>
        <td class="estado-queja">
          <span class="badge ${
            q.state === 'pendiente'
              ? 'bg-warning text-dark'
              : q.state === 'en proceso'
                ? 'bg-info text-dark'
                : 'bg-success'
          }">${q.state}</span>
        </td>
        <td>
          <div class="dropdown">
            <button class="btn btn-secondary btn-sm no-caret" type="button"
              id="dropdownMenu${q.id}" data-bs-toggle="dropdown" aria-expanded="false">
              ...
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu${q.id}">
              <li><a class="dropdown-item btn-view" href="/complaint/${q.id}">Ver comentario</a></li>
              <li><button class="dropdown-item btn-change-state" data-id="${q.id}" data-estado="${q.state}">Cambiar estado</button></li>
              <li><button class="dropdown-item btn-delete" data-id="${q.id}">Eliminar</button></li>
            </ul>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Eventos dinámicos
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        complaintToDelete = btn.getAttribute('data-id');
        deleteModal.show();
      });
    });

    document.querySelectorAll('.btn-change-state').forEach((btn) => {
      btn.addEventListener('click', () => openChangeStateModal(btn));
    });
  } else {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="text-center" colspan="5">No hay quejas registradas</td>`;
    tbody.appendChild(tr);
  }

  renderPagination(result.pagination.totalPages, result.pagination.currentPage);
}

function renderPagination(totalPages, page) {
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  const prev = document.createElement('li');
  prev.className = 'page-item ' + (page === 1 ? 'disabled' : '');
  prev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  prev.addEventListener('click', (e) => {
    e.preventDefault();
    if (page > 1) {
      currentPage--;
      renderTable(currentEntidad, currentPage);
    }
  });
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = 'page-item ' + (i === page ? 'active' : '');
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderTable(currentEntidad, currentPage);
    });
    pagination.appendChild(li);
  }

  const next = document.createElement('li');
  next.className = 'page-item ' + (page === totalPages ? 'disabled' : '');
  next.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
  next.addEventListener('click', (e) => {
    e.preventDefault();
    if (page < totalPages) {
      currentPage++;
      renderTable(currentEntidad, currentPage);
    }
  });
  pagination.appendChild(next);
}

const modalEstado = new bootstrap.Modal(
  document.getElementById('modalCambiarEstado')
);
const selectEstado = document.getElementById('nuevoEstado');
const btnGuardarEstado = document.getElementById('btnGuardarEstado');
let complaintToChange = null;

function openChangeStateModal(button) {
  complaintToChange = button.getAttribute('data-id');
  const estadoActual = button.getAttribute('data-estado');
  selectEstado.value = estadoActual;
  modalEstado.show();
}

btnGuardarEstado.addEventListener('click', async () => {
  if (!complaintToChange) return;

  const nuevoEstado = selectEstado.value;
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return showSessionExpiredModal();

  try {
    const res = await fetch(
      `/api/complaints/change-state/${complaintToChange}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-useremail': userEmail,
        },
        body: JSON.stringify({ newState: nuevoEstado }),
      }
    );

    if (!res.ok) throw new Error('Error al actualizar estado');
    modalEstado.hide();

    const fila = document
      .querySelector(`button[data-id="${complaintToChange}"]`)
      .closest('tr');
    const celdaEstado = fila.querySelector('.estado-queja span');
    celdaEstado.textContent = nuevoEstado;
    celdaEstado.className = `badge ${
      nuevoEstado === 'pendiente'
        ? 'bg-warning text-dark'
        : nuevoEstado === 'en proceso'
          ? 'bg-info text-dark'
          : 'bg-success'
    }`;

    showAlert('Estado actualizado correctamente ✅', 'success');
  } catch (err) {
    console.error(err);
    showAlert('Error al actualizar el estado ❌', 'danger');
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  try {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return showSessionExpiredModal();

    const res = await fetch(`/api/complaints/${complaintToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-useremail': userEmail,
      },
    });

    if (res.ok) {
      deleteModal.hide();
      renderTable(currentEntidad, currentPage);
      showAlert('Queja eliminada con éxito', 'success');
    } else {
      const err = await res.json();
      showAlert(err.error || 'Error al borrar la queja', 'danger');
    }
  } catch (err) {
    console.error('Error en deleteComplaint:', err);
    showAlert('Error de conexión al borrar la queja', 'danger');
  }
});

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow`;
  alertDiv.style.zIndex = 2000;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

function showSessionExpiredModal() {
  const modal = new bootstrap.Modal(
    document.getElementById('sessionExpiredModal')
  );
  modal.show();
}

function logoutAndRedirect() {
  localStorage.removeItem('userEmail');
  window.location.href = '/login';
}

document.getElementById('entidad').addEventListener('change', function () {
  const entidadId = this.value;
  if (!entidadId) return;
  currentEntidad = entidadId;
  currentPage = 1;
  renderTable(entidadId, currentPage);
});

(() => {
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach((menu) => {
      menu.classList.remove('show');
      const btn = menu
        .closest('.dropdown')
        ?.querySelector('[data-bs-toggle="dropdown"]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-bs-toggle="dropdown"]');
    if (toggle) {
      e.preventDefault();
      const dropdown = toggle.closest('.dropdown');
      if (!dropdown) return;
      const menu = dropdown.querySelector('.dropdown-menu');
      if (!menu) return;

      const isShown = menu.classList.contains('show');
      closeAllDropdowns();
      if (!isShown) {
        menu.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
      }
      return;
    }
    if (!e.target.closest('.dropdown')) closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
})();
