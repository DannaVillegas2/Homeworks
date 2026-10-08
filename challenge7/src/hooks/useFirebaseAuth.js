import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

const useFirebaseAuth = () => {
  const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return {
    register, /** registrar */
    login, /** iniciar sesión */
    logout, /** cerrar sesión */
  };
};

export default useFirebaseAuth;