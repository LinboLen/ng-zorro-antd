import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      showSearch
      serverSearch
      placeHolder="input search text"
      [(ngModel)]="selectedValue"
      [showArrow]="false"
      [filterOption]="filterOption"
      (onSearch)="search($event)"
    >
      @for (item of listOfOption; track item) {
        <tri-option [label]="item" [value]="item"></tri-option>
      }
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 200px;
      }
    `
  ]
})
export class TriDemoSelectSearchBoxComponent {
  selectedValue: string | null = null;
  listOfOption: string[] = [];
  readonly filterOption = (): boolean => true;

  constructor(private http: HttpClient) {}

  search(value: string): void {
    this.http
      .jsonp<{ result: Array<[string, string]> }>(`https://suggest.taobao.com/sug?code=utf-8&q=${value}`, 'callback')
      .subscribe(data => {
        this.listOfOption = data.result.map(([item]) => item);
      });
  }
}
