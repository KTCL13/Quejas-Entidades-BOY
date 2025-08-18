document.addEventListener('DOMContentLoaded', () => {
  cargarReporteQuejas();
});

async function cargarReporteQuejas() {
  const tbody = document.querySelector('#tablaReporte tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';

  try {
    const resp = await fetch('/api/reportes/quejas-por-entidad');
    if (!resp.ok) throw new Error('Error HTTP ' + resp.status);
    const data = await resp.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">No hay quejas registradas</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    data.forEach(row => {
      const nombre = escapeHtml(row.nombre_entidad || 'Sin nombre');
      const total = Number(row.total_quejas || 0);
      // manejar posible retorno: entidad_ids (array) o entidad_id (single)
      let ids = '';
      if (Array.isArray(row.entidad_ids) && row.entidad_ids.length) {
        ids = row.entidad_ids.join(', ');
      } else if (row.entidad_id) {
        ids = String(row.entidad_id);
      } else {
        ids = '';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${nombre}</td><td class="numeric">${total.toLocaleString()}</td><td>${escapeHtml(ids)}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar reporte:', err);
    tbody.innerHTML = '<tr><td colspan="3">Error al cargar los datos</td></tr>';
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;',
      '/':'&#x2F;',
      '`':'&#x60;',
      '=':'&#x3D;'
    }[s]);
  });
}
