// Importa las funciones necesarias desde el archivo de configuración
import { getFirestore, initializeFirebase } from "./config.js";
import { Msnguardada, MsnActualizada, MsnERROR, EliminarFichaje } from "./mensajes.js";

// Inicializa Firebase
initializeFirebase();

// Función para obtener el número de semana
function getWeek(date) {
    date = new Date(date.getTime());
    var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    var firstWeekDay = firstDayOfYear.getDay();
    if (firstWeekDay === 0) {
        firstWeekDay = 7;
    }
    var dayOfYear = (date - firstDayOfYear) / (24 * 60 * 60 * 1000) + 1;
    var weekNumber = Math.ceil((dayOfYear + firstWeekDay) / 7);
    return weekNumber;
}

//Fichaje + agregar + visual los datos
document.addEventListener("DOMContentLoaded", function() {
    // Llamar a la función para cargar las actividades inmediatamente
    cargarActividades();
});

// Cargar actividades y organizarlas por semanas
// Función para crear una nueva semana
function crearNuevaSemana(semanaNumero, anio, idAlumno) {
    var nuevaSemana = document.createElement("div");
    nuevaSemana.classList.add("card");

    var cabecera = document.createElement("div");
    cabecera.classList.add("card-header");
    cabecera.innerHTML = `
        <h2 class="mb-0">
            <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#semana-${semanaNumero}" aria-expanded="true" aria-controls="semana-${semanaNumero}">
                <div class="d-flex justify-content-left mb">
                    <div><h4>Semana ${semanaNumero}</h4></div>
                    <div class="btn-efec">
                        <!-- Boton Fichar -->
                        <button onclick="window.location.href = 'Fichar.html'" class="btn btn-light me-2 imgbtn btnf" data-bs-toggle="tooltip" title="Fichar"></button>
                        <!-- Boton Pdf -->
                        <button class="btn btn-light me-2 imgbtn descargarPdf" data-semana-numero="${semanaNumero}" data-anio="${anio}"data-bs-toggle="tooltip" title="Generar"></button>
                        <!-- Boton Firma -->
                        <button class="btn btn-light me-2 imgbtn firmarSemana" data-semana-numero="${semanaNumero}" data-anio="${anio}" data-bs-toggle="tooltip" title="Firmar"></button>
                    </div>
                </div>
            </button>
        </h2>
    `;

    var cuerpo = document.createElement("div");
    cuerpo.id = "semana-" + semanaNumero;
    cuerpo.classList.add("collapse");
    cuerpo.innerHTML = `
        <div class="card-body">
            <!-- Tabla -->
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="align-middle text-center">Fecha</th>
                        <th scope="col" class="align-middle text-center">Hora de Entrada</th>
                        <th scope="col" class="align-middle text-center">Hora de Salida</th>
                        <th scope="col" class="align-middle text-center">Horas</th>
                        <th scope="col" class="align-middle text-center">Tarea Realizada</th>
                        <th scope="col" class="align-middle text-center">Observaciones</th>
                        <th scope="col" class="align-middle text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-${semanaNumero}">
                    <!-- Aquí se agregan las filas de las actividades -->
                </tbody>
            </table>
            <!--Cuadro Firma-->
            <div id="divFirma-${semanaNumero}" class="d-flex justify-content-center mb-3 ocultar-div">
                <div class="m-3">
                    <canvas id="canvas-${semanaNumero}" width="200" height="100" style="border:1px solid black"></canvas><br>
                    <h6>Firma: Alumno</h6>
                </div>
                <div class= "p-4 text-center">
                    <p>He leído y entiendo la Política de Protección de Datos. <br>Consiento el tratamiento de mis datos 
                    personales conforme a lo establecido en dicha política.</p>
                    <!--Boton de Firmar-->
                    <button class="btn btn-light me-2 guardarfirma" data-semana-numero="${semanaNumero}" data-anio="${anio}" data-id-alumno="${idAlumno}">Firmar</button>
                    <!--Boton de Limpiar-->
                    <button class="btn btn-light me-2 limpiarPdf" data-semana-numero="${semanaNumero}">Limpiar</button>
                </div>
            </div>
        </div>
    `;

    nuevaSemana.appendChild(cabecera);
    nuevaSemana.appendChild(cuerpo);

    var contenedorSemanas = document.getElementById("tabla-semanas");
    contenedorSemanas.appendChild(nuevaSemana);

    configurarCanvas(`canvas-${semanaNumero}`);
}

function cargarActividades() {
    // Obtén la referencia a Firestore
    const db = getFirestore();

    // Recuperar un valor simple del localStorage
    const idUsuario = localStorage.getItem('idUsuario');

    document.getElementById('tabla-semanas').innerHTML = '';    

    db.collection('Actividades')
        .where('id_Usuario', '==', idUsuario)
        .get()
        .then((querySnapshot) => {
            var actividadesPorSemana = {};
            querySnapshot.forEach((doc) => {
                const actividad = doc.data();
                const fecha = new Date(actividad.Fecha);
                const semana = getWeek(fecha);

                if (!actividadesPorSemana[semana]) {
                    actividadesPorSemana[semana] = [];
                }

                actividadesPorSemana[semana].push({ id: doc.id, anio: fecha.getFullYear(), ...actividad });
            });

            // Crear elementos de semana y agregar actividades
            for (let semana in actividadesPorSemana) {
                crearNuevaSemana(semana, actividadesPorSemana[semana][0].anio, idUsuario);

                var tabla = document.getElementById(`tabla-${semana}`);

                actividadesPorSemana[semana].forEach((actividad) => {
                    tabla.innerHTML += `
                        <tr>
                            <td class="align-middle text-center">${actividad.Fecha}</td>
                            <td class="align-middle text-center">${actividad.Hora_entrada}</td>
                            <td class="align-middle text-center">${actividad.Hora_Salida}</td>
                            <td class="align-middle text-center">${actividad.Horas}</td>
                            <td class="align-middle text-center">${actividad.Tarea_realizada}</td>
                            <td class="align-middle text-center">${actividad.Observaciones}</td>
                            <td class="align-middle text-center">
                            <!-- Boton Firma -->
                                <button data-id="${actividad.id}" class="btn btn-light editarFichaje me-2 imgbtn edit" data-bs-toggle="tooltip" title="Editar"></button>
                                <button data-id="${actividad.id}" class="btn btn-light eliminarFichaje eliminar imgbtn" data-bs-toggle="tooltip" title="Eliminar"></button>
                            </td>
                        </tr>
                    `;
                });
            }
        })
        .catch((error) => {
            console.error("Error al cargar las actividades:", error);
        });
}

//Informacion del Alumno ______________________________________________________
// Función para cargar los datos de los alumnos en la tabla
function cargarDatos() {
    const db = getFirestore();
    const tbody = document.getElementById('datos-alumno-body');

    // Recuperar un valor simple del localStorage
    const idUsuario = localStorage.getItem('idUsuario');   

    // Obtener los datos de los alumnos del usuario actual
    db.collection('DatosAlumnos').where('id_Usuario', '==', idUsuario)
    .onSnapshot((querySnapshot) => {
        // Limpiar la tabla antes de cargar los datos
        tbody.innerHTML = '';

        querySnapshot.forEach((doc) => {
            // Actualizar el contenido de la tabla con los datos del alumno
            tbody.innerHTML = `
                <tr>
                    <th>CENTRO DOCENTE</th>
                    <td>${doc.data().centro_docente}</td>
                </tr>
                <tr>
                    <th>TUTOR CENTRO DOCENTE</th>
                    <td>${doc.data().tutor_centro_docente}</td>
                </tr>
                <tr>
                    <th>NOMBRE</th>
                    <td>${doc.data().alumno}</td>
                </tr>
                <tr>
                    <th>APELLIDO</th>
                    <td>${doc.data().apellido}</td>
                </tr>
                <tr>
                    <th>FAMILIA PROFESIONAL</th>
                    <td>${doc.data().familia_profesional}</td>
                </tr>
                <tr>
                    <th>CICLO FORMATIVO</th>
                    <td>${doc.data().ciclo_formativo}</td>
                </tr>
                <tr>
                    <th>CENTRO TRABAJO</th>
                    <td>${doc.data().centro_trabajo}</td>
                </tr>
                <tr>
                    <th>PERIODO</th>
                    <td>${doc.data().periodo}</td>
                </tr>
                <tr>
                    <th>HORAS</th>
                    <td>${doc.data().horas}</td>
                </tr>
            `;
        });
    });
    
}

// Llamar a la función para cargar los datos inmediatamente
cargarDatos();


// Evento para escuchar el clic en los botones dentro de la tabla
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('editarFichaje')) {
        const id = event.target.dataset.id;
        editarFichaje(id);
    } else if (event.target.classList.contains('eliminarFichaje')) {
        const id = event.target.dataset.id;
        eliminarFichaje(id);
    } else if (event.target.classList.contains('firmarSemana')) {
        const semanaNumero = event.target.dataset.semanaNumero;
        const anio = event.target.dataset.anio;
        firmarSemana(semanaNumero, anio);
    } else if (event.target.classList.contains('limpiarPdf')) {
        const semanaNumero = event.target.dataset.semanaNumero;
        limpiarPdf(semanaNumero);
    } else if (event.target.classList.contains('guardarfirma')) {
        const semanaNumero = event.target.dataset.semanaNumero;
        const anio = event.target.dataset.anio;
        const idUsuario = event.target.dataset.idAlumno;
        guardarFirmaDb(semanaNumero, anio, idUsuario);
    } else if (event.target.classList.contains('descargarPdf')) {
        const semanaNumero = event.target.dataset.semanaNumero;
        const anio = event.target.dataset.anio;
        window.open(`formularioPdf.html?idAlumno=${idUsuario}&semanaNumero=${semanaNumero}&anio=${anio}`, "_blank");
    }
});

async function getFirma(idUsuario, semanaNumero, anio) {
    return await db.collection("Firma")
        .where('semanaNumero', '==', semanaNumero)
        .where('anio', '==', anio)
        .where('id_Usuario', '==', idUsuario)
        .get();
} 

// Función para eliminar un Fichaje
function eliminarFichaje(id) {
    const db = getFirestore();

    // Elimina el documento de la colección "alumnos"
    db.collection("Actividades").doc(id).delete()
        .then(() => {
            console.log("Fichaje eliminado correctamente");
            EliminarFichaje();
            // Vuelve a cargar los datos después de eliminar el alumno
            cargarActividades();
        })
        .catch((error) => {
            console.error("Error al eliminar Fichaje:", error);
            MsnERROR();
        });
}

// Función para editar un Fichaje
function editarFichaje(id) {
    window.location.href = `Fichar.html?id=${id}`;
}

// Función para firmar una Semana
async function firmarSemana(semanaNumero, anio) {
    const divFirma = document.getElementById(`divFirma-${semanaNumero}`);
    divFirma.classList.remove('ocultar-div');

    const firma = await getFirma(idUsuario, semanaNumero, anio);

    if (firma === undefined || firma === null || firma.docs.length === 0)
        return

    const image = new Image();
    image.onload = function() {
        const canvas = document.getElementById(`canvas-${semanaNumero}`);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
    };
    image.src = firma.docs[0].data().FirmaAlumno;
}

// Código para capturar la firma del usuario utilizando Canvas 
function configurarCanvas(idCanvas) {
    const canvas = document.getElementById(idCanvas);
    const context = canvas.getContext('2d');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
        if (!isDrawing) return;

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

//Funcion borrar Firma
// Función para limpiar la firma del Pdf (Canvas)
function limpiarPdf(semanaNumero) {
    const canvas = document.getElementById(`canvas-${semanaNumero}`);
    const context = canvas.getContext('2d');

    // Limpiar el contenido del canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Recuperar un valor simple del localStorage
const idUsuario = localStorage.getItem('idUsuario');

// Obtén la referencia a Firestore
const db = getFirestore();

//Funcion Guardar la Firma
function guardarFirmaDb(semanaNumero, anio, idUsuario) {
    const canvas = document.getElementById(`canvas-${semanaNumero}`);

    // Convertir el contenido del canvas a Blob
    canvas.toBlob((blob) => {
        blobToBase64(blob)
        .then((base64Data) => {
            // Consultar base de datos para saber si ya existe una firma
            getFirma(idUsuario, semanaNumero, anio)
            .then((querySnapshot) => {
                // Si hay una firma
                if (querySnapshot.docs.length > 0) {
                    // Actualizar la firma existente en Firestore
                    actualizarFirmaAlumno(querySnapshot.docs[0].id, base64Data);
                } else {
                    // Guardar la firma en Firestore
                    guardarNuevaFirmaAlumno(idUsuario, base64Data, semanaNumero, anio);
                }
            });
        });
    });
}

function guardarNuevaFirmaAlumno(idUsuario, base64Data, semanaNumero, anio) {
    db.collection("Firma").add({
        id_Usuario: idUsuario,
        FirmaAlumno: base64Data,
        semanaNumero: semanaNumero,
        anio: anio
    })
    .then((docRef) => {
        console.log("Documento escrito con ID: ", docRef.id);
        Msnguardada();
    })
    .catch((error) => {
        console.error("Error agregando documento: ", error);
        MsnERROR();
    });
}

// Funcion para actualizar la firma
function actualizarFirmaAlumno(idFirma, base64Data) {
    db.collection("Firma").doc(idFirma).update({
        FirmaAlumno: base64Data,
    })
    .then(() => {
        MsnActualizada();
        console.log("Documento actualizado con ID: ", idFirma);
        
    })
    .catch((error) => {
        console.error("Error actualizando documento: ", error);
        MsnERROR();
    });
}
