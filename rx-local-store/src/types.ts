export type SnapshotState<T> = Readonly<T>;
export type UpdateStateCallback<State, NewState extends Partial<State> = Partial<State>> = (value: Readonly<State>) => NewState;
export type MapFunction<T, R> = (value: Readonly<T>) => R;
