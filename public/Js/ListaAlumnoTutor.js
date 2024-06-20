// Importa las funciones necesarias desde el archivo de configuración
import { getFirestore, initializeFirebase } from "./config.js";

// Inicializa Firebase
initializeFirebase();

// Obtén la referencia a Firestore
const db = getFirestore();

// Función para cargar los datos de los alumnos
function cargarAlumnos() {
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = ''; // Limpia la tabla

    // Recuperar un valor simple del localStorage
const idUsuario = localStorage.getItem('idUsuario');

    // Consulta la colección "alumnos" y obtiene los datos
    db.collection('DatosAlumnos').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const alumno = doc.data(); // Datos del alumno
                tabla.innerHTML += `
                    <tr>
                        <td>${alumno.alumno}</td>
                        <td>${alumno.centro_docente}</td>
                        <td>${alumno.centro_trabajo}</td>
                        <td class="align-middle text-center">
                            <button class="btn btn-light ver-fichajes imgbtn" data-id="${doc.id}" data-bs-toggle="tooltip" title="Ver Fichajes"></button>
                        </td>
                    </tr>
                `;
                
            });
        })
        .catch((error) => {
            console.error("Error al cargar los alumnos:", error);
        });
}

// Función para redireccionar a la página de datos de fichajes de un alumno específico
function verFichajesAlumno(id) {
    // Redirecciona a la página DatosFichajesAlumnos.html con el ID del alumno en la URL
    window.location.href = `DatosFichajesAlumnosTutor.html?id=${id}`;
}

// Evento para escuchar el clic en los botones dentro de la tabla
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('ver-fichajes')) {
        const id = event.target.dataset.id;
        verFichajesAlumno(id);
    } else if (event.target.classList.contains('eliminar')) {
        const id = event.target.dataset.id;
        eliminarAlumno(id);
    }
});

// Cargar los datos de los alumnos al cargar la página
window.onload = cargarAlumnos;


