
import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ControlCantidad({
  cantidad,
  onCambiar
}) {
  const [texto, setTexto] = useState(String(cantidad));

  useEffect(() => {
    setTexto(String(cantidad));
  }, [cantidad]);

  const normalizar = (valor) => {
    const numero = Number.parseInt(valor, 10);

    if (!Number.isFinite(numero)) return 1;

    return Math.max(1, Math.min(99, numero));
  };

  const confirmarCantidad = () => {
    const nuevaCantidad = normalizar(texto);

    setTexto(String(nuevaCantidad));

    if (nuevaCantidad !== cantidad) {
      onCambiar(nuevaCantidad);
    }
  };

  const ajustarCantidad = (cambio) => {
    const nuevaCantidad = normalizar(
      normalizar(texto) + cambio
    );

    setTexto(String(nuevaCantidad));

    if (nuevaCantidad !== cantidad) {
      onCambiar(nuevaCantidad);
    }
  };

  return (
    <div className="control-cantidad">

      <button
        type="button"
        aria-label="Reducir cantidad"
        onClick={() => ajustarCantidad(-1)}
      >
        <Minus size={15} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Cantidad de productos"
        value={texto}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const valor = e.target.value;

          if (/^\d{0,2}$/.test(valor)) {
            setTexto(valor);
          }
        }}
        onBlur={confirmarCantidad}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />

      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => ajustarCantidad(1)}
      >
        <Plus size={15} />
      </button>

    </div>
  );
}
