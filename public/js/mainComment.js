document.addEventListener('DOMContentLoaded', async () => {
  const complaintIdEl = document.getElementById('complaintId');
  if (!complaintIdEl) return;

  const complaintId = complaintIdEl.value;
  const container = document.getElementById('commentsContainer');

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments/complaint/${complaintId}`);
      const comments = await res.json();

      container.innerHTML = '';

      comments.forEach((comment) => {
        const beautyDate = new Date(comment.created_at).toLocaleString('es-CO');
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between';
        item.innerHTML = `
          <span>${comment.message}</span>
          <small class="text-muted">Fecha: ${beautyDate}</small>
        `;
        container.appendChild(item);
      });
    } catch (err) {
      console.error('Error cargando comentarios:', err);
      container.innerHTML = `<div class="text-danger">Error cargando comentarios</div>`;
    }
  }

  loadComments();
});

function logoutAndRedirect() {
  localStorage.removeItem('userEmail');
  window.location.href = '/login';
}
