import { Observable } from 'rxjs';
import { MapFunction, UpdateStateCallback } from "./types";
export declare class LocalStore<T> {
    private state;
    private currentStateValue;
    constructor(initState: Partial<T>);
    state$(): Observable<Readonly<T>>;
    update(newState: Partial<T>): void;
    update(statCallback: UpdateStateCallback<T>): void;
    switchUpdate<S>(switchStore: Observable<S>, fn: (value: S) => T): void;
    select$<R>(fn: MapFunction<T, R>): Observable<R>;
    destroy(): void;
    private _createStore;
    private _getSelectObs$;
    private _update;
    private _updateCurrentValue;
    private _state$;
}
