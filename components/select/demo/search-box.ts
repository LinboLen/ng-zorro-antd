import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-search-box',
  imports: [TriSelectModule],
  template: `
    <tri-select
      [options]="options()"
      showSearch
      serverSearch
      placeHolder="input search text"
      [showArrow]="false"
      [filterOption]="filterFn"
      (onSearch)="search($event)"
    />
  `,
  styles: `
    nz-select {
      width: 200px;
    }
  `
})
export class TriDemoSelectSearchBoxComponent {
  private readonly http = inject(HttpClient);

  readonly options = signal<Array<{ label: string; value: string }>>([]);
  readonly filterFn = (): boolean => true;

  search(value: string): void {
    this.http
      .jsonp<{ result: Array<[string, string]> }>(`https://suggest.taobao.com/sug?code=utf-8&q=${value}`, 'callback')
      .subscribe(data => {
        const options = data.result.map(([item]) => ({ label: item, value: item }));
        this.options.set(options);
      });
  }
}
