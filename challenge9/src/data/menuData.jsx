import { NodoMenu, ArbolMenu } from "../structures/ArbolMenu";

import Inicio from "../pages/Inicio";
import Perfil from "../pages/Perfil";
import Configuracion from "../pages/Configuracion";
import Cuenta from "../pages/Cuenta";
import Seguridad from "../pages/Seguridad";
import Contrasena from "../pages/Contrasena";
import Ayuda from "../pages/Ayuda";
import Contacto from "../pages/Contacto";

const raiz = new NodoMenu("Menú", "/", Inicio);

const inicio = new NodoMenu("Inicio", "/", Inicio);

const perfil = new NodoMenu(
  "Perfil",
  "/perfil",
  Perfil
);

const configuracion = new NodoMenu(
  "Configuración",
  "/configuracion",
  Configuracion
);

const cuenta = new NodoMenu(
  "Cuenta",
  "/configuracion/cuenta",
  Cuenta
);

const seguridad = new NodoMenu(
  "Seguridad y privacidad",
  "/configuracion/seguridad",
  Seguridad
);

const contrasena = new NodoMenu(
  "Contraseña",
  "/configuracion/contrasena",
  Contrasena
);

const ayuda = new NodoMenu(
  "Ayuda",
  "/ayuda",
  Ayuda
);

const contacto = new NodoMenu(
  "Contacto",
  "/ayuda/contacto",
  Contacto
);

configuracion.agregarHijo(cuenta);
configuracion.agregarHijo(seguridad);
configuracion.agregarHijo(contrasena);

ayuda.agregarHijo(contacto);

raiz.agregarHijo(inicio);
raiz.agregarHijo(perfil);
raiz.agregarHijo(configuracion);
raiz.agregarHijo(ayuda);

export const arbolMenu = new ArbolMenu(raiz);