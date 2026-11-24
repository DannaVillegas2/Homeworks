import {useContext} from 'react';
import {TiendaContext} from '../Context/tienda-store';
export const useTienda=()=>useContext(TiendaContext);
