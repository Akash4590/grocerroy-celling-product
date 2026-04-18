import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/api'

const CartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  syncing: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':   return { ...state, loading: action.payload }
    case 'SET_SYNCING':   return { ...state, syncing: action.payload }
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
        loading: false,
        syncing: false,
      }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const fetchCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { data } = await getCart()
      if (data.success) dispatch({ type: 'SET_CART', payload: data.data })
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (product, quantity = 1) => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true })
      const { data } = await addToCart(product._id, quantity)
      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data })
        toast.success(`${product.name} added to cart! 🛒`, { id: product._id })
      }
    } catch (err) {
      dispatch({ type: 'SET_SYNCING', payload: false })
      toast.error(err?.response?.data?.error || 'Failed to add item')
    }
  }

  const updateItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true })
      const { data } = await updateCartItem(productId, quantity)
      if (data.success) dispatch({ type: 'SET_CART', payload: data.data })
    } catch (err) {
      dispatch({ type: 'SET_SYNCING', payload: false })
      toast.error(err?.response?.data?.error || 'Failed to update item')
    }
  }

  const removeItem = async (productId, name) => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true })
      const { data } = await removeFromCart(productId)
      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data })
        toast.success(`${name || 'Item'} removed from cart`)
      }
    } catch (err) {
      dispatch({ type: 'SET_SYNCING', payload: false })
      toast.error('Failed to remove item')
    }
  }

  const emptyCart = async () => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true })
      const { data } = await clearCart()
      if (data.success) dispatch({ type: 'SET_CART', payload: data.data })
    } catch {
      dispatch({ type: 'SET_SYNCING', payload: false })
    }
  }

  const isInCart = (productId) => state.items.some(i => i.product === productId || i.product?._id === productId)
  const getQty = (productId) => {
    const item = state.items.find(i => i.product === productId || i.product?._id === productId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider value={{ ...state, addItem, updateItem, removeItem, emptyCart, fetchCart, isInCart, getQty }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
