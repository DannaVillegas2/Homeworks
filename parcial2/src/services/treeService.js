import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

const NODES_COLLECTION = "nodes";

export async function createTreeNode({
  name,
  type,
  parentId,
  createdBy,
}) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Debes iniciar sesión para crear archivos o carpetas."
    );
  }

  if (!currentUser.email) {
    throw new Error(
      "El usuario autenticado no posee un correo válido."
    );
  }

  if (currentUser.email !== createdBy) {
    throw new Error(
      "El correo del creador no coincide con el usuario autenticado."
    );
  }

  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("El nombre es obligatorio.");
  }

  if (type !== "folder" && type !== "file") {
    throw new Error("El tipo de elemento no es válido.");
  }

  if (!parentId) {
    throw new Error("Debe existir una carpeta padre.");
  }

  if (parentId !== "root") {
    const parentReference = doc(
      db,
      NODES_COLLECTION,
      parentId
    );

    const parentSnapshot = await getDoc(parentReference);

    if (!parentSnapshot.exists()) {
      throw new Error(
        "La carpeta seleccionada no existe."
      );
    }

    const parentData = parentSnapshot.data();

    if (parentData.type !== "folder") {
      throw new Error(
        "Un archivo no puede contener otros archivos o carpetas."
      );
    }
  }

  return addDoc(
    collection(db, NODES_COLLECTION),
    {
      name: cleanName,
      type,
      parentId,
      createdBy: currentUser.email,
      createdAt: serverTimestamp(),
    }
  );
}

export function subscribeToTreeNodes(
  callback,
  onError
) {
  const nodesQuery = query(
    collection(db, NODES_COLLECTION),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    nodesQuery,
    (snapshot) => {
      const nodes = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

      callback(nodes);
    },
    (error) => {
      console.error(
        "Error consultando el árbol:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}