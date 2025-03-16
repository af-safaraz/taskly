import { configureStore } from "@reduxjs/toolkit";
import navbarMenuReducer from "./slices/navbarMenuSlice";
import tasksReducer from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    navbarMenu: navbarMenuReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
