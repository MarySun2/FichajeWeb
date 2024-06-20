import { getFirestore, initializeFirebase } from "./config.js";

//Inicializa firebase
initializeFirebase();

// Obtener instancia de Firestore
const db = getFirestore();

// Función para guardar los datos de la tabla en Firestore
function guardarFormulario() {
    // Acceder a la tabla
    var table = document.getElementById("tablaFichaje").getElementsByTagName('tbody')[0];
    var rows = table.rows;

    // Recorrer todas las filas de la tabla
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;

        // Obtener los valores de cada celda en la fila
        var fecha = cells[0].querySelector("input[type='date']").value;
        var hora_entrada = cells[1].querySelector("input[type='time']").value;
        var hora_salida = cells[2].querySelector("input[type='time']").value;
        var horas = cells[3].querySelector("input[type='text").value;
        var tarea_realizada = cells[4].querySelector("textarea").value;
        var observaciones = cells[5].querySelector("textarea").value;

        // Recuperar un valor simple del localStorage
        const idUsuario = localStorage.getItem('idUsuario');

        // Guardar los datos en Firestore
        db.collection("Actividades").add({
            id_Usuario: idUsuario,
            Fecha: fecha,
            Hora_entrada: hora_entrada,
            Hora_Salida: hora_salida,
            Horas: horas,
            Tarea_realizada: tarea_realizada,
            Observaciones: observaciones
        })
        .then((docRef) => {
            MsnOK();
            //  //console.log("Documento guardado con ID: ", docRef.id);
            //  cambiarTextoBoton();---- Error

            //console.log("Documento guardado con ID: ", docRef.id);
        })
        .catch((error) => {
            MsnERROR();
            //console.error("Error al agregar documento: ", error);
        });
    }

    // Consulta de Actividades para un Usuario específico
function obtenerActividades(idUsuario) {
    db.collection('Actividades').where('idUsuario', '==', idUsuario)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error obteniendo documentos: ", error);
    });
}


    // Limpiar los campos después de guardar
    limpiarCampos();
}

// Limpiar los campos de la tabla después de guardar
function limpiarCampos() {
    var table = document.getElementById("tablaFichaje").getElementsByTagName('tbody')[0];
    var rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            // Limpiar el contenido de los campos
            if (j < 4) {
                cells[j].querySelector("input").value = '';
            } else {
                cells[j].querySelector("textarea").value = '';
            }
        }
    }
}

// Función para mostrar mensaje de éxito
const MsnOK = () => {
    Swal.fire({
        title: "Registrado!",
        text: "Se ha Guardado Correctamente!",
        icon: "success"
    });
}

// Función para mostrar mensaje de error
const MsnERROR = () => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal. ¡Inténtelo más tarde!",
        footer: '<a href="#">¿Por qué tengo este problema?</a>'
    });
}

// Evento click para el botón de guardar formulario
document.getElementById("guardar").addEventListener("click", guardarFormulario);
