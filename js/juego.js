"use strict"
document.addEventListener("DOMContentLoaded", main);

function main() {
    let imagenActual = 0;
    actualizar(0);

    let imagenes = document.querySelectorAll(".imagenes-secundarias img");
    for (let i = 0; i < imagenes.length; i++) {
        imagenes[i].addEventListener("click", function() {
            actualizar(i);
        });
    }

    function actualizar(num) {
        let imagenPrincipal = document.querySelector(".imagen-principal img");
        imagenPrincipal.setAttribute("src", "img/terraria" + num + ".jpg");
        document.querySelector(".imagenes-secundarias").children[imagenActual].classList.remove("imagen-destacada");
        document.querySelector(".imagenes-secundarias").children[num].classList.add("imagen-destacada");
        imagenActual = num;
    }
}

