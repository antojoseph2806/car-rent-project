document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submit handler fired');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      Toastify({
        text: "Please fill out both fields.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#ff6b6b",
        stopOnFocus: true,
      }).showToast();
      return;
    }

    try {
      const response = await fetch('https://carent-soyj.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || `Server responded ${response.status}`);
      }

      const data = await response.json();
      console.log('Response JSON:', data);

      // Store token and basic user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);

      // Successful login toast
      Toastify({
        text: "Login successful!",
        duration: 2000,
        gravity: "top",
        position: "center",
        backgroundColor: "#4caf50",
        stopOnFocus: true,
      }).showToast();

      // Redirect based on role after short delay
      setTimeout(() => {
        if (data.role === 'admin') {
          window.location.href = 'admindashboard.html';
        } else {
          window.location.href = 'userdashboard.html';
        }
      }, 2000);

    } catch (error) {
      console.error('Fetch/login error:', error);
      Toastify({
        text: `Login error: ${error.message}`,
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "#ff6b6b",
        stopOnFocus: true,
      }).showToast();
    }
  });
});
