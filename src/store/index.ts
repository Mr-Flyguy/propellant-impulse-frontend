import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import filterReducer from './slices/filterSlice';
import propellantsReducer from './slices/propellantsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
    propellants: propellantsReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
