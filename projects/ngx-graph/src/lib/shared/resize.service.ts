import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, fromEvent, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResizeService implements OnInit, OnDestroy {
  resize$: Observable<Event>;
  resizeSub$: Subscription;

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable().pipe(share());
  }

  private resizeSubject: Subject<Window>;

  constructor() {
    this.resizeSubject = new Subject();
  }

  ngOnInit(): void {
    this.resize$ = fromEvent(window, 'resize');
    this.resizeSub$ = this.resize$.subscribe({
      next: (ev) => this.onResize(ev)
    });
  }

  ngOnDestroy(): void {
    this.resizeSub$.unsubscribe();
  }

  private onResize(event: Event) {
    this.resizeSubject.next(event.target as Window);
  }
}
