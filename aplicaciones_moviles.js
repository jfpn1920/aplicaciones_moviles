// ===== Configuración inicial =====
const CLAVE = "aplicacionesMoviles"; // clave con la que se guarda en localStorage
let datos = {}; // forma: { chat: { instalada: false, calificacion: 0 }, ... }
// ===== Referencias a elementos del HTML =====
const tarjetas = document.querySelectorAll(".tarjeta");
const contenedor = document.querySelector(".tarjetas");
const textoResumen = document.getElementById("textoResumen");
const btnReiniciar = document.getElementById("btnReiniciar");
// ===== Funciones de localStorage =====
// Lee los datos guardados (si existen) al abrir o refrescar la página
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) datos = JSON.parse(guardado); // convierte el texto en objeto
    } catch (error) {
      datos = {}; // si algo falla, empieza de cero
    }
}
// Guarda el objeto "datos" como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
// ===== Funciones de apoyo =====
// Devuelve los datos de una app; si no existen, los crea vacíos
function obtenerApp(id) {
    if (!datos[id]) datos[id] = { instalada: false, calificacion: 0 };
    return datos[id];
}
// ===== Funciones que actualizan la pantalla =====
// Dibuja una tarjeta con sus datos guardados
function pintarTarjeta(tarjeta) {
    const app = obtenerApp(tarjeta.dataset.id);
    tarjeta.classList.toggle("instalada", app.instalada); // marca la tarjeta
    tarjeta.querySelector(".btn-instalar").textContent = app.instalada ? "Desinstalar" : "Instalar";
    // Dibuja las cinco estrellas; las activas son las que no superan la calificación
    const estrellas = tarjeta.querySelector(".estrellas");
    estrellas.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const estrella = document.createElement("span");
        estrella.className = "estrella" + (i <= app.calificacion ? " activa" : "");
        estrella.dataset.valor = i; // guarda qué número de estrella es
        estrella.textContent = "★";
        estrellas.appendChild(estrella);
    }
}
// Calcula las apps instaladas y el promedio de calificaciones
function pintarResumen() {
    let instaladas = 0, suma = 0, calificadas = 0;
    tarjetas.forEach(function (tarjeta) {
        const app = obtenerApp(tarjeta.dataset.id);
        if (app.instalada) instaladas++;
        if (app.calificacion > 0) { suma += app.calificacion; calificadas++; }
    });
    const promedio = calificadas ? (suma / calificadas).toFixed(1) : "sin calificar";
    textoResumen.textContent = instaladas + " de " + tarjetas.length + " apps instaladas. Promedio: " + promedio;
}
// Redibuja toda la página
function pintarTodo() {
    tarjetas.forEach(pintarTarjeta);
    pintarResumen();
}
// ===== Eventos =====
// Un solo evento en el contenedor detecta clics en botones y estrellas
contenedor.addEventListener("click", function (e) {
    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;
    const app = obtenerApp(tarjeta.dataset.id);
    if (e.target.classList.contains("btn-instalar")) {
      app.instalada = !app.instalada; // instala o desinstala
    } else if (e.target.classList.contains("estrella")) {
        const valor = Number(e.target.dataset.valor);
      app.calificacion = app.calificacion === valor ? 0 : valor; // clic repetido quita la nota
    } else {
      return; // clic en otra parte de la tarjeta: no hace nada
    }
    guardarDatos();
    pintarTodo();
});
// Botón de reinicio: pide confirmación y borra todo
btnReiniciar.addEventListener("click", function () {
    if (confirm("¿Seguro que quieres borrar todos los datos?")) {
        localStorage.removeItem(CLAVE);
        datos = {};
        pintarTodo();
    }
});
// ===== Inicio de la app =====
cargarDatos(); // primero se leen los datos guardados
pintarTodo();  // luego se dibuja la pantalla con esos datos