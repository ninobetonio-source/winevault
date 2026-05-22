import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wv_cart') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('wv_cart', JSON.stringify(items)) }, [items])

  function add(item, qty = 1) {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + qty } : p)
      return [...prev, { ...item, qty }]
    })
  }
  function remove(id) { setItems(prev => prev.filter(p => p.id !== id)) }
  function update(id, qty) { setItems(prev => prev.map(p => p.id === id ? { ...p, qty } : p)) }
  function clear() { setItems([]) }

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
