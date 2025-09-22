document.addEventListener("DOMContentLoaded", async () => {
  const complaintIdEl = document.getElementById("complaintId");
  if (!complaintIdEl) return; 

  const complaintId = complaintIdEl.value;
  const container = document.getElementById("commentsContainer");
  const input = document.getElementById("newComment");
  const addBtn = document.getElementById("addComment");

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments-complaint-id/${complaintId}`);
      const comments = await res.json();

      container.innerHTML = "";

      comments.forEach(comment => {
        const item = document.createElement("div");
        item.className = "list-group-item d-flex justify-content-between";
        item.innerHTML = `
          <span>${comment.message}</span>
          <small class="text-muted">Fecha: ${comment.date}</small>
        `;
        container.appendChild(item);
      });
    } catch (err) {
        console.error("Error cargando comentarios:", err);
      container.innerHTML = `<div class="text-danger">Error cargando comentarios</div>`;
    }
  }

  loadComments();

  addBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;

    try {
      await fetch(`/api/comments-complaint-id/${complaintId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      input.value = "";
      loadComments(); 
    } catch (err) {
    console.error("Error al agregar comentarios:", err);
      alert("Error al agregar comentario");
    }
  });
});
