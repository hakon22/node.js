import axios from 'axios';
import {
  createSlice, createEntityAdapter, createAsyncThunk, PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { User } from '../types/User';
import routes from '../routes';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get(routes.allUsers);
    return response.data;
  },
);

const userAdapter = createEntityAdapter<User>();

type InitialStateType = {
  loadingStatus: 'idle' | 'loading' | 'finish' | 'failed';
  error: string | null | undefined;
  [key: string]: string | null | undefined;
};

const initialState: InitialStateType = {
  loadingStatus: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState: userAdapter.getInitialState(initialState),
  reducers: {
    userAdd: userAdapter.addOne,
    userRemove: userAdapter.removeOne,
    userUpdate: userAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }:
        PayloadAction<{ code: number, users: User[] }>) => {
        if (payload.code === 1) {
          userAdapter.addMany(state, payload.users);
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { userAdd, userRemove, userUpdate } = userSlice.actions;

export const selectors = userAdapter.getSelectors<RootState>((state) => state.users);

export default userSlice.reducer;
