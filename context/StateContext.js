import React, {createContext, useContext, useState, useEffect} from "react";
import {toast} from "react-hot-toast";

const Context = createContext()

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [quantity, setQuantity] = useState(1)

    let foundProduct;

    const onAddToCart = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id)

        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct, quantity : cartProduct.quantity + quantity
                    }
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, product])
        }
        toast.success(`${quantity} ${product.name} added to the cart.`, {duration : 2000})
    }

    const onRemove = (id) => {
        const removingProduct = cartItems.find(product => product._id === id)
        setCartItems(cartItems.filter(product => product._id !== id))
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - removingProduct.quantity)
        setTotalPrice(prevTotalPrice => prevTotalPrice - removingProduct.quantity * removingProduct.price)
    }

    const toggleCartItemsQuantity = (id, value) => {
        foundProduct = cartItems.find(product => product._id === id)

        if (value === 'inc') {
            setCartItems(cartItems.map(product => product._id === id ? {...product, quantity : product.quantity + 1} : product))
            setTotalPrice(prevTotalPrice => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems(cartItems.map(product => product._id === id ? {...product, quantity : product.quantity - 1} : product))
                setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const incQuantity = () => setQuantity(prev => prev + 1)
    const decQuantity = () => setQuantity(prev => {
        if (prev - 1 < 1) return 1
        return prev - 1
    })


    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                quantity,
                incQuantity,
                decQuantity,
                onAddToCart,
                setShowCart,
                toggleCartItemsQuantity,
                onRemove,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)