import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import logReducer from './logsSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    logs: logReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
