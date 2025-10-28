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
    grecaptcha.ready(function () {
      grecaptcha
        .execute('6LeBKKkrAAAAAObCxLb511gIotGRecWMZZOEZhRg', {
          action: 'submit',
        })
        .then(async function (token) {
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

            if (!res.ok) {
              throw new Error(`Error HTTP ${res.status}`);
            }

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
        <td>${q.description}</td>
        <td>${q.state}</td>
        <td>
          <div class="dropdown">
            <button 
              class="btn btn-secondary btn-sm no-caret"
              type="button"
              id="dropdownMenu${q.id}"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ...
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu${q.id}">
              <li>
                <a class="dropdown-item btn-view" href="/complaint/${q.id}">
                  Ver comentario
                </a>
              </li>
              <li>
                <button class="dropdown-item btn-delete" data-id="${q.id}">
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        complaintToDelete = btn.getAttribute('data-id');
        deleteModal.show();
      });
    });
  } else {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="text-center" colspan="3">No hay quejas registradas</td>`;
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

document.getElementById('entidad').addEventListener('change', function () {
  const entidadId = this.value;
  if (!entidadId) return;
  currentEntidad = entidadId;
  currentPage = 1;
  renderTable(entidadId, currentPage);
});

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

confirmDeleteBtn.addEventListener('click', async () => {
  try {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      showSessionExpiredModal();
      return new Error('Sesión inactiva');
    }

    const res = await fetch(`/api/complaints/${complaintToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-UserEmail': userEmail,
      },
    });

    if (res.status === 401) {
      showSessionExpiredModal();
      return new Error('Sesión inactiva');
    }

    if (res.ok) {
      deleteModal.hide();
      renderTable(currentEntidad, currentPage);
      showAlert('Queja eliminada con éxito ', 'success');
    } else {
      const err = await res.json();
      showAlert(err.error || 'Error al borrar la queja ', 'danger');
    }
  } catch (err) {
    console.error('Error en deleteComplaint:', err);
    showAlert('Error de conexión al borrar la queja ', 'danger');
  }
});

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.querySelector('.container');
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    alertDiv.classList.remove('show');
    alertDiv.classList.add('fade');
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

(() => {
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach((menu) => {
      menu.classList.remove('show');
      const btn = menu
        .closest('.dropdown')
        ?.querySelector("[data-bs-toggle='dropdown']");
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest("[data-bs-toggle='dropdown']");

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

    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const modalCambiarEstado = document.getElementById('modalCambiarEstado');
  const selectNuevoEstado = document.getElementById('nuevoEstado');
  const btnGuardarEstado = document.getElementById('btnGuardarEstado');
  let complaintIdActual = null;

  modalCambiarEstado.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    complaintIdActual = button.getAttribute('data-id');
    const estadoActual = button.getAttribute('data-estado');
    selectNuevoEstado.value = estadoActual;
  });

  btnGuardarEstado.addEventListener('click', async () => {
    const nuevoEstado = selectNuevoEstado.value;
    const userEmail = localStorage.getItem('userEmail');

    try {
      const res = await fetch(
        `/api/complaints/change-state/${complaintIdActual}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-useremail': userEmail,
          },
          body: JSON.stringify({ newState: nuevoEstado }),
        }
      );

      if (!res.ok) throw new Error('Error al actualizar el estado.');

      const modal = bootstrap.Modal.getInstance(modalCambiarEstado);
      modal.hide();

      showAlert('Estado actualizado con éxito.', 'success');
      renderTable(currentEntidad, currentPage);
    } catch (err) {
      console.error(err);
      showAlert('No se pudo actualizar el estado.', 'danger');
    }
  });
});
