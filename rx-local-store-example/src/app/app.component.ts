import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStore} from 'rx-local-store';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  name$: Observable<string>;
  nameStore: LocalStore<{ name: string }>;

  constructor() {
  }

  ngOnInit(): void {
    this.nameStore = new NameStore({name: 'default name (auto update after 5 seconds)'});
    this.name$ = this.nameStore.select$((data) => data.name);

    setTimeout(() => {
      this.nameStore.update((data) => ({name: data.name.toUpperCase()}));
    }, 5000);
  }

  updateName(): void {
    const sub = new Subject<string>();
    const obs: Observable<string> = sub.asObservable();

    this.nameStore.switchUpdate(obs, (data: string) => ({name: data}));
    sub.next('updated name');
  }

  removeName(): void {
    this.nameStore.update({name: ''});
  }

  ngOnDestroy(): void {
    this.nameStore.destroy();
  }
}

class NameStore extends LocalStore<{ name: string }> {
  constructor(init: { name: string }) {
    super(init);
  }
}
