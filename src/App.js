import { useState } from 'react'
import './styles.css'

/* const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: true },
  { id: 2, description: "Socks", quantity: 12, packed: false },
]; */

//conditional styling, form submission, lifting state up (to first common parent, child to parent communication, inverse data flow), derived state(computed from existing piece of state or props,using variables instead of state)

export default function App() {
  const [items, setItems] = useState([])

  function handleItems(item) {
    setItems((items) => [...items, item])
  }

  function handleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id))
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    )
  }

  function clearList() {
    const confirmed = window.confirm('Are you sure you want to clear the list?')
    if (confirmed) setItems([])
  }

  return (
    <div className="App ">
      <Logo />
      <Form onAddItems={handleItems} />
      <PackingList
        items={items}
        onDelete={handleDelete}
        onPacked={handleToggleItem}
        onClear={clearList}
      />
      <Footer items={items} />
    </div>
  )
}
function Logo() {
  return <h1>Your Travel List</h1>
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)

  function handleClick(e) {
    e.preventDefault()

    if (!description) return

    const newItems = { description, quantity, packed: false, id: Date.now() }

    onAddItems(newItems)

    setDescription('')
    setQuantity(1)
  }

  return (
    <form className="add-form" onSubmit={handleClick}>
      <h3>What you want to pack?</h3>

      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  )
}

function PackingList({ items, onDelete, onPacked, onClear }) {
  const [sortBy, setSortBy] = useState('input')

  let sortedItems
  if (sortBy === 'input') sortedItems = items
  if (sortBy === 'description')
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description))

  if (sortBy === 'packed')
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed))

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDelete={onDelete}
            onPacked={onPacked}
          />
        ))}
      </ul>
      <div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed items</option>
        </select>
        <button onClick={onClear}>Clear List</button>
      </div>
    </div>
  )
}

function Item({ item, onDelete, onPacked }) {
  return (
    <li>
      <input type="checkbox" onClick={() => onPacked(item.id)} />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDelete(item.id)}>❌</button>
    </li>
  )
}
function Footer({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding something!</em>
      </p>
    )
  const numItems = items.length
  const packedItems = items.filter((item) => item.packed).length
  const packedPercentage = Math.round((packedItems / numItems) * 100)
  return (
    <div>
      <footer className="stats">
        {packedPercentage === 100
          ? "You're ready to go!"
          : `You have ${numItems} items in your list. You have packed ${packedItems} (
        ${packedPercentage}%)`}
      </footer>
    </div>
  )
}
