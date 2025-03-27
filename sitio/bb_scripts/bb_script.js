/* ---------------------------- ANIMACIÓN de despliegue y colapso de menú con el toggler ---------------------------- */
const toggler = document.querySelector(".toggler-boton");

toggler.addEventListener("click", function () {
    document.querySelector("#barrita").classList.toggle("collapsed");
});






/* ---------------------------- VALIDACIÓN DEL FORM en JavaScript ---------------------------- */
document.getElementById("formContacto").addEventListener("submit", function(event) {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    let radios = document.querySelectorAll("input[name='origen']");
    let errorMessage = '';

    /* Limpiamos los mensajes de error previos */
    document.querySelectorAll(".error-message").forEach(function(msg) {
        msg.remove();
});

/* Los  "event.preventDefault();" impiden que se envíe el formulario */

/* Validación para nombre */
if (nombre === "") {
    errorMessage = '¡Este campo es obligatorio!';
    showError("nombre", errorMessage);
    event.preventDefault();
}

/* Validación para email */
if (email === "") {
    errorMessage = '¡Este campo es obligatorio!';
    showError("email", errorMessage);
    event.preventDefault();
} else if (!email.includes("@") || !email.includes(".")) {
    errorMessage = '¡Tenés que usar un correo válido!';
    showError("email", errorMessage);
    event.preventDefault();
}

/* Validación para mensaje */
if (mensaje === "") {
    errorMessage = '¡Este campo es obligatorio!';
    showError("mensaje", errorMessage);
    event.preventDefault();
}

/*  Validación para radios */
let radioChecked = Array.from(radios).some(radio => radio.checked);
if (!radioChecked) {
    errorMessage = '¡Seleccioná cómo llegaste a la página!';
    showError("radios", errorMessage);
    event.preventDefault();
}
});

/* Muestra mensaje de error */
function showError(id, message) {
    let element = document.getElementById(id);
    let errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.innerHTML = `<i class="lni lni-warning"></i> ${message}`;
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}
