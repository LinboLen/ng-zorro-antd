import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSelectModule } from 'ng-zorro-antd/select';

interface MockUser {
  name: {
    first: string;
  };
}

@Component({
  selector: 'tri-demo-select-select-users',
  imports: [FormsModule, TriIconModule, TriSelectModule],
  template: `
    <tri-select
      mode="multiple"
      placeHolder="Select users"
      allowClear
      showSearch
      serverSearch
      [(ngModel)]="selectedUser"
      (onSearch)="onSearch($event)"
    >
      @if (!loading) {
        @for (o of optionList; track o) {
          <tri-option [value]="o" [label]="o"></tri-option>
        }
      } @else {
        <tri-option disabled customContent>
          <tri-icon type="loading" class="loading-icon" />
          Loading Data...
        </tri-option>
      }
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }

      .loading-icon {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoSelectSelectUsersComponent implements OnInit {
  randomUserUrl = 'https://api.randomuser.me/?results=5';
  searchChange$ = new BehaviorSubject('');
  optionList: string[] = [];
  selectedUser?: string;
  loading = false;

  onSearch(value: string): void {
    this.loading = true;
    this.searchChange$.next(value);
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchChange$
      .pipe(
        debounceTime(500),
        switchMap(name => this.getRandomNameList(name))
      )
      .subscribe(data => {
        this.optionList = data;
        this.loading = false;
      });
  }

  getRandomNameList(name: string): Observable<string[]> {
    return this.http.get<{ results: MockUser[] }>(`${this.randomUserUrl}`).pipe(
      map(res => res.results),
      catchError(() => of<MockUser[]>([])),
      map(list => list.map(item => `${item.name.first} ${name}`))
    );
  }
}
