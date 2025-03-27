/* ---------------------------- ANIMACIÓN de despliegue y colapso de menú con el toggler ---------------------------- */
const toggler = document.querySelector(".toggler-boton");

toggler.addEventListener("click", function () {
    document.querySelector("#barrita").classList.toggle("collapsed");
});






/* ---------------------------- JUEGO ---------------------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");



/* DIBUJA EL ÁREA de la cancha de básket. Puramente estético -------------------------------------------------------------- */

/* Tratando de seguir con la estética del sitio web */
const colorBase = 'rgba(255, 255, 255, 0.3)';

/* El área, compuesta por un semicírculo y un rectángulo */
function dibujarArea() {

    /* Ambas figuras usan el mismo ancho para que se vea como una sola figura */
    const radioSemicirculo = canvas.width / 2.5;
    const alturaRectangulo = radioSemicirculo / 4;

    ctx.beginPath();
    /* Rectángulo */
    ctx.rect((canvas.width - radioSemicirculo * 2) / 2, 0, radioSemicirculo * 2, alturaRectangulo);
    /* Semicírculo */
    ctx.arc(canvas.width / 2, alturaRectangulo, radioSemicirculo, 0, Math.PI, false);
    /* Color */
    ctx.fillStyle = colorBase; 
    ctx.fill();
    ctx.closePath();
}



/* FUNCIONALIDAD del juego -------------------------------------------------------------- */

/* Algunas variables */
let puntos = 0;
let tiros = 0;
let potencia = 0;
let cargandoPotencia = false;
let colorFondo = 0;

/* Efectos de sonido */
const sonidoEncesta = new Audio('../cc_media/s01_encesta.wav');
const sonidoFallo = new Audio('../cc_media/s02_rebote_de_pelota.wav');
sonidoEncesta.volume = 1;
sonidoFallo.volume = 0.2;
/* Sus funciones */
function reproducirSonidoEncesta() {
    sonidoEncesta.play();
}
function reproducirSonidoFallo() {
    setTimeout(() => {
        sonidoFallo.play();
    }, 200);
}

/* El aro */
const aroX = canvas.width / 2;
const aroY = canvas.height / 6;
const aroRadio = 22.5;
function dibujarAro() {
    ctx.beginPath();
    ctx.arc(aroX, aroY, aroRadio, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1.65;
    ctx.stroke();
    ctx.closePath();
}

/* La pelota */
let pelota = {
    x: canvas.width / 2,
    y: canvas.height / 10 * 8.5,
    radio: 14,
    velocidadX: 0,
    velocidadY: 0,
    enMovimiento: false
};
function dibujarPelota() {
    ctx.beginPath();
    ctx.arc(pelota.x, pelota.y, pelota.radio, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}


/* UPDATE!()
    En esta función pasan varias cosas:
    . Se dibujan constantemente los elementos del canvas cada frame, incluyéndolo
    . Está la física y el movimiento, el "peso" (la gravedad) de la pelota
    . Chequeo de la posición del balón para ver si encesta o erra el tiro
    . Reproduce un sonido si el jugador erra el tiro
*/

function actualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Fondo translúcido que cambia de color */
    ctx.fillStyle = `rgba(${colorFondo % 255}, ${(colorFondo + 50) % 255}, ${(colorFondo + 100) % 255}, 0.1)`; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarArea();
    dibujarAro();    
    dibujarPelota(); 

    if (pelota.enMovimiento) {
        pelota.x += pelota.velocidadX;
        pelota.y += pelota.velocidadY;
        pelota.velocidadY += 0.35; // <--- Gravedad

        if (verificarColisionAro()) {
            pelota.enMovimiento = false;
            pelota.x = canvas.width / 2;
            pelota.y = canvas.height / 10 * 8.5;
        } else if (pelota.y + pelota.radio > canvas.height) {
            pelota.enMovimiento = false;
            pelota.y = canvas.height - pelota.radio;
            pelota.x = canvas.width / 2;
            pelota.y = canvas.height / 10 * 8.5;
            reproducirSonidoFallo(); // <--- Sonido de fallo
        }
    }
    colorFondo += 1;
    requestAnimationFrame(actualizar);
}

/* Verifica que la posición de la pelota se encuentre dentro del área del aro con una velocidad en el eje Y baja, para simular que encesta */
function verificarColisionAro() {
    if (pelota.velocidadY > 0 && Math.abs(pelota.velocidadY) < 7.5) { // <--- Este numerito define la velocidad máxima a la que puede ir la pelota para considerarla punto
        let distanciaX = pelota.x - aroX;
        let distanciaY = pelota.y - aroY;
        let distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

        if (distancia <= pelota.radio + aroRadio) {
            console.log("¡Colisión detectada! Se anotan puntos.");
            puntos++;
            document.getElementById("puntos").textContent = "Puntos: " + puntos;
            reproducirSonidoEncesta(); // <--- Sonido de que encesta
            return true;
        }
    }
    return false;
}



/* KEYDOWN de la tecla "espacio" para cargar potencia y lanzar el balón */
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && !pelota.enMovimiento && !cargandoPotencia) {
        event.preventDefault();
        cargandoPotencia = true;
        potencia = 0;
        let cargaInterval = setInterval(() => {
            if (potencia < 20) potencia += 0.5;
        }, 50);

        document.addEventListener("keyup", function lanzar(event) {
            if (event.code === "Space") {
                clearInterval(cargaInterval);
                pelota.velocidadY = -potencia;
                pelota.enMovimiento = true;
                cargandoPotencia = false;
                document.removeEventListener("keyup", lanzar);
                tiros++;
                document.getElementById("tiros").textContent = "Cantidad de tiros: " + tiros;
            }
        });
    }
});

/* Impide que el uso de la tecla espacio haga scroll en la página */
document.addEventListener("keypress", function (event) {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

actualizar();

function reiniciarPuntaje() {
    puntos = 0;
    tiros = 0;
    document.getElementById("puntos").textContent = "Puntos: " + puntos;
    document.getElementById("tiros").textContent = "Cantidad de tiros: " + tiros;
}

