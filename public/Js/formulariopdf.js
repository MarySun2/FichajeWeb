import { getFirestore, initializeFirebase } from "./config.js";

//Inicializa firebase
initializeFirebase();

// Obtener instancia de Firestore
const db = getFirestore();


// Función para cargar los datos de los alumnos
function cargarAlumnos() {
    // buscar elementos del dom
    const p = document.getElementById('centrodocente');
    const p1 = document.getElementById('tutorcentrodocente');
    const p2 = document.getElementById('alumnos');
    const p3 = document.getElementById('familiaprofesional');
    const p4 = document.getElementById('cicloformativo');
    const p5 = document.getElementById('centrodetrabajo');
    const p6 = document.getElementById('tutorcentrotrabajo');
    const p7 = document.getElementById('periodo');
    const p8 = document.getElementById('horas');

    //Se pasa por parametro 
    const urlParams = new URLSearchParams(window.location.search);
    const idAlumno = urlParams.get('idAlumno');

    // Consulta la colección "DatosAlumnos" y obtiene los datos
    db.collection('DatosAlumnos')
    .where('id_Usuario', '==', idAlumno)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const alumno = doc.data(); // Datos del alumno

            p.innerHTML += `<p>${alumno.centro_docente}</p>`;               
            p1.innerHTML += `<p>${alumno.tutor_centro_docente}</p>`;
            p2.innerHTML += `<p>${alumno.alumno} ${alumno.apellido}</p>`;
            p3.innerHTML += `<p>${alumno.familia_profesional}</p>`;
            p4.innerHTML += `<p>${alumno.ciclo_formativo}</p>`;
            p5.innerHTML += `<p>${alumno.centro_trabajo}</p>`;
            p6.innerHTML += `<p>${alumno.tutor_centro_trabajo}</p>`;
            p7.innerHTML += `<p>${alumno.periodo}</p>`;
            p8.innerHTML += `<p>${alumno.horas}</p>`;

            console.log("Datos Cargados correctamente");
        });
    })
    .catch((error) => {
        console.error("Error al cargar los alumnos:", error);
    });
}

///Funcion de ranco por semana
function getDateRangeOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    const desde = new Date(y, 0, d);
    const hasta = new Date(y, 0, d + 6);

    return { fechaDesde: desde.toISOString().split('T')[0], fechaHasta: hasta.toISOString().split('T')[0] };
}

// Función para cargar las actividades del alumno
function cargarActividades() {
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = ''; // Limpia la tabla

    const urlParams = new URLSearchParams(window.location.search);
    const semanaNumero = urlParams.get('semanaNumero');
    const anio = urlParams.get('anio');
    const idAlumno = urlParams.get('idAlumno');

    // Recuperar un valor simple del localStorage
    const { fechaDesde, fechaHasta } = getDateRangeOfWeek(semanaNumero, anio);

    // Consulta la colección "alumnos" y obtiene los datos
    db.collection('Actividades')
        .where('id_Usuario', '==', idAlumno)
        .where('Fecha', '>=', fechaDesde)
        .where('Fecha', '<=', fechaHasta)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const actividades = doc.data(); // Actividades del alumno
                tabla.innerHTML += `
                    <tr class="border-b border-zinc-300 text-center">
                        <td class="p-3 border-r border-zinc-500">${actividades.Fecha}</td>
                        <td class="p-3 border-r border-zinc-500">${actividades.Tarea_realizada}</td>
                        <td class="p-3 border-r border-zinc-500">${actividades.Horas}</td>
                        <td class="p-3 border-r border-zinc-500">${actividades.Observaciones}</td>
                    </tr>
                `;
                
            });
        })
        .catch((error) => {
            console.error("Error al cargar los alumnos:", error);
        });
}

//Firma 
function cargarFirma() {
    // buscar elementos del dom
    const p9 = document.getElementById('semana');
    const p10 = document.getElementById('firmaAlumno');
    const p11 = document.getElementById('firmaTutor');
    const p12 = document.getElementById('firmaprofesor');
    
    //Se pasa por parametro 
    const urlParams = new URLSearchParams(window.location.search);
    const idAlumno = urlParams.get('idAlumno');
    const semanaNumero = urlParams.get('semanaNumero');
    const anio = urlParams.get('anio');
  
    // Consulta la colección "DatosAlumnos" y obtiene los datos
    db.collection('Firma')
    .where('id_Usuario', '==', idAlumno)
    .where('semanaNumero', '==', semanaNumero)
    .where('anio', '==', anio)
    .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const firma = doc.data(); // Datos del alumno

                p9.innerHTML += `<p>${firma.semanaNumero}</p>`;               

                mostrarImagenDesdeBase64(firma.FirmaAlumno, p10);
                mostrarImagenDesdeBase64(firma.FirmaTutor, p11);
                mostrarImagenDesdeBase64(firma.FirmaProfesor, p12);

            console.log("Datos Cargados correctamente");
            });
     })
        .catch((error) => {
            console.error("Error al cargar los alumnos:", error);
        });
}

// Función para mostrar una imagen desde una cadena Base64
function mostrarImagenDesdeBase64(firmaBase64, elementoPadre) {
    // Crea un nuevo elemento de imagen
    const img = document.createElement('img');
    
    // Decodifica la cadena Base64 y establece la URL como fuente de la imagen
    img.src = firmaBase64 ?? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; //  data imagen es vacia para mantener ajustado las otras firmas

    // Ajusta el tamaño si la firma no existe
    if (!firmaBase64) {
        img.width = 100;
        img.height = 200;
    }

    // Agrega la imagen al elemento HTML especificado
    elementoPadre.appendChild(img);
}


// Cargar los datos de los alumnos y las actividades al cargar la página
window.addEventListener('DOMContentLoaded', (event) => {
    cargarAlumnos();
    cargarActividades();
    cargarFirma();
});

