const API_URL = "https://api.giphy.com/v1/gifs/search";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

// Buscar GIFs utilizando la API de GIPHY
export async function buscarGifs(
  termino,
  {
    limit = 25,
    offset = 0,
    rating = "g",
    lang = "es",
    signal,
  } = {}
) {
  // Validar que exista la API Key
  if (!API_KEY) {
    throw new Error(
      "No se encontró la API Key de GIPHY en el archivo .env"
    );
  }

  // Evitar búsquedas vacías
  const busqueda = termino.trim();

  if (!busqueda) {
    return [];
  }

  // Configurar parámetros de búsqueda
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: busqueda,
    limit: String(limit),
    offset: String(offset),
    rating,
    lang,
  });

  // Realizar solicitud HTTP
  const respuesta = await fetch(
    `${API_URL}?${params.toString()}`,
    { signal }
  );

  // Comprobar errores de la API
  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar GIPHY: ${respuesta.status}`
    );
  }

  // Convertir la respuesta a JSON
  const resultado = await respuesta.json();

  if (!Array.isArray(resultado.data)) {
    throw new Error("GIPHY devolvió una respuesta inesperada.");
  }

  // Devolver los GIFs encontrados
  return resultado.data;
}