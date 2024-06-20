// Importa las funciones necesarias de Firebase
import { getFirestore, initializeFirebase } from "./config.js";

initializeFirebase();

// Inicialización de la base de datos Firestore
const db = getFirestore();

// Función para registrar usuarios utilizando Firebase Authentication
function registrarUsuario(correoElectronico, password) {
    firebase.auth().createUserWithEmailAndPassword(correoElectronico, password)
        .then((userCredential) => {
            // Envía un correo electrónico de verificación al usuario registrado
            enviarCorreoVerificacion();
            // Usuario registrado correctamente
           
            console.log("Usuario registrado correctamente:", userCredential.user);
            // Puedes redirigir al usuario a otra página, mostrar un mensaje de éxito, etc.
            guardarDatosUsuario(userCredential.user.uid);
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                MsnERRORRegistrado();
            } else {
                MsnERROR();
            }
            console.error("Error al registrar usuario:", error.message);
        });
}

// Función para enviar correo electrónico de verificación
function enviarCorreoVerificacion() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
        // Correo electrónico de verificación enviado correctamente
        console.log("Correo electrónico de verificación enviado.");
    }).catch(function(error) {
        MsnERROR();
        console.error("Error al enviar el correo electrónico de verificación:", error.message);
    });
}

// Función para validar los datos del formulario
function validarDatos(nombre, apellido, correoElectronico, password, confirmpassword, centrodocente, rol) {
    if (nombre === "" || apellido === "" || correoElectronico === "" || password === "" || confirmpassword === "" || centrodocente === "" || rol === "") {
        console.log("Todos los campos son obligatorios.");
        return false;
    } else if (password !== confirmpassword) {
        MsnERRORpass();
        console.log("La contraseña no coincide");
        return false;
    } else {
        return true;
    }
}

// Manejar el envío del formulario de registro
document.getElementById('guardarRegistro').addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtén los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correoElectronico = document.getElementById("correoElectronico").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;
    const centrodocente = document.getElementById("centrodocente").value;
    const rol = document.getElementById("rol").value;

    // Validar los datos del formulario
    if (validarDatos(nombre, apellido, correoElectronico, password, confirmpassword, centrodocente, rol)) {
        verificarUsuario(correoElectronico, () => {
            // Registra al usuario si los datos son válidos
            registrarUsuario(correoElectronico, password);
        });
    }
});

// Función para verificar si el usuario ya existe en la base de datos
function verificarUsuario(correoElectronico, callback) {
    db.collection("Usuario").where("CorreoElectronico", "==", correoElectronico).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                callback();
            } else {
                MsnERRORRegistrado();
                console.log("El usuario ya está registrado.");
            }
        })
        .catch((error) => {
            MsnERROR();
            console.error("Error al verificar usuario:", error.message);
        });
}

// Función para guardar registros en la base de datos
function guardarDatosUsuario(uid) {
    // Obtén los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correoElectronico = document.getElementById("correoElectronico").value;
    const password = document.getElementById("password").value;
    const centrodocente = document.getElementById("centrodocente").value;
    const rol = document.getElementById("rol").value;

    // Agregar Documentos a la colección "Usuario"
    db.collection("Usuario").add({
        Nombre: nombre,
        Apellido: apellido,
        CorreoElectronico: correoElectronico,
        Password: password,
        Centrodocente: centrodocente,
        Rol: rol
    })
    .then((docRef) => {
        const idUsuario = docRef.id;
        console.log("Document written with ID: ", idUsuario);
        localStorage.setItem('idUsuario', idUsuario);
        MsnOK();
        // Limpiar el formulario
        document.getElementById("nombre").value = '';
        document.getElementById("apellido").value = '';
        document.getElementById("correoElectronico").value = '';
        document.getElementById("password").value = '';
        document.getElementById("confirmpassword").value = '';
        document.getElementById("centrodocente").value = '';
        document.getElementById("rol").value = '';
    })
    .catch((error) => {
        MsnERRORRegistrado();
        console.log("Algo salio mal. Intentelo más tarde.");
    });   
}

// Funciones para mostrar mensajes
const MsnUserR = () => {
    Swal.fire({
        title: "Registrado!",
        text: "Se ha Registrado Correctamente!",
        text: "Verifique la cuenta electronica",
        icon: "success"
    });
}

const MsnERROR = () => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salio mal Intentelo mas tarde!",
    });
}

const MsnERRORpass = () => {
    Swal.fire({
        icon: "error",
        title: "Oops ...",
        text: "La contraseña no coincide intente de nuevo!",
    });
}

const MsnERRORRegistrado = () => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya se encuentra Registrado!",
    });
}

const MsnOK = () => {
    Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "Se ha Guardado Correctamente!",
    });
}
