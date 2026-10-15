export function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "El correo electrónico ya está registrado.";

    case "auth/invalid-email":
      return "El correo electrónico no es válido.";

    case "auth/weak-password":
      return "La contraseña debe tener mínimo 6 caracteres.";

    case "auth/invalid-credential":
      return "Correo electrónico o contraseña incorrectos.";

    case "auth/user-not-found":
      return "El usuario no se encuentra registrado.";

    case "auth/wrong-password":
      return "La contraseña es incorrecta.";

    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta nuevamente más tarde.";

    default:
      return error.message || "Ocurrió un error inesperado.";
  }
}