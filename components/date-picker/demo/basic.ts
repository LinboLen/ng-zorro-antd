import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getISOWeek } from 'date-fns';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { en_US, TriI18nService, zh_CN } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'tri-demo-date-picker-basic',
  imports: [FormsModule, TriButtonModule, TriDatePickerModule],
  template: `
    <tri-date-picker [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
    <br />
    <tri-date-picker mode="week" [(ngModel)]="date" (ngModelChange)="getWeek($event)"></tri-date-picker>
    <br />
    <tri-date-picker mode="month" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
    <br />
    <tri-date-picker mode="quarter" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
    <br />
    <tri-date-picker mode="year" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
    <br />
    <button tri-button type="default" (click)="changeLanguage()">Switch language for all pickers</button>
  `,
  styles: [
    `
      nz-date-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerBasicComponent {
  date = null;
  isEnglish = false;

  constructor(private i18n: TriI18nService) {}

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }
}
