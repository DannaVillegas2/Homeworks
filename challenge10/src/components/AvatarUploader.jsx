import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AvatarUploader({ user }) {
  const [rutaAvatar, setRutaAvatar] = useState(
    user.user_metadata?.avatar_path || ""
  );

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setRutaAvatar(user.user_metadata?.avatar_path || "");
  }, [user.id, user.user_metadata?.avatar_path]);

  const tiposPermitidos = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const obtenerUrl = () => {
    if (
      !rutaAvatar ||
      !rutaAvatar.startsWith(`${user.id}/`)
    ) {
      return null;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(rutaAvatar);

    return data.publicUrl;
  };

  const subirAvatar = async (archivo) => {
    setError("");
    setMensaje("");

    if (!archivo) return;

    const extension = tiposPermitidos[archivo.type];

    if (!extension) {
      setError("Solo se permiten imágenes JPG, PNG o WebP.");
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setError("La imagen debe pesar máximo 2 MB.");
      return;
    }

    setCargando(true);

    const rutaNueva =
      `${user.id}/${crypto.randomUUID()}.${extension}`;

    try {
      // Subir la imagen al bucket
      const { error: errorSubida } = await supabase.storage
        .from("avatars")
        .upload(rutaNueva, archivo, {
          contentType: archivo.type,
          upsert: false,
        });

      if (errorSubida) throw errorSubida;

      // Guardar su ubicación en el perfil
      const { error: errorPerfil } =
        await supabase.auth.updateUser({
          data: {
            avatar_path: rutaNueva,
          },
        });

      if (errorPerfil) {
        await supabase.storage
          .from("avatars")
          .remove([rutaNueva]);

        throw errorPerfil;
      }

      const rutaAnterior = rutaAvatar;

      setRutaAvatar(rutaNueva);
      setMensaje("Foto de perfil actualizada correctamente.");

      // Eliminar el archivo anterior
      if (
        rutaAnterior &&
        rutaAnterior.startsWith(`${user.id}/`) &&
        rutaAnterior !== rutaNueva
      ) {
        const { error: errorEliminar } =
          await supabase.storage
            .from("avatars")
            .remove([rutaAnterior]);

        if (errorEliminar) {
          setMensaje(
            "Foto actualizada, pero no se pudo borrar la anterior."
          );
        }
      }
    } catch (err) {
      setError(err.message || "Error al subir la imagen.");
    } finally {
      setCargando(false);
    }
  };

  const urlAvatar = obtenerUrl();

  return (
    <div className="avatar-uploader">
      <div className="avatar-row">
        <div className="avatar-preview">
          {urlAvatar ? (
            <img src={urlAvatar} alt="Foto de perfil" />
          ) : (
            <span>
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>

        <label className="avatar-button">
          {cargando ? "Subiendo..." : "Cambiar foto"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={cargando}
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (archivo) subirAvatar(archivo);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {mensaje && <small className="avatar-success">{mensaje}</small>}
      {error && <small className="avatar-error">{error}</small>}
    </div>
  );
}
