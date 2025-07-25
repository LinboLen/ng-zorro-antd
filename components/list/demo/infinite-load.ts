import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { TriListModule } from 'ng-zorro-antd/list';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}

@Component({
  selector: 'tri-demo-list-infinite-load',
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, TriListModule, TriSkeletonModule],
  template: `
    <div>
      <cdk-virtual-scroll-viewport itemSize="73" class="demo-infinite-container">
        <tri-list>
          <tri-list-item *cdkVirtualFor="let item of ds">
            @if (item) {
              <tri-list-item-meta
                avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                [description]="item.email"
              >
                <tri-list-item-meta-title>
                  <a href="https://ng.ant.design">{{ item.name.last }}</a>
                </tri-list-item-meta-title>
              </tri-list-item-meta>
            } @else {
              <tri-skeleton [avatar]="true" [paragraph]="{ rows: 1 }"></tri-skeleton>
            }
          </tri-list-item>
        </tri-list>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [
    `
      .demo-infinite-container {
        height: 300px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
      }

      nz-list {
        padding: 24px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriDemoListInfiniteLoadComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(TriMessageService);
  private destroyRef = inject(DestroyRef);

  ds = new MyDataSource(this.http);

  ngOnInit(): void {
    this.ds
      .completed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.warning('Infinite List loaded all');
      });
  }
}

class MyDataSource extends DataSource<ItemData> {
  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(private http: HttpClient) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.http
      .get<{ results: ItemData[] }>(
        `https://randomuser.me/api/?results=${this.pageSize}&inc=name,gender,email,nat&noinfo`
      )
      .pipe(catchError(() => of({ results: [] })))
      .subscribe(res => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.results);
        this.dataStream.next(this.cachedData);
      });
  }
}
