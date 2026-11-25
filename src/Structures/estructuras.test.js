import {
  describe,
  it,
  expect
} from 'vitest';

import { Pila } from './Pila';
import { Cola } from './Cola';
import { Trie } from './Trie';
import { HeapMaximo } from './Heap';
import { Grafo } from './Grafo';

import {
  buscarConTrie,
  masConsultados
} from '../Helpers/busqueda';

// PRUEBAS - PILA

describe('1. Pila - Carrito de compras', () => {
  it('debe funcionar con orden LIFO', () => {
    const pila = new Pila();

    pila.apilar('Primer cambio');
    pila.apilar('Segundo cambio');
    pila.apilar('Tercer cambio');

    expect(pila.desapilar())
      .toBe('Tercer cambio');

    expect(pila.desapilar())
      .toBe('Segundo cambio');

    expect(pila.desapilar())
      .toBe('Primer cambio');

    expect(pila.vacia).toBe(true);
  });

  it('debe conservar una copia del carrito', () => {
    const pila = new Pila();

    const carrito = [
      {
        id: 'panel-led',
        cantidad: 1
      }
    ];

    pila.apilar(carrito);

    carrito[0].cantidad = 5;

    expect(pila.desapilar()).toEqual([
      {
        id: 'panel-led',
        cantidad: 1
      }
    ]);
  });
});

// PRUEBAS - COLA

describe('2. Cola - Solicitudes de cotización', () => {
  it('debe funcionar con orden FIFO', () => {
    const cola = new Cola();

    cola.encolar('Cotización A');
    cola.encolar('Cotización B');
    cola.encolar('Cotización C');

    expect(cola.desencolar())
      .toBe('Cotización A');

    expect(cola.desencolar())
      .toBe('Cotización B');

    expect(cola.desencolar())
      .toBe('Cotización C');
  });

  it('debe permitir consultar la primera solicitud', () => {
    const cola = new Cola();

    cola.encolar('Solicitud 001');
    cola.encolar('Solicitud 002');

    expect(cola.primero())
      .toBe('Solicitud 001');

    expect(cola.longitud).toBe(2);
  });
});

// PRUEBAS - TRIE

describe('3. Trie - Búsqueda de productos', () => {
  it('debe encontrar productos por prefijo', () => {
    const trie = new Trie();

    trie.insertar(
      'CABLE DÚPLEX CENTELSA',
      'cable-001'
    );

    trie.insertar(
      'PANEL LED 18W',
      'panel-001'
    );

    expect(
      trie.buscarPrefijo('cab')
    ).toContain('cable-001');

    expect(
      trie.buscarPrefijo('pan')
    ).toContain('panel-001');
  });

  it('debe normalizar palabras con tildes', () => {
    const trie = new Trie();

    trie.insertar(
      'CABLE DÚPLEX',
      'cable-002'
    );

    expect(
      trie.buscarPrefijo('dupl')
    ).toContain('cable-002');
  });

  it('debe integrar la búsqueda con el catálogo', () => {
    const productos = [
      {
        id: 'p1',
        nombre: 'PANEL LED 18W',
        marca: 'Mercury',
        categoria: 'Iluminación'
      },
      {
        id: 'p2',
        nombre: 'CABLE DÚPLEX',
        marca: 'Centelsa',
        categoria: 'Cables'
      }
    ];

    const resultado = buscarConTrie(
      productos,
      'panel'
    );

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('p1');
  });
});

// PRUEBAS - HEAP MÁXIMO

describe('4. Heap - Productos más consultados', () => {
  it('debe extraer primero la mayor prioridad', () => {
    const heap = new HeapMaximo();

    heap.insertar('Producto A', 10);
    heap.insertar('Producto B', 30);
    heap.insertar('Producto C', 20);

    expect(heap.extraer())
      .toBe('Producto B');

    expect(heap.extraer())
      .toBe('Producto C');

    expect(heap.extraer())
      .toBe('Producto A');
  });

  it('debe ordenar los productos por consultas', () => {
    const productos = [
      {
        id: 'p1',
        nombre: 'Panel LED',
        destacado: false
      },
      {
        id: 'p2',
        nombre: 'Cable',
        destacado: false
      },
      {
        id: 'p3',
        nombre: 'Reflector',
        destacado: false
      }
    ];

    const visitas = {
      p1: 2,
      p2: 8,
      p3: 5
    };

    const resultado = masConsultados(
      productos,
      visitas,
      3
    );

    expect(
      resultado.map((p) => p.id)
    ).toEqual([
      'p2',
      'p3',
      'p1'
    ]);
  });
});

// PRUEBAS - GRAFO

describe('5. Grafo - Productos relacionados', () => {
  it('debe conectar productos relacionados', () => {
    const grafo = new Grafo();

    grafo.conectar(
      'panel-led',
      'cable'
    );

    grafo.conectar(
      'cable',
      'tuberia'
    );

    const relacionados = grafo.relacionados(
      'panel-led',
      2
    );

    expect(relacionados).toContain('cable');
    expect(relacionados).toContain('tuberia');
  });

  it('debe evitar recomendar el mismo producto', () => {
    const grafo = new Grafo();

    grafo.conectar('panel', 'reflector');
    grafo.conectar('panel', 'cinta-led');

    const relacionados = grafo.relacionados(
      'panel',
      3
    );

    expect(relacionados).not.toContain('panel');

    expect(
      new Set(relacionados).size
    ).toBe(relacionados.length);
  });
});