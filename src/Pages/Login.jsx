import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../Hooks/useAuth';
import {supabaseConfigurado} from '../Services/supabase';

export default function Login(){
  const [modo,setModo]=useState('entrar');const [email,setEmail]=useState('');const [password,setPassword]=useState('');
  const [mensaje,setMensaje]=useState('');const [enviando,setEnviando]=useState(false);
  const {usuario,entrar,registrar,salir}=useAuth();const navegar=useNavigate();
  const guardar=async e=>{e.preventDefault();setEnviando(true);setMensaje('');try{
  
    if(modo==='registro'){await registrar(email,password);setMensaje('Registro solicitado. Revisa tu correo si Supabase pide confirmación.');}
    else {await entrar(email,password);navegar('/cotizaciones');}
 
  }catch(err){setMensaje(err.message||'No fue posible completar la operación.');}finally{setEnviando(false);}};
  return <main className="login-pagina">
    <div className="login-tarjeta">
      {usuario?<><h1>Mi cuenta</h1><p>Sesión iniciada: {usuario.email}</p><Link to="/cotizaciones" className="boton-verde">Mis cotizaciones</Link><button className="boton-secundario" onClick={salir}>Cerrar sesión</button></>:<>
        <h1>{modo==='registro'?'Crear cuenta':'Iniciar sesión'}</h1><p className="login-subtitulo">Bienvenido a Distribuidor Eléctrico de Cali</p>
        <form onSubmit={guardar} className="login-form"><label>Correo electrónico<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com"/></label>
          <label>Contraseña<input type="password" minLength={6} required autoComplete={modo==='registro'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>
          <button className="boton-verde" disabled={!supabaseConfigurado||enviando}>{enviando?'Procesando…':modo==='registro'?'Registrarme':'Ingresar'}</button>
        </form>
        <p className="login-enlace">{modo==='registro'?'¿Ya tienes cuenta?':'¿No tienes cuenta?'} <button className="boton-enlace" onClick={()=>{setModo(modo==='registro'?'entrar':'registro');setMensaje('');}}>{modo==='registro'?'Inicia sesión':'Regístrate aquí'}</button></p>
        {!supabaseConfigurado&&<p className="aviso-config">Para activar el acceso real, configura las variables de Supabase en <code>.env.local</code>. El diseño ya está listo.</p>}
        {mensaje&&<p role="status" className="mensaje-formulario">{mensaje}</p>}
      </>}
    </div>
  </main>;
}
