import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Trie, MaxHeap, Grafo } from './estructuras.js';
import { iniciales, enlaces } from './catalogo.js';
import './panel.scss';

function Panel() {
  const [canciones, guardar] = useState(iniciales);
  const [relaciones, vincular] = useState(enlaces);
  const [actual, seleccionar] = useState(iniciales[0].titulo);
  const [busqueda, buscar] = useState('');
  const [aviso, informar] = useState('');

  const trie = useMemo(() => {
    const indice = new Trie();
    canciones.forEach(c => indice.insertar(c.titulo));
    return indice;
  }, [canciones]);
  const top = useMemo(() => {
    const heap = new MaxHeap();
    canciones.forEach(c => heap.insertar(c));
    return Array.from({ length: Math.min(5, canciones.length) }, () => heap.extraerMaximo());
  }, [canciones]);
  const grafo = useMemo(() => {
    const red = new Grafo();
    canciones.forEach(c => red.agregar(c.titulo));
    relaciones.forEach(([a, b]) => red.conectar(a, b));
    return red;
  }, [canciones, relaciones]);

  const elegida = canciones.find(c => c.titulo === actual);
  const sugerencias = trie.sugerencias(busqueda);
  const relacionadas = grafo.relacionadas(actual);

  function agregar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const titulo = datos.get('titulo').trim();
    const artista = datos.get('artista').trim();
    if (!titulo || !artista) return informar('Escribe un título y un artista.');
    if (trie.existe(titulo)) return informar('Ese título ya está en el catálogo.');
    guardar(lista => [...lista, { titulo, artista, escuchas: 0 }]);
    const similar = datos.get('similar');
    if (similar) vincular(lista => [...lista, [titulo, similar]]);
    seleccionar(titulo);
    buscar('');
    informar('Se agregó «' + titulo + '» al catálogo.');
    formulario.reset();
  }

  return <main>
    <header><span className="marca">◉ Frecuencia</span><span>Panel musical</span></header>
    <section className="hero"><div><h1>Radar musical</h1><p>Explora el catálogo y descubre qué canciones lideran el ranking.</p></div>
      <div className="disco" aria-hidden="true"/></section>
    <div className="columnas">
      <section className="tarjeta"><h2>Las más escuchadas</h2><p>Top 5 del catálogo</p>
        <ol>{top.map(c => <li key={c.titulo}><button className="fila" onClick={() => seleccionar(c.titulo)}>
          <span><strong>{c.titulo}</strong><small>{c.artista}</small></span><span>{c.escuchas} escuchas</span>
        </button></li>)}</ol></section>
      <section className="tarjeta"><h2>Buscar canción</h2>
        <label>Título o prefijo<input type="search" value={busqueda} onChange={e => buscar(e.target.value)} placeholder="Ej. Cali"/></label>
        {busqueda.trim() && <p role="status">{trie.existe(busqueda) ? 'El título existe en el catálogo.' : sugerencias.length ? 'Coincidencias por prefijo.' : 'Sin coincidencias.'}</p>}
        <div className="opciones">{sugerencias.map(t => <button key={t} onClick={() => seleccionar(t)} aria-pressed={t === actual}>{t}</button>)}</div></section>
      <section className="tarjeta detalle"><h2>{actual}</h2><p>{elegida.artista} · {elegida.escuchas} escuchas</p>
        <button className="accion" onClick={() => guardar(lista => lista.map(c => c.titulo === actual ? {...c, escuchas: c.escuchas + 1} : c))}>Registrar escucha</button>
        <h3>Canciones relacionadas</h3><div className="opciones">{relacionadas.length ? relacionadas.map(t => <button key={t} onClick={() => seleccionar(t)}>{t}</button>) : <p>Esta canción aún no tiene conexiones.</p>}</div></section>
      <section className="tarjeta"><h2>Agregar canción</h2><form onSubmit={agregar}>
        <label>Título<input name="titulo" required maxLength="100"/></label>
        <label>Artista<input name="artista" required maxLength="100"/></label>
        <label>Canción relacionada<select name="similar"><option value="">Sin conexión inicial</option>{canciones.map(c => <option key={c.titulo}>{c.titulo}</option>)}</select></label>
        <button className="accion">Agregar al catálogo</button></form><p role="status">{aviso}</p></section>
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<Panel/>);
