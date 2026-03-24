import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, restaurantId } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id,
          name,
          price,
          restaurantId,
          quantity: 1,
        });
      }

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        const item = state.items.find((item) => item.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      }

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },

    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalPrice = action.payload.totalPrice || 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
