"use strict"

document.addEventListener("DOMContentLoaded", main);

function main() {
    const API_URL = "https://648c8a828620b8bae7ed1010.mockapi.io";
    const grupoUsuarios = [{
        "usuario": "Ern3st",
        "mail": "fernandez.ernes@gmail.com",
        "contra": "123456",
        "nombre": "Ernesto",
        "apellido": "Fernández",
        "pais": "argentina",
        "premium": true
    },
    {
        "usuario": "Rorro Pirrorro",
        "mail": "rociobb@gmail.com",
        "contra": "pancito",
        "nombre": "Rocio",
        "apellido": "Benítez",
        "pais": "peru",
        "premium": false
    },
    {
        "usuario": "Duraku",
        "mail": "vmartorell@gmail.com",
        "contra": "4444",
        "nombre": "Valentín",
        "apellido": "Martorell",
        "pais": "uruguay",
        "premium": false
    },
    {
        "usuario": "gabi55",
        "mail": "gabrielperez55@gmail.com",
        "contra": "gab1234",
        "nombre": "Gabriel",
        "apellido": "Pérez",
        "pais": "uruguay",
        "premium": true
    }];
    const captchas = ["6097","5544","UW4X","XSXU","JVTK","TH26","673736","286903"];

    let r = Math.trunc(Math.random()*8);
    document.querySelector(".captcha img").setAttribute("src","img/captchas/captcha" + r + ".png");

    document.querySelector("form").addEventListener("submit", verificar);



    let usuarios = [];
    cargarUsuarios().then(usuariosAPI => {
        usuarios = usuariosAPI;
        imprimirTabla();
    });

    async function cargarUsuarios() {
        let usuariosAPI = [];
        try {
            let response = await fetch(API_URL + "/usuarios");
            if (response.ok) {
                usuariosAPI = await response.json();
            }
        } catch(e) {
            console.log(e);
        }
        return usuariosAPI;
    }



    document.querySelector("#agregar-tres").addEventListener("click", agregarVarios);

    async function agregarVarios() {
        for (const usuario of grupoUsuarios) {
            await agregarUsuario(usuario);
        }
        usuarios = await cargarUsuarios();
        imprimirTabla();
    }
    
    async function agregarUsuario(usuario) {
        const props = {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(usuario)
        };
        try {
            await fetch(API_URL + "/usuarios", props);
        } catch (e) {
            console.log(e);
        }
    }



    document.querySelector("#borrar-todo").addEventListener("click", limpiarTabla);

    async function limpiarTabla() {
        for (let i = 0; i < usuarios.length; i++) {
            await eliminarUsuario(usuarios[i]);
        }
        usuarios = await cargarUsuarios();
        imprimirTabla();
    }

    async function eliminarUsuario(usuario) {
        try {
            await fetch(API_URL + "/usuarios/" + usuario.id, {method: 'DELETE'});
        } catch (e) {
            console.log(e);
        }
    }



    function verificar(e) {
        e.preventDefault();
        let campos = this.children;
        let camposSize = campos.length;
        let camposLlenos = true;
        let captchaValido = true;
        let contraCoinciden = true;
        let mailCoinciden = true;
    
        for (let i = 1; i<camposSize-1; i++) {
            if (campos[i].children[1].value == "") {
                camposLlenos = false;
            }
        }
    
        let formData = new FormData(this);
        if (formData.get("contrasena") != formData.get("confirmar-contrasena")) {
            contraCoinciden = false;
        }
        if (formData.get("mail") != formData.get("confirmar-mail")) {
            mailCoinciden = false;
        }
        if (captchas[r] != formData.get("captcha").toUpperCase()) {
            captchaValido = false;
        }
    
    
        let comprobacion = document.querySelector(".comprobacion");
        comprobacion.innerHTML = "";
        comprobacion.classList.remove("esconder", "comprobacion-denegada", "comprobacion-aprobada");
    
        if (camposLlenos && contraCoinciden && mailCoinciden && captchaValido) {
            comprobacion.classList.add("comprobacion-aprobada");
            comprobacion.innerHTML = "<p>El formulario ha sido aprobado!</p>";
            actualizarTabla(formData);
            for (let i = 1; i<camposSize-1; i++) {
                if (campos[i].children[1].name != "pais") {
                    campos[i].children[1].value = "";
                } else {
                    campos[i].children[1].value = "argentina";
                }
                document.querySelector("#captcha").value = "";
                r = Math.trunc(Math.random()*8);
                document.querySelector(".captcha img").setAttribute("src","img/captchas/captcha" + r + ".png");
            }
        } else {
            comprobacion.classList.add("comprobacion-denegada");
            if (!camposLlenos) {
                comprobacion.innerHTML += "<p>Algunos de los campos están sin completar.</p>";
            }
            if (!contraCoinciden) {
                comprobacion.innerHTML += "<p>Las contraseñas no coinciden.</p>";
            }
            if (!mailCoinciden) {
                comprobacion.innerHTML += "<p>Los mails no coinciden.</p>";
            }
            if (!captchaValido) {
                comprobacion.innerHTML += "<p>El captcha ingresado no es válido.</p>";
            }
        }
    }

    async function actualizarTabla(formData) {
        let nuevaCuenta = {};
        nuevaCuenta.usuario = formData.get("usuario");
        nuevaCuenta.mail = formData.get("mail");
        nuevaCuenta.contra = formData.get("contrasena");
        nuevaCuenta.nombre = formData.get("nombre");
        nuevaCuenta.apellido = formData.get("apellido");
        nuevaCuenta.pais = formData.get("pais");
        nuevaCuenta.premium = (formData.get("premium") == "on") ? true : false;
        await agregarUsuario(nuevaCuenta);
        usuarios = await cargarUsuarios();

        imprimirTabla();
    }

    function imprimirTabla() {
        let tabla = document.querySelector(".cuentas tbody");
        tabla.innerHTML = "";
        for (const cuenta of usuarios) {
            if (cuenta.premium == true) {
                tabla.innerHTML += "<tr class='premium'><td>" + cuenta.usuario + "</td><td>" + cuenta.mail + "</td><td>" + cuenta.contra + "</td><td>" + cuenta.nombre + "</td><td>" + cuenta.apellido + "</td><td>" + cuenta.pais + "</td><td><button class='editar'><i class='fa fa-pencil'></i></button><button class='eliminar'><i class='fa fa-trash'></i></button></td></tr>";
            } else {
                tabla.innerHTML += "<tr><td>" + cuenta.usuario + "</td><td>" + cuenta.mail + "</td><td>" + cuenta.contra + "</td><td>" + cuenta.nombre + "</td><td>" + cuenta.apellido + "</td><td>" + cuenta.pais + "</td><td><button class='editar'><i class='fa fa-pencil'></i></button><button class='eliminar'><i class='fa fa-trash'></i></button></td></tr>";
            }
        }
        let botones = document.querySelectorAll(".eliminar");
        for (let i = 0; i < botones.length; i++) {
            botones[i].addEventListener("click", function() {
                borrarUsuario(i);
            } )
        }
        console.log(usuarios);
    }

    async function borrarUsuario(i) {
        await eliminarUsuario(usuarios[i]);
        usuarios = await cargarUsuarios();
        imprimirTabla();
    }
}

