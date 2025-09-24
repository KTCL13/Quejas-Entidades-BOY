let currentPage = 1;
const rowsPerPage = 10;
let currentEntidad = null;
let complaintToDelete = null;

const tbody = document.querySelector("table tbody");
const pagination = document.getElementById("pagination");
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deletePasswordInput = document.getElementById("deletePassword");

async function fetchQuejas(entidadId, page = 1, limit = rowsPerPage) {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LeBKKkrAAAAAObCxLb511gIotGRecWMZZOEZhRg", { action: "submit" })
        .then(async function (token) {
          try {
            const res = await fetch(
              `/api/complaints?entidadId=${entidadId}&page=${page}&limit=${limit}`,
              {
                headers: {
                  "X-Recaptcha-Token": token,
                },
              }
            );
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
  tbody.innerHTML = "";

  if (result.data && result.data.length) {
    result.data.forEach((q) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${q.description}</td>
        <td>${q.state}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${q.id}">
            Borrar
          </button>
          <a href="/complaint/${q.id}" class="btn btn-primary btn-sm">
            Ver comentario
          </a>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Asignar eventos a los botones recién creados
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        complaintToDelete = btn.getAttribute("data-id");
        deletePasswordInput.value = ""; // limpiar input
        deleteModal.show();
      });
    });

  } else {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="text-center" colspan="2">No hay quejas registradas</td>`;
    tbody.appendChild(tr);
  }

  renderPagination(result.pagination.totalPages, result.pagination.currentPage);
}

function renderPagination(totalPages, page) {
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Botón anterior
  const prev = document.createElement("li");
  prev.className = "page-item " + (page === 1 ? "disabled" : "");
  prev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (page > 1) {
      currentPage--;
      renderTable(currentEntidad, currentPage);
    }
  });
  pagination.appendChild(prev);

  // Números de página
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item " + (i === page ? "active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderTable(currentEntidad, currentPage);
    });
    pagination.appendChild(li);
  }

  // Botón siguiente
  const next = document.createElement("li");
  next.className = "page-item " + (page === totalPages ? "disabled" : "");
  next.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (page < totalPages) {
      currentPage++;
      renderTable(currentEntidad, currentPage);
    }
  });
  pagination.appendChild(next);
}

// Evento al seleccionar entidad
document.getElementById("entidad").addEventListener("change", function () {
  const entidadId = this.value;
  if (!entidadId) return;
  currentEntidad = entidadId;
  currentPage = 1;
  renderTable(entidadId, currentPage);
});


confirmDeleteBtn.addEventListener("click", async () => {
  const password = deletePasswordInput.value;
  if (!password) {
    alert("Por favor ingrese la contraseña.");
    return;
  }

  try {
    const res = await fetch(`/api/complaints/${complaintToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-pass": password,
      },
    });

    if (res.ok) {
      deleteModal.hide();
      renderTable(currentEntidad, currentPage);
      showAlert("Queja eliminada con éxito ", "success");
    } else {
      const err = await res.json();
      showAlert(err.error || "Error al borrar la queja ", "danger");
    }
  } catch (err) {
    console.error("Error en deleteComplaint:", err);
    showAlert("Error de conexión al borrar la queja ", "danger");
  }
});

// Función para mostrar alertas dinámicas
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.querySelector(".container");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    alertDiv.classList.add("fade");
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}
