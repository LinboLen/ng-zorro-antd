import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTableComponent, TriTableModule } from 'ng-zorro-antd/table';

export interface VirtualDataInterface {
  index: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'tri-demo-table-virtual',
  imports: [TriButtonModule, TriTableModule],
  template: `
    <button tri-button (click)="scrollToIndex(200)">Scroll To Index 200</button>
    <br />
    <br />
    <tri-table
      #virtualTable
      [bordered]="true"
      [virtualItemSize]="54"
      [data]="listOfData"
      [virtualForTrackBy]="trackByIndex"
      [frontPagination]="false"
      [showPagination]="false"
      [scroll]="{ x: '1200px', y: '240px' }"
    >
      <thead>
        <tr>
          <th left>Full Name</th>
          <th left>Age</th>
          <th>Index</th>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
          <th>Column 4</th>
          <th>Column 5</th>
          <th>Column 6</th>
          <th>Column 7</th>
          <th>Column 8</th>
          <th right>Action</th>
        </tr>
      </thead>
      <tbody>
        <ng-template tri-virtual-scroll let-data let-index="index">
          <tr>
            <td left>{{ data.name }}</td>
            <td left>{{ data.age }}</td>
            <td>{{ data.index }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td right>
              <a>action</a>
            </td>
          </tr>
        </ng-template>
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableVirtualComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('virtualTable', { static: false }) tableComponent?: TriTableComponent<VirtualDataInterface>;
  private destroy$ = new Subject<boolean>();
  listOfData: VirtualDataInterface[] = [];

  scrollToIndex(index: number): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }

  trackByIndex(_: number, data: VirtualDataInterface): number {
    return data.index;
  }

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 20000; i++) {
      data.push({
        index: i,
        name: `Edward`,
        age: i,
        address: `London`
      });
    }
    this.listOfData = data;
  }

  ngAfterViewInit(): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        console.log('scroll index to', data);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
