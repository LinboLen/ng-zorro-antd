import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TriTableModule, TriTableQueryParams } from 'ng-zorro-antd/table';

interface RandomUser {
  gender: string;
  email: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
}

@Component({
  selector: 'tri-demo-table-ajax',
  imports: [TriTableModule],
  template: `
    <tri-table
      showSizeChanger
      [data]="listOfRandomUser"
      [frontPagination]="false"
      [loading]="loading"
      [total]="total"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      (queryParams)="onQueryParamsChange($event)"
    >
      <thead>
        <tr>
          <th columnKey="name" [sortFn]="true">Name</th>
          <th columnKey="gender" [filters]="filterGender" [filterFn]="true">Gender</th>
          <th columnKey="email" [sortFn]="true">Email</th>
        </tr>
      </thead>
      <tbody>
        @for (data of listOfRandomUser; track data) {
          <tr>
            <td>{{ data.name.first }} {{ data.name.last }}</td>
            <td>{{ data.gender }}</td>
            <td>{{ data.email }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableAjaxComponent implements OnInit {
  total = 1;
  listOfRandomUser: RandomUser[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' }
  ];

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.loading = false;
      this.total = 200; // mock the total data here
      this.listOfRandomUser = data.results;
    });
  }

  onQueryParamsChange(params: TriTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  getUsers(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: RandomUser[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    filters.forEach(filter => {
      filter.value.forEach(value => {
        params = params.append(filter.key, value);
      });
    });
    return this.http
      .get<{ results: RandomUser[] }>('https://api.randomuser.me/', { params })
      .pipe(catchError(() => of({ results: [] })));
  }
}
