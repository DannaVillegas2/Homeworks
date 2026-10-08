import MenuItem from "./menuItem";
import { arbolMenu } from "../data/menuData";

function Sidebar() {
  const raiz = arbolMenu.obtenerRaiz();

  return (
    <aside className="sidebar">
      <h2>{raiz.titulo}</h2>

      <ul className="menu">
        {raiz.hijos.map((nodo, index) => (
          <MenuItem
            key={`${nodo.titulo}-${index}`}
            nodo={nodo}
          />
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;