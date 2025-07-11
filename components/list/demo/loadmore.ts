/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriListModule } from 'ng-zorro-antd/list';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
  selector: 'tri-demo-list-loadmore',
  imports: [TriButtonModule, TriListModule, TriSkeletonModule],
  template: `
    <tri-list class="demo-loadmore-list" [loading]="initLoading">
      @for (item of list; track item) {
        <tri-list-item>
          @if (item.loading) {
            <tri-skeleton [avatar]="true" [active]="true" [title]="false" [loading]="true" />
          } @else {
            <ng-container>
              <tri-list-item-meta
                avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              >
                <tri-list-item-meta-title>
                  <a href="https://ng.ant.design">{{ item.name.last }}</a>
                </tri-list-item-meta-title>
              </tri-list-item-meta>
              content
              <ul tri-list-item-actions>
                <tri-list-item-action><a (click)="edit(item)">edit</a></tri-list-item-action>
                <tri-list-item-action><a (click)="edit(item)">more</a></tri-list-item-action>
              </ul>
            </ng-container>
          }
        </tri-list-item>
      }
      <div class="loadmore" tri-list-load-more>
        @if (!loadingMore) {
          <button tri-button (click)="onLoadMore()">loading more</button>
        }
      </div>
    </tri-list>
  `,
  styles: [
    `
      .demo-loadmore-list {
        min-height: 350px;
      }
      .loadmore {
        text-align: center;
        margin-top: 12px;
        height: 32px;
        line-height: 32px;
      }
    `
  ]
})
export class TriDemoListLoadmoreComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];

  constructor(
    private http: HttpClient,
    private msg: TriMessageService
  ) {}

  ngOnInit(): void {
    this.getData((res: any) => {
      this.data = res.results;
      this.list = res.results;
      this.initLoading = false;
    });
  }

  getData(callback: (res: any) => void): void {
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => {
        this.data = this.data.concat(res.results);
        this.list = [...this.data];
        this.loadingMore = false;
      });
  }

  edit(item: any): void {
    this.msg.success(item.email);
  }
}
