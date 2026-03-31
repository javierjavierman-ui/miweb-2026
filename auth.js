
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credentials-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = form.username.value;
            const password = form.password.value;

            if (username === "Alumni" && password === "Alumni26") {
                document.getElementById("login-form").style.display = "none";
                document.getElementById("main-content").style.display = "block";
            } else {
                alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
                form.reset();
            }
        });
    }
});
