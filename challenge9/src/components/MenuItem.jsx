import { NavLink } from "react-router-dom";

function MenuItem({ nodo }) {
  return (
    <li>
      <NavLink
        to={nodo.link}
        className={({ isActive }) =>
          isActive ? "menu-link active" : "menu-link"
        }
      >
        {nodo.titulo}
      </NavLink>

      {nodo.hijos.length > 0 && (
        <ul className="submenu">
          {nodo.hijos.map((hijo, index) => (
            <MenuItem
              key={`${hijo.titulo}-${index}`}
              nodo={hijo}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default MenuItem;