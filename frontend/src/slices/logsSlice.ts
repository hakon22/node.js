import axios from 'axios';
import {
  createSlice, createEntityAdapter, createAsyncThunk, PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Log } from '../types/Log';
import type { InitialStateType } from '../types/InitialState';
import routes from '../routes';

export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async () => {
    const response = await axios.get(`http://localhost:3006${routes.allLogs}`);
    // const response = await axios.get(routes.allLogs);
    return response.data;
  },
);

const logsAdapter = createEntityAdapter<Log>();

const initialState: InitialStateType = {
  loadingStatus: 'idle',
  error: null,
};

const logsSlice = createSlice({
  name: 'users',
  initialState: logsAdapter.getInitialState(initialState),
  reducers: {
    logAdd: logsAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, { payload }:
        PayloadAction<{ code: number, logs: Log[] }>) => {
        if (payload.code === 1) {
          logsAdapter.addMany(state, payload.logs);
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logAdd } = logsSlice.actions;

export const selectors = logsAdapter.getSelectors<RootState>((state) => state.logs);

export default logsSlice.reducer;
