import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpinModule } from 'ng-zorro-antd/spin';

interface MockUser {
  name: {
    first: string;
  };
}

@Component({
  selector: '',
  imports: [FormsModule, TriSelectModule, TriSpinModule],
  template: `
    <tri-select
      [(ngModel)]="selectedUser"
      (scrollToBottom)="loadMore()"
      placeHolder="Select users"
      allowClear
      [dropdownRender]="renderTemplate"
    >
      @for (item of optionList; track item) {
        <tri-option [value]="item" [label]="item"></tri-option>
      }
    </tri-select>
    <ng-template #renderTemplate>
      @if (isLoading) {
        <tri-spin></tri-spin>
      }
    </ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectScrollLoadComponent implements OnInit {
  readonly randomUserUrl: string = 'https://api.randomuser.me/?results=10';
  optionList: string[] = [];
  selectedUser: string | null = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMore();
  }

  getRandomNameList(): Observable<string[]> {
    return this.http
      .get<{ results: MockUser[] }>(`${this.randomUserUrl}`)
      .pipe(
        map(res => res.results),
        catchError(() => of<MockUser[]>([]))
      )
      .pipe(map(list => list.map(item => `${item.name.first}`)));
  }

  loadMore(): void {
    this.isLoading = true;
    this.getRandomNameList().subscribe(data => {
      this.isLoading = false;
      this.optionList = [...this.optionList, ...data];
    });
  }
}
