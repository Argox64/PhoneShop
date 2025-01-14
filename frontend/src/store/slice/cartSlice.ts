import { CartItem } from '@/types/CartItem';
import { createSlice } from '@reduxjs/toolkit';

export interface CartState {
    items: CartItem[];
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [] } as CartState,
    reducers: {
        addItemToCart: (state, action: { payload: CartItem, type: string }) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
        },
        removeItemFromCart: (state, action: { payload: number, type: string }) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        updateItemQuantity: (state, action: { payload: { id: number, quantity: number }, type: string }) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = cartSlice.actions;