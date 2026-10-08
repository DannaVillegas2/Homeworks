import { useState } from 'react'
import Tree from 'react-d3-tree'
import BinarySearchTree from './structures/BinarySearchTree'
import './App.css'

function createTree(numbers) {
  const tree = new BinarySearchTree()

  numbers.forEach((number) => {
    tree.insert(number)
  })

  return tree
}

function App() {
  const [numbersInput, setNumbersInput] = useState(
    '50, 30, 70, 20, 40, 60, 80'
  )

  const [tree, setTree] = useState(() =>
    createTree([50, 30, 70, 20, 40, 60, 80])
  )

  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const buildTree = () => {
    const numbers = numbersInput
      .split(',')
      .map((number) => Number(number.trim()))
      .filter((number) => !Number.isNaN(number))

    if (numbers.length === 0) {
      alert('Introduce al menos un número válido.')
      return
    }

    const newTree = createTree(numbers)

    setTree(newTree)
    setSearchResult(null)

    console.clear()
    console.log('Árbol creado con:', numbers)
    console.log('Inorden:', newTree.inOrder())
    console.log('Preorden:', newTree.preOrder())
    console.log('Postorden:', newTree.postOrder())
  }

  const searchNumber = () => {
    const number = Number(searchValue)

    if (searchValue.trim() === '' || Number.isNaN(number)) {
      setSearchResult(null)
      return
    }

    const exists = tree.contains(number)

    setSearchResult(exists)

    console.log(
      `¿El valor ${number} está en el árbol?`,
      exists ? 'Sí' : 'No'
    )
  }

  const treeData = tree.toD3Data()

  return (
    <main className="app">
      <h1>Challenge 8</h1>

      <p className="subtitle">
        Árbol Binario de Búsqueda
      </p>

      <section className="card">
        <h2>Crear árbol</h2>

        <label htmlFor="numbers">
          Introduce números separados por comas:
        </label>

        <div className="input-group">
          <input
            id="numbers"
            type="text"
            value={numbersInput}
            onChange={(event) => setNumbersInput(event.target.value)}
            placeholder="50, 30, 70, 20, 40"
          />

          <button onClick={buildTree}>
            Crear árbol
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Recorridos</h2>

        <div className="traversals">
          <div>
            <strong>Inorden</strong>
            <p>{tree.inOrder().join(' → ')}</p>
          </div>

          <div>
            <strong>Preorden</strong>
            <p>{tree.preOrder().join(' → ')}</p>
          </div>

          <div>
            <strong>Postorden</strong>
            <p>{tree.postOrder().join(' → ')}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Buscar valor</h2>

        <div className="input-group">
          <input
            type="number"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Número a buscar"
          />

          <button onClick={searchNumber}>
            Buscar
          </button>
        </div>

        {searchResult !== null && (
          <p
            className={
              searchResult
                ? 'result found'
                : 'result not-found'
            }
          >
            {searchResult
              ? `El número ${searchValue} está en el árbol.`
              : `El número ${searchValue} no está en el árbol.`}
          </p>
        )}
      </section>

      <section className="card tree-section">
        <h2>Visualización del árbol</h2>

        <div className="tree-container">
          {treeData && (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 450, y: 70 }}
              pathFunc="straight"
              collapsible={false}
              separation={{
                siblings: 1.5,
                nonSiblings: 2,
              }}
            />
          )}
        </div>
      </section>
    </main>
  )
}

export default App