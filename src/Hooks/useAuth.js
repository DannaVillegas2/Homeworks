import {useContext} from 'react';
import {AuthContext} from '../Context/auth-store';
export const useAuth=()=>useContext(AuthContext);
