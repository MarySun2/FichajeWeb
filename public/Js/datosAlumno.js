import { getFirestore } from "./config.js";

// Referencia a la base de datos de Firebase
const db = getFirestore();
 
// Recuperar un valor simple del localStorage
const idUsuario = localStorage.getItem('idUsuario'); 

var inputs = document.querySelectorAll('input');

// Variable de estado para rastrear si los campos de entrada están habilitados
let edicionHabilitada = false;

// Evento de clic en el botón "Editar"
document.getElementById('btn-editar').addEventListener('click', function () {
    if (edicionHabilitada) {
        // Si la edición está habilitada, deshabilitar la edición
        deshabilitarEdicion();
        edicionHabilitada = false;
    } else {
        // Si la edición está deshabilitada, habilitar la edición
        habilitarEdicion();
        edicionHabilitada = true;
    }
});

// Función para habilitar la edición de los campos de entrada
function habilitarEdicion() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute('readonly');
    }
    document.getElementById('btn-guardar').removeAttribute('disabled');
    document.getElementById('btn-guardar').classList.remove('btn-guardar');
}

// Función para deshabilitar la edición de los campos de entrada
function deshabilitarEdicion() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute('readonly', 'readonly');
    }
    document.getElementById('btn-guardar').setAttribute('disabled', 'disabled');
    document.getElementById('btn-guardar').classList.add('btn-guardar');
}


// Deshabilitar la edición por defecto
deshabilitarEdicion();

/*
// Obtener los datos del usuario actual
db.collection('Usuario').doc(idUsuario).get().then((doc) => {
    if (doc.exists) {
        // Rellenar los campos del formulario con los datos del usuario
        document.getElementsByName('alumno')[0].value = doc.data().Nombre;
        document.getElementsByName('apellido')[0].value = doc.data().Apellido;
    } else {
        console.log('No se encontró ningún documento de usuario!');
    }
}).catch((error) => {
    console.log('Error al obtener los datos del usuario:', error);
});
*/

// Obtener los datos del alumno de la colección 'DatosAlumnos'
db.collection('DatosAlumnos').where('id_Usuario', '==', idUsuario).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // Rellenar los campos del formulario con los datos del alumno
        //
        document.getElementsByName('alumno')[0].value = doc.data().alumno;
        document.getElementsByName('apellido')[0].value = doc.data().apellido;
        //
        document.getElementsByName('centro_docente')[0].value = doc.data().centro_docente;
        document.getElementsByName('tutor_centro_docente')[0].value = doc.data().tutor_centro_docente;
        document.getElementsByName('familia_profesional')[0].value = doc.data().familia_profesional;
        document.getElementsByName('ciclo_formativo')[0].value = doc.data().ciclo_formativo;
        document.getElementsByName('centro_trabajo')[0].value = doc.data().centro_trabajo;
        document.getElementsByName('tutor_centro_trabajo')[0].value = doc.data().tutor_centro_trabajo;
        document.getElementById('periodo').value = doc.data().periodo || '';
        document.getElementById('horas').value = doc.data().horas || '';
    });
}).catch((error) => {
    console.log('Error al obtener los datos del alumno:', error);
});



document.getElementById('btn-actualizar').addEventListener('click', function () {
    // Captura los datos del formulario
    const centroDocente = document.getElementsByName('centro_docente')[0].value;
    const tutorCentroDocente = document.getElementsByName('tutor_centro_docente')[0].value;
    const alumno = document.getElementsByName('alumno')[0].value;
    const apellido = document.getElementsByName('apellido')[0].value;
    const familiaProfesional = document.getElementsByName('familia_profesional')[0].value;
    const cicloFormativo = document.getElementsByName('ciclo_formativo')[0].value;
    const centroTrabajo = document.getElementsByName('centro_trabajo')[0].value;
    const tutorCentroTrabajo = document.getElementsByName('tutor_centro_trabajo')[0].value;
    const periodo = document.getElementById('periodo').value;
    const horas = document.getElementById('horas').value;

    
    
    // Recuperar un valor simple del localStorage
    const idUsuario = localStorage.getItem('idUsuario');   

    // Guarda los datos del formulario en la colección "alumnos" en Firestore
    db.collection('DatosAlumnos').add({
        id_Usuario: idUsuario,
        centro_docente: centroDocente,
        tutor_centro_docente: tutorCentroDocente,
        alumno: alumno,
        apellido: apellido,
        familia_profesional: familiaProfesional,
        ciclo_formativo: cicloFormativo,
        centro_trabajo: centroTrabajo,
        tutor_centro_trabajo: tutorCentroTrabajo,
        periodo: periodo,
        horas: horas
        
    }).then(function (docRef) {
        console.log('Documento agregado con ID: ', idUsuario);
        alert('Datos del alumno guardados correctamente.');
    }).catch(function (error) {
        console.error('Error al guardar los datos del alumno:', error);
    });
});

// CODIGO MODIFICADO 

document.getElementById('btn-guardar').addEventListener('click', function () {
    // Captura los datos del formulario
    const centroDocente = document.getElementsByName('centro_docente')[0].value;
    const tutorCentroDocente = document.getElementsByName('tutor_centro_docente')[0].value;
    const alumno = document.getElementsByName('alumno')[0].value;
    const apellido = document.getElementsByName('apellido')[0].value;
    const familiaProfesional = document.getElementsByName('familia_profesional')[0].value;
    const cicloFormativo = document.getElementsByName('ciclo_formativo')[0].value;
    const centroTrabajo = document.getElementsByName('centro_trabajo')[0].value;
    const tutorCentroTrabajo = document.getElementsByName('tutor_centro_trabajo')[0].value;
    const periodo = document.getElementById('periodo').value;
    const horas = document.getElementById('horas').value;

    // Recuperar un valor simple del localStorage
    const idUsuario = localStorage.getItem('idUsuario');   

    // Actualiza los datos del formulario en la colección "DatosAlumnos" en Firestore
    db.collection('DatosAlumnos').doc(idUsuario).set({
        id_Usuario: idUsuario,
        centro_docente: centroDocente,
        tutor_centro_docente: tutorCentroDocente,
        alumno: alumno,
        apellido: apellido,
        familia_profesional: familiaProfesional,
        ciclo_formativo: cicloFormativo,
        centro_trabajo: centroTrabajo,
        tutor_centro_trabajo: tutorCentroTrabajo,
        periodo: periodo,
        horas: horas
        
    }).then(function () {
        console.log('Documento actualizado con ID: ', idUsuario);
        alert('Datos del alumno actualizados correctamente.');
    }).catch(function (error) {
        console.error('Error al actualizar los datos del alumno:', error);
    });
});


