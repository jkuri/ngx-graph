import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../../providers/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  isDark: boolean;

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    this.setTheme();
  }

  setTheme(): void {
    this.themeService.setTheme(this.isDark ? 'dark' : 'bright');
  }
}
