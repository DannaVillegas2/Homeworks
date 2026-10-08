import { createContext, useEffect, useState } from "react"; /**Importaciones de React */
import { onAuthStateChanged } from "firebase/auth"; /*Importación de la función onAuthStateChanged de Firebase para escuchar cambios en el estado de autenticación */
import { auth } from "../firebase/firebaseConfig"; /*Importación del objeto auth de Firebase para interactuar con la autenticación de usuarios */
import useFirebaseAuth from "../hooks/useFirebaseAuth"; /*Importación del hook personalizado useFirebaseAuth para manejar la autenticación de usuarios */

export const AuthContext = createContext(); /*Creación del contexto de autenticación para compartir el estado de autenticación entre componentes */

export const AuthProvider = ({ children }) => { /*Componente proveedor de contexto de autenticación que envuelve a los componentes hijos y proporciona el estado de autenticación */
  const [user, setUser] = useState(null); /*Estado local para almacenar el usuario autenticado */
  const [loading, setLoading] = useState(true); /*Estado local para indicar si la autenticación está en proceso de carga */

  const { register, login, logout } = useFirebaseAuth(); /*Desestructuración de las funciones de registro, inicio de sesión y cierre de sesión del hook useFirebaseAuth */

  useEffect(() => { /*Efecto secundario que se ejecuta al montar el componente para escuchar cambios en el estado de autenticación */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { /*Suscripción a los cambios en el estado de autenticación utilizando la función onAuthStateChanged de Firebase */
      setUser(currentUser); /*Actualización del estado del usuario con el usuario autenticado actual */
      setLoading(false); /*Actualización del estado de carga */
    }); /*Retorno de la función de limpieza para cancelar la suscripción al desmontar el componente */

    return () => unsubscribe(); /*Función de limpieza que se ejecuta al desmontar el componente para cancelar la suscripción a los cambios en el estado de autenticación */
  }, []); /*   El efecto se ejecuta solo una vez al montar el componente, ya que el array de dependencias está vacío */

  return (
    <AuthContext.Provider /*Componente proveedor de contexto de autenticación que envuelve a los componentes hijos y proporciona el estado de autenticación */
      value={{ /*Valor del contexto que se proporciona a los componentes hijos */
        user, /*Estado del usuario autenticado */
        loading, /*Estado de carga de la autenticación */
        register, /*Función para registrar un nuevo usuario */
        login, /*Función para iniciar sesión con un usuario existente */
        logout, /*Función para cerrar sesión del usuario autenticado */
      }} 
    >
      {children} 
    </AuthContext.Provider> /*Cierre del componente proveedor de contexto de autenticación */
  );
};