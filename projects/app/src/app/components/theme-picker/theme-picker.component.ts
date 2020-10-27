import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../providers/theme.service';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.sass']
})
export class ThemePickerComponent implements OnInit {
  isDark: boolean;

  constructor(public themeService: ThemeService) {
    this.isDark = this.themeService.getTheme === 'dark';
  }

  ngOnInit(): void {
    this.setTheme();
  }

  setTheme(): void {
    this.themeService.setTheme(this.isDark ? 'dark' : 'bright');
  }
}
