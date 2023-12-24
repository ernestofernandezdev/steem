"use strict"
console.log("Acá se llamó el script.");
function mostrarCrearCuenta() {
    let botones = document.querySelectorAll(".compra button");
    console.log("Acá se ejecutó el script.");

    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", mostrarCrearCuenta); 
    }
    

    function mostrarCrearCuenta() {
        this.parentNode.children[2].classList.remove("esconder");
    }
}