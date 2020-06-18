import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'bright' | 'dark';

const key = 'ngx-graph-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme: BehaviorSubject<Theme>;
  body: HTMLBodyElement;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.body = this.document.querySelector('body');
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, 'bright');
    }

    this.theme = new BehaviorSubject<Theme>(this.getTheme);
  }

  get getTheme(): Theme {
    return localStorage.getItem(key) as Theme;
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(key, theme);
    this.theme.next(this.getTheme);
    if (theme === 'bright') {
      this.body.classList.remove('is-dark');
    } else {
      this.body.classList.add('is-dark');
    }
  }
}
