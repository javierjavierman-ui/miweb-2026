// Lista de colores disponibles
let colores = ['#ffebee', '#e8f5e9', '#e3f2fd', '#fff3e0', '#f3e5f5'];
let nombresColores = ['Rosa claro', 'Verde claro', 'Azul claro', 'Naranja claro', 'Morado claro'];
let indiceActual = 0;
function cambiarColor() {
	// Cambiar al siguiente color en la lista
	indiceActual = indiceActual + 1;
	// Si llegamos al final, volver al principio
	if (indiceActual >= colores.length) {
		indiceActual = 0;
	}
	// Aplicar el color al fondo de la página
	document.body.style.backgroundColor = colores[indiceActual];
	// Actualizar el texto que muestra el color actual
	document.querySelector('#color-actual').textContent =
		'Color actual: ' + nombresColores[indiceActual];
}
// Conectar la función al botón cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#cambiar-color').addEventListener('click', cambiarColor);
});
