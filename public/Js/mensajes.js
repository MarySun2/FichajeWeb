//Firma Guardada
export const Msnguardada = () => {
    Swal.fire({
        title: "Firma Guardada!",
        text: "Se ha Guardado Correctamente!",
        icon: "success"
    });
}

//Firma Actualizada
export const MsnActualizada =() => {
    Swal.fire({
        title: "Firma Actualizada!",
        text: "Se ha Actualizado Correctamente!",
        icon: "success"
    });
}

//Error
export const MsnERROR = () => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salio mal Intentelo mas tarde!",
        footer: '<a href="#">Why do I have this issue?</a>'
    });
}

//Msn funcion Eliminar 
export const EliminarFichaje = () => {
    Swal.fire({
        title: "Fichaje Eliminado!",
        text: "Se ha Eliminado Correctamente!",
        icon: "success"
    });
}
