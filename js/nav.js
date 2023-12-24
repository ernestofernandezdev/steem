"use strict"

document.addEventListener("DOMContentLoaded", main);

function main() {
    document.querySelector("nav button").addEventListener("click", mostrarNav);

    function mostrarNav() {
        document.querySelector("nav ul").classList.toggle("esconder");
    }
}

