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
    this.nameStore.update({name: 'minyeoung seo'});
  }

  ngOnDestroy(): void {
    this.nameStore.destroy();
  }
}

/**
 * Store를 생성함
 * 생성자를 통해서 초기 값을 설정
 * 그리고 extends를 통해서 타입을 선언함
 */

type LocalStoreType = { name: string };

class NameStore extends LocalStore<LocalStoreType> {
  constructor(init: LocalStoreType) {
    super(init);
  }
}
