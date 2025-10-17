import { createContext, useReducer, useState } from "react";

export const CartContext = createContext()

const initialState = []
const reducer = (state, action) => {
    const {type: actionType, payload: actionPayload} = action
    switch (actionType){
        case "ADD_TO_CARD": {
            const { id } = actionPayload
            const productInCartIndex = state.findIndex(item => item.id === id)

            if(productInCartIndex >= 0){
            const newState = structuredClone(state)
            newState[productInCartIndex].quantity +=1
            return newState
        }
        return [
            ...state,
            {
                ...actionPayload,
                quantity: 1
            }
        ]
        }
        case "REMOVE_FROM_CART": {
            const {id} = actionPayload
            return state.filter(item => item.id !== id)
        }
        case "CLEAR_CART": {
            return initialState
        }
    }
    return state
}

export function CartProvider({ children }){
   const [state, dispartch] = useReducer(reducer, initialState)

   const addToCart = product => dispartch( {
    type: "ADD_TO_CARD",
    payload: product
   })

   
   const removeFromCart = product => dispartch( {
    type: "REMOVE_FROM_CART",
    payload: product
   })

   
   const clearCart = product => dispartch( {
    type: "CLEAR_CART"
   })

    return (
        <CartContext.Provider value={{
            cart: state,
            addToCart,
            removeFromCart,
            clearCart
        }}
        >
        {children}   
        </CartContext.Provider>
    )
}