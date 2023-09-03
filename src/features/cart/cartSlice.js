import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // cart:[],
  cart: [
    {
      pizzaId: 12,
      name: "Margaritta",
      quantity: 2,
      unitPrice: 12,
      totalPrice: 24,
    },
  ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      //payload= newItem
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      //payload=pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      //payload= pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      //payload= pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    cleareCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  deleteItem,
  cleareCart,
} = cartSlice.actions;
export default cartSlice.reducer;
