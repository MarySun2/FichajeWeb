import { initializeFirebase } from "./config.js";

initializeFirebase();

// Establecer un observador de estado de autenticación
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const email = user.email;
    const emailVerified = user.emailVerified;

    document.getElementById('login').innerHTML = `<p>Logueado ${email}</p>`;

    // Oculta otros elementos si es necesario
    if (document.getElementById('registro')) {
      document.getElementById('registro').style.display = "none";
    }
  } else {
    console.log("Usuario no autenticado");
    document.getElementById('login').innerHTML = "No Logueado!!";
  }
});

// Función para iniciar sesión
const acceso = async () => {
  var email = document.getElementById("email").value;
  var contraseña = document.getElementById("password").value;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, contraseña);
    // Inicio de sesión exitoso
    var user = userCredential.user;
    console.log("Inicio de sesión exitoso: ", user);

    // Obtener el rol del usuario desde Firestore
    const querySnapshot = await firebase
      .firestore()
      .collection("Usuario")
      .where("CorreoElectronico", "==", email)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];

      var rol = doc.data().Rol;
      var idUsuario = doc.id;
      localStorage.setItem('idUsuario', idUsuario);

      // Redirigir al usuario según su rol
      if (rol === "Alumno") {
        window.location.href = "MenuAlumno.html";
      } else if (rol === "profesor") {
        window.location.href = "MenuProfesor.html";
      } else if (rol === "tutor") {
        window.location.href = "MenuTutor.html";
      } else {
        // Redirigir a una página por defecto si no se reconoce el rol
        console.error("Rol de usuario no reconocido");
        window.location.href = "Error.html";
      }
    } else {
      console.log("No se encontró el documento del usuario");
      window.location.href = "Error.html";
    }
  } catch (error) {
    // Error al iniciar sesión o al obtener el documento
    console.error("Error: ", error);
    // Mostrar mensaje de error
    MsnERRORpass();
  }
}

// Función para cerrar sesión
const logout = () => {
  firebase.auth().signOut().then(function() {
    // Cierre de sesión exitoso
    console.log("Cierre de sesión exitoso");
    // Redirigir al usuario a la página de inicio de sesión, por ejemplo
    window.location.href = "loguin.html";
  }).catch(function(error) {
    // Error al cerrar sesión
    console.error("Error al cerrar sesión: ", error);
  });
}

//Funcion msn
const MsnERRORpass = () => {
  Swal.fire({
      icon: "error",
      title: "No Pudo Iniciar Secion ...",
      text: "La contraseña o el usuario no coincide intentelo de nuevo!",
  });
}

// Dom
document.getElementById('loginButton').addEventListener('click', acceso);

document.getElementById('logoutButton').addEventListener('click', logout);
