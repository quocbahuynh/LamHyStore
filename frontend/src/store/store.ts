import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import cartReducer from "../slices/cartSlice";
import gomOrderReducer from "../slices/gomOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import adminAuthReducer from "../slices/adminAuthSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "adminauth"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  adminauth: adminAuthReducer,
  gomOrder: gomOrderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Keep store instance reusable
const storeInstance = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export a function but return the instance
export const store = () => storeInstance;

export const persistor = persistStore(storeInstance);

export type StoreType = ReturnType<typeof store>;
export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useCart = () =>
  useSelector((state: RootState) => state.cart.items);
export const useGomOrderCart = () =>
  useSelector((state: RootState) => state.gomOrder.items);
