import { getFirestore, initializeFirebase } from "./config.js";

// Inicializa Firebase
initializeFirebase();

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el ID del fichaje de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        cargarDatosFichaje(id);
        document.getElementById('guardar').hidden = true;    
        document.getElementById('actualizarFichaje').hidden = false;

        document.getElementById('actualizarFichaje').addEventListener('click', (event) => {
            event.preventDefault();
            guardarCambios(id);
        });
    }
});

// Función para cargar los datos del fichaje en el formulario
function cargarDatosFichaje(id) {
    const db = getFirestore();
    db.collection('Actividades').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                const actividad = doc.data();
                document.getElementById('fecha').value = new Date(actividad.Fecha).toISOString().substring(0, 10);
                document.getElementById('hora_entrada').value = actividad.Hora_entrada;
                document.getElementById('hora_salida').value = actividad.Hora_Salida;
                document.getElementById('horas').value = actividad.Horas;
                document.getElementById('tarea_realizada').value = actividad.Tarea_realizada;
                document.getElementById('observaciones').value = actividad.Observaciones;
            } else {
                console.log("No se encontró el documento!");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el documento:", error);
        });
}

// Función para guardar los cambios del fichaje editado
function guardarCambios(id) {
    const db = getFirestore();
    const fecha = document.getElementById('fecha').value;
    const horaEntrada = document.getElementById('hora_entrada').value;
    const horaSalida = document.getElementById('hora_salida').value;
    const horas = document.getElementById('horas').value;
    const tareaRealizada = document.getElementById('tarea_realizada').value;
    const observaciones = document.getElementById('observaciones').value;

    db.collection('Actividades').doc(id).update({
        Fecha: fecha,
        Hora_entrada: horaEntrada,
        Hora_Salida: horaSalida,
        Horas: horas,
        Tarea_realizada: tareaRealizada,
        Observaciones: observaciones
    })
    .then(() => {
        MsnActualizada();
        console.log("Fichaje actualizado correctamente");
        window.location.href = 'FichajesAlumno.html'; // Redirigir de nuevo a la página principal después de guardar
    })
    .catch((error) => {
        MsnERROR();
        console.error("Error al actualizar el fichaje:", error);
    });
}

const MsnActualizada =()=> {
    Swal.fire({
        title: "Fichaje Actualizado!",
        text: "Se ha Actualizado Correctamente!",
        icon: "success"
      });
    }

    //Error
    const MsnERROR =()=> {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salio mal Intentelo mas tarde!",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        }