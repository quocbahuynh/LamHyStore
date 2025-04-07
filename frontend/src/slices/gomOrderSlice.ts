import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface CartGomOrderItem {
  id: string;
  code: string;
  quantity: number;
  basePrice: number;
  image: string;
  name: string;
}

export interface CartGomOrderState {
  items: CartGomOrderItem[];
}

const initialState: CartGomOrderState = {
  items: [],
};

const gomOrderSlice = createSlice({
  name: "gomOrder",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        id: string;
        code: string;
        quantity: number;
        basePrice: number;
        image: string;
        name: string;
      }>,
    ) => {
      const { id, quantity, code, basePrice, image, name } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, code, quantity, image, basePrice, name });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateProductInfo: (
      state,
      action: PayloadAction<{
        id: string;
        code: string;
        basePrice: number;
        image: string;
        name: string;
      }>,
    ) => {
      const { id, code, basePrice, image, name } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.basePrice = basePrice;
        item.image = image;
        item.name = name;
        item.code = code;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Selector to get all cart items
export const selectGomOrderCartItems = (state: RootState) =>
  state.gomOrder.items;

// Selector to calculate the total quantity of items in the cart
export const selectGomOrderCartQuantity = (state: RootState): number =>
  state.gomOrder.items.reduce(
    (total: any, item: any) => total + item.quantity,
    0,
  );

// Selector to calculate the total price of items in the cart
export const selectGomCartTotal = (state: RootState): number =>
  state.gomOrder.items.reduce(
    (total: any, item: any) => total + item.basePrice * item.quantity,
    0,
  );

export const {
  addItem,
  removeItem,
  updateQuantity,
  updateProductInfo,
  clearCart,
} = gomOrderSlice.actions;
export default gomOrderSlice.reducer;
