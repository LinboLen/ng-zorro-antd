import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-coordinate',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select [(ngModel)]="selectedProvince" (ngModelChange)="provinceChange($event)">
      @for (p of provinceData; track p) {
        <tri-option [value]="p" [label]="p" />
      }
    </tri-select>
    <tri-select [(ngModel)]="selectedCity">
      @for (c of cityData[selectedProvince]; track c) {
        <tri-option [value]="c" [label]="c" />
      }
    </tri-select>
  `,
  styles: `
    nz-select {
      margin-right: 8px;
      width: 120px;
    }
  `
})
export class TriDemoSelectCoordinateComponent {
  selectedProvince = 'Zhejiang';
  selectedCity = 'Hangzhou';
  provinceData = ['Zhejiang', 'Jiangsu'];
  cityData: { [place: string]: string[] } = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
  };

  provinceChange(value: string): void {
    this.selectedCity = this.cityData[value][0];
  }
}
