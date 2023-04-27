import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const index = state.items.findIndex((i) => i.id === item.id);

      if (index >= 0) {
        state.items[index].quantity += item.quantity;
      } else {
        state.items.push({ ...item, quantity: item.quantity });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((i) => i.id === id);
      if (index >= 0) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity--;
        } else {
          state.items.splice(index, 1);
        }
      }
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((i) => i.id === id);
      if (index >= 0) {
        state.items[index].quantity++;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
