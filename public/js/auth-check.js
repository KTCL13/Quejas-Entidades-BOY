// auth-check.js

(async function checkAuth() {
  let email = localStorage.getItem('userEmail');

  if (!email) {
    redirectToUnauthorized();
    return;
  }

  try {
    const response = await fetch('/api/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      localStorage.removeItem('userEmail');
      redirectToUnauthorized();
      return;
    }
  } catch (err) {
    console.error('Error verificando sesión:', err);
  }
})();

function redirectToUnauthorized() {
  window.location.href = '/unauthorized';
}
