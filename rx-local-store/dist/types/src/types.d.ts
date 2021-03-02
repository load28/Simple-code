export declare type SnapshotState<T> = Readonly<T>;
export declare type UpdateStateCallback<State, NewState extends Partial<State> = Partial<State>> = (value: Readonly<State>) => NewState;
export declare type MapFunction<T, R> = (value: Readonly<T>) => R;
