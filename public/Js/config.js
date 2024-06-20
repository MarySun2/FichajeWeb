// Configuracion Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjY9HRhbvXrH2I2pIScLdyNdqI70QC5Cc",
    authDomain: "proyectmar-cf51f.firebaseapp.com",
    projectId: "proyectmar-cf51f",
    storageBucket: "proyectmar-cf51f.appspot.com",
    messagingSenderId: "762818142551",
    appId: "1:762818142551:web:98159f45db1f0e38c59e12",
    measurementId: "G-JFPFET0NJT"
  };

// Initialize Firebase With Db
export const getFirestore = () => {
    firebase.initializeApp(firebaseConfig);
    return firebase.firestore();
}

// Initialize Firebase
export const initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
}
