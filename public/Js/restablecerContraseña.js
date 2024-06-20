import { initializeFirebase } from "./config.js";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

initializeFirebase();
const auth = getAuth();

// Función para restablecer la contraseña
document.getElementById('resetPassword').addEventListener('click', (event) => {
  event.preventDefault(); // Esto previene la recarga de la página
  var emailReset = document.getElementById('emailReset').value;
  sendPasswordResetEmail(auth, emailReset)
  .then(() => {
    console.log('Correo de restablecimiento de contraseña enviado.');
    // Aquí puedes manejar lo que sucede después de enviar el correo
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // Aquí puedes manejar los errores, como mostrar un mensaje al usuario
    console.log(errorCode);
    console.log(errorMessage);
  });
});
