import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            console.log('Cart: Adding item to cart:', newItem);
            
            const existingItem = state.items.find((item) => item.productId === newItem._id || item.productId === newItem.productId);
            
            if (existingItem) {
                existingItem.quantity++;
                console.log('Cart: Updated existing item quantity:', existingItem);
            } else {
                const cartItem = {
                    productId: newItem._id || newItem.productId, // Ensure ID mapping is correct
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    vendorId: newItem.vendorId, // Important for backend
                    image: newItem.image,
                    category: newItem.category
                };
                console.log('Cart: Added new item to cart:', cartItem);
                state.items.push(cartItem);
            }
            state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
            console.log('Cart: Updated cart state:', {
                itemsCount: state.items.length,
                totalAmount: state.totalAmount,
                items: state.items
            });
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.productId !== id);
            state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
