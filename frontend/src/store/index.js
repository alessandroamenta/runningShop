import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const localStorageKey = "reduxState";

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(localStorageKey);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(localStorageKey, serializedState);
  } catch (err) {
    console.log(err);
  }
};

const preloadedState = loadFromLocalStorage();

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
