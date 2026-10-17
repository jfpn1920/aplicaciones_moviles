//----------------------------------------//
//--|funcionalidad_aplicaciones_moviles|--//        
//----------------------------------------//
const CLAVE = "aplicacionesMoviles";
let datos = {};
const tarjetas = document.querySelectorAll(".tarjeta");
const contenedor = document.querySelector(".tarjetas");
const textoResumen = document.getElementById("textoResumen");
const btnReiniciar = document.getElementById("btnReiniciar");
//----------------------------//
//--|cargar_datos_guardados|--//
//----------------------------//
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) {
            datos = JSON.parse(guardado);
        }
    } catch (error) {
        datos = {};
    }
}
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
function obtenerApp(id) {
    if (!datos[id]) {
        datos[id] = {
            instalada: false,
            calificacion: 0
        };
    }
    return datos[id];
}
//----------------------------------//
//--|mostrar_datos_de_una_tarjeta|--//
//----------------------------------//
function pintarTarjeta(tarjeta) {
    const app = obtenerApp(tarjeta.dataset.id);
    tarjeta.classList.toggle("instalada", app.instalada);
    tarjeta.querySelector(".btn-instalar").textContent =
        app.instalada ? "Desinstalar" : "Instalar";
    const estrellas = tarjeta.querySelector(".estrellas");
    estrellas.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const estrella = document.createElement("span");
        estrella.className = "estrella" +
            (i <= app.calificacion ? " activa" : "");
        estrella.dataset.valor = i;
        estrella.textContent = "★";
        estrellas.appendChild(estrella);
    }
}
//--------------------------------------//
//--|calcular_resumen_de_aplicaciones|--//
//--------------------------------------//
function pintarResumen() {
    let instaladas = 0;
    let suma = 0;
    let calificadas = 0;
    tarjetas.forEach(function(tarjeta) {
        const app = obtenerApp(tarjeta.dataset.id);
        if (app.instalada) {
            instaladas++;
        }
        if (app.calificacion > 0) {
            suma += app.calificacion;
            calificadas++;
        }
    });
    const promedio = calificadas
        ? (suma / calificadas).toFixed(1)
        : "sin calificar";
    textoResumen.textContent =
        instaladas +
        " de " +
        tarjetas.length +
        " apps instaladas. Promedio: " +
        promedio;
}
function pintarTodo() {
    tarjetas.forEach(function(tarjeta) {
        pintarTarjeta(tarjeta);
    });
    pintarResumen();
}
//-------------------------------------------//
//--|eventos_de_instalacion_y_calificacion|--//
//-------------------------------------------//
contenedor.addEventListener("click", function(e) {
    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) {
        return;
    }
    const app = obtenerApp(tarjeta.dataset.id);
    if (e.target.classList.contains("btn-instalar")) {
        app.instalada = !app.instalada;
    } else if (e.target.classList.contains("estrella")) {
        const valor = Number(e.target.dataset.valor);
        app.calificacion = app.calificacion === valor ? 0 : valor;
    } else {
        return;
    }
    guardarDatos();
    pintarTodo();
});
//----------------------------------//
//--|reiniciar_datos_del_proyecto|--//
//----------------------------------//
btnReiniciar.addEventListener("click", function() {
    const confirmar = confirm(
        "¿Seguro que quieres borrar todos los datos?"
    );
    if (confirmar) {
        localStorage.removeItem(CLAVE);
        datos = {};
        pintarTodo();
    }
});
//-------------------------//
//--|iniciar_el_proyecto|--//
//-------------------------//
cargarDatos();
pintarTodo();