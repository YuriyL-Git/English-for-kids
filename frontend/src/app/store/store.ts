import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu-slice';
import appReducer from '../features/app-slice';
import serverReducer from '../features/server-slice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    app: appReducer,
    server: serverReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppSubscribe = typeof store.subscribe;
export type RootState = ReturnType<typeof store.getState>;
