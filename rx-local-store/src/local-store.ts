import {
    BehaviorSubject,
    Observable,
    Subject,
} from 'rxjs';
import {
    distinctUntilChanged,
    map,
} from 'rxjs/operators';
import {MapFunction, SnapshotState, UpdateStateCallback} from "./types";

export class LocalStore<T> {
    private state: { stateSub: Subject<T>; stateObs$: Observable<Readonly<T>>; };
    private snapshotState: SnapshotState<T>;

    constructor(initState: Partial<T>) {
        this._createStore(initState);
    }

    state$(): Observable<Readonly<T>> {
        return this._state$();
    }

    update(newState: Partial<T>): void;
    update(statCallback: UpdateStateCallback<T>): void;
    update(newStateOrStateCallback: Partial<T> | UpdateStateCallback<T>): void {
        if (typeof newStateOrStateCallback === 'function') {
            const newState = (newStateOrStateCallback as UpdateStateCallback<T>)(this.snapshotState);
            this._update(newState as T);
        } else {
            this._update(newStateOrStateCallback as T);
        }
    }

    switchUpdate<S>(switchStore: Observable<S>, fn: (value: S) => T): void {
        switchStore.pipe(map(fn)).subscribe((newState: T) => {
            this._update(newState);
        });
    }

    select$<R>(fn: MapFunction<T, R>): Observable<R> {
        return this._getSelectObs$(fn);
    }

    destroy(): void {
        this.state = {} as any;
    }

    private _createStore(initState: Partial<T>): void {
        const sub: BehaviorSubject<T> = new BehaviorSubject<T>(initState as T);
        const obs$: Observable<T> = sub.asObservable();

        this._updateSnapshotState(initState as T);
        this.state = ({stateSub: sub, stateObs$: obs$});
    }

    private _getSelectObs$<R>(fn: MapFunction<T, R>): Observable<R> {
        return this.state.stateObs$.pipe(
            distinctUntilChanged(),
            map((value: T) => fn(value)),
        );
    }

    private _update(newState: T): void {
        this._updateSnapshotState(newState);
        this.state.stateSub.next(newState);
    }

    private _updateSnapshotState(newState: T): void {
        this.snapshotState = newState;
    }

    private _state$(): Observable<T> {
        return this.state.stateObs$;
    }
}
