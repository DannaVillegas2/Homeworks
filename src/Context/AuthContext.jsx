import {useEffect,useMemo,useState} from 'react';
import {supabase} from '../Services/supabase';
import {AuthContext} from './auth-store';
export function AuthProvider({children}){
  const [usuario,setUsuario]=useState(null);
  const [cargando,setCargando]=useState(Boolean(supabase));
  useEffect(()=>{
    if(!supabase)return;
    let montado=true;
    supabase.auth.getUser().then(({data})=>{if(montado){setUsuario(data.user??null);setCargando(false);}}).catch(()=>{if(montado)setCargando(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_evento,sesion)=>setUsuario(sesion?.user??null));
    return()=>{montado=false;subscription.unsubscribe();};
  },[]);
  const valor=useMemo(()=>({usuario,cargando,esAdmin:usuario?.app_metadata?.role==='admin',
    entrar:async(email,password)=>{if(!supabase)throw new Error('Configura Supabase en .env.local.');
      const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;},
    registrar:async(email,password)=>{if(!supabase)throw new Error('Configura Supabase en .env.local.');
      const {error}=await supabase.auth.signUp({email,password});if(error)throw error;},
    salir:async()=>{if(supabase)await supabase.auth.signOut();}
  }),[usuario,cargando]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
