const PAGE_SIZE = 10;
let currentPage = 1;
let allData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

async function loadData(page = 1) {
  try {
    const tbody = document.getElementById('tableBody');

    // Mostrar loading
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span class="ms-2">Cargando...</span>
        </td>
      </tr>
    `;

    const response = await fetch(
      `/api/reports/complaint-state-history?page=${page}&pageSize=${PAGE_SIZE}`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">
            No hay datos disponibles
          </td>
        </tr>
      `;
      return;
    }

    allData = result.data;
    filteredData = result.data;
    currentPage = result.pagination.currentPage;

    renderTable(filteredData);
    renderPagination(result.pagination);
  } catch (error) {
    console.error('Error cargando datos:', error);
    document.getElementById('tableBody').innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="bi bi-exclamation-circle"></i> Error al cargar los datos
        </td>
      </tr>
    `;
  }
}

/**
 * Renderiza la tabla con los datos
 */
function renderTable(data) {
  const tbody = document.getElementById('tableBody');

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted">
          Sin resultados
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map((item) => createTableRow(item)).join('');
}

/**
 * Crea una fila de tabla HTML
 */
function createTableRow(item) {
  const changeDate = new Date(item.change_at).toLocaleString('es-CO');
  const newStateBadgeClass = getStateBadgeClass(item.new_state);
  const previousStateBadgeClass = getStateBadgeClass(item.previous_state);

  return `
    <tr>
      <td>
        <strong class="text-primary">${item.complaint_id}</strong>
      </td>
      <td>
        <span class="badge bg-secondary">${escapeHtml(item.entity_name)}</span>
      </td>
      <td>
        <span class="badge ${newStateBadgeClass}">${escapeHtml(item.new_state)}</span>
      </td>
      <td>
        <span class="badge bg-info">${escapeHtml(item.previous_state)}</span>
      </td>
      <td>
        <small>${escapeHtml(item.user_email)}</small>
      </td>
      <td>
        <small>${changeDate}</small>
      </td>
      <td>
        <a href="/complaint/${item.complaint_id}?userEmail=${encodeURIComponent(item.user_email)}" 
           class="btn btn-sm btn-primary" 
           title="Ver queja">
          <i class="bi bi-eye"></i>
        </a>
      </td>
    </tr>
  `;
}

/**
 * Obtiene la clase CSS del badge según el estado
 */
function getStateBadgeClass(state) {
  const classes = {
    'En progreso': 'bg-warning text-dark',
    Revisión: 'bg-info',
    'En revisión': 'bg-info',
    Cerrada: 'bg-success',
    Cerrado: 'bg-success',
    Registrada: 'bg-secondary',
  };
  return classes[state] || 'bg-secondary';
}

/**
 * Renderiza la paginación
 */
function renderPagination(pagination) {
  const { totalPages, currentPage } = pagination;
  const paginationContainer = document.getElementById('paginationContainer');
  const paginationList = document.getElementById('paginationList');

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'block';
  paginationList.innerHTML = '';

  // Botón Primera
  paginationList.appendChild(
    createPaginationButton('Primera', 1, currentPage === 1)
  );

  // Botón Anterior
  paginationList.appendChild(
    createPaginationButton('Anterior', currentPage - 1, currentPage === 1)
  );

  // Números de página
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = '<span class="page-link">...</span>';
    paginationList.appendChild(li);
  }

  for (let i = start; i <= end; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>`;
    paginationList.appendChild(li);
  }

  if (end < totalPages) {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = '<span class="page-link">...</span>';
    paginationList.appendChild(li);
  }

  // Botón Siguiente
  paginationList.appendChild(
    createPaginationButton(
      'Siguiente',
      currentPage + 1,
      currentPage === totalPages
    )
  );

  // Botón Última
  paginationList.appendChild(
    createPaginationButton('Última', totalPages, currentPage === totalPages)
  );
}

/**
 * Crea un botón de paginación
 */
function createPaginationButton(text, page, isDisabled) {
  const li = document.createElement('li');
  li.className = `page-item ${isDisabled ? 'disabled' : ''}`;
  li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${page})">${text}</a>`;
  return li;
}

/**
 * Va a una página específica
 */
function goToPage(page) {
  loadData(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Escapa caracteres especiales HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
