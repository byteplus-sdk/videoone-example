import type { ActionType, StateType } from 'typesafe-actions';

export type RootAction = ActionType<typeof import('./actions').default>;
export type RootState = StateType<typeof import('./reducers').default>;

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}
