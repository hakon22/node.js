export type InitialStateType = {
  loadingStatus: 'idle' | 'loading' | 'finish' | 'failed';
  error: string | null | undefined;
  [key: string]: string | null | undefined;
}
