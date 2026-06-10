import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSelectModule } from 'ng-zorro-antd/select';

interface MockUser {
  name: {
    first: string;
  };
}

@Component({
  selector: 'tri-demo-select-select-users',
  imports: [TriIconModule, TriSelectModule],
  template: `
    <tri-select
      mode="multiple"
      placeHolder="Select users"
      allowClear
      showSearch
      serverSearch
      (onSearch)="search($event)"
    >
      @if (!loading()) {
        @for (user of options(); track user) {
          <tri-option [value]="user" [label]="user" />
        }
      } @else {
        <tri-option disabled customContent>
          <tri-icon type="loading" class="loading-icon" />
          Loading Data...
        </tri-option>
      }
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 100%;
    }

    .loading-icon {
      margin-right: 8px;
    }
  `
})
export class TriDemoSelectSelectUsersComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly search$ = new BehaviorSubject('');
  readonly options = signal<string[]>([]);
  readonly loading = signal(false);

  search(value: string): void {
    this.search$.next(value);
  }

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(500),
        tap(() => this.loading.set(true)),
        switchMap(name => this.getRandomNameList(name))
      )
      .subscribe(data => {
        this.options.set(data);
        this.loading.set(false);
      });
  }

  getRandomNameList(name: string): Observable<string[]> {
    return this.http.get<{ results: MockUser[] }>('https://api.randomuser.me/?results=5').pipe(
      map(res => res.results.map(item => `${item.name.first} ${name}`)),
      catchError(() => of<string[]>([]))
    );
  }
}
