/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AsyncPipe } from '@angular/common';
import { Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { vi } from 'vitest';

import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { TriDirectionVHType, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriListComponent } from './list.component';
import { TriListModule } from './list.module';

describe('list', () => {
  let fixture: ComponentFixture<TestListComponent>;
  let context: TestListComponent;
  let dl: DebugElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
    fixture = TestBed.createComponent(TestListComponent);
    context = fixture.componentInstance;
    dl = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('[fields]', () => {
    describe('#nzItemLayout', () => {
      for (const item of [
        { type: 'default', ret: false },
        { type: 'vertical', ret: true }
      ]) {
        it(`[${item.type}]`, () => {
          context.itemLayout.set(item.type as TriDirectionVHType);
          fixture.detectChanges();
          expect(dl.query(By.css(`.ant-list-${item.type}`)) != null).toBe(item.ret);
        });
      }
    });

    describe('#nzBordered', () => {
      for (const value of [true, false]) {
        it(`[${value}]`, () => {
          context.bordered.set(value);
          fixture.detectChanges();
          expect(dl.query(By.css('.ant-list-bordered')) != null).toBe(value);
        });
      }
    });

    describe('#nzHeader', () => {
      it('with string', () => {
        expect(dl.query(By.css('.ant-list-header'))).not.toBeNull();
      });

      it('with custom template', () => {
        const fixtureTemp = TestBed.createComponent(TestListWithTemplateComponent);
        fixtureTemp.detectChanges();
        expect(fixtureTemp.debugElement.query(By.css('.list-header'))).not.toBeNull();
      });
    });

    describe('#nzFooter', () => {
      let fixtureTemp: ComponentFixture<TestListWithTemplateComponent>;
      beforeEach(() => {
        fixtureTemp = TestBed.createComponent(TestListWithTemplateComponent);
        fixtureTemp.detectChanges();
      });

      it('with string', () => {
        expect(dl.query(By.css('.ant-list-footer')) != null).toBe(true);
      });

      it('with custom template', () => {
        const footerEl = fixtureTemp.debugElement.query(By.css('.ant-list-footer'));
        expect((footerEl.nativeElement as HTMLDivElement).innerText).toBe(
          fixtureTemp.componentInstance._footer() as string
        );
      });

      it('change string to template', () => {
        const footerEl = fixtureTemp.debugElement.query(By.css('.ant-list-footer'));
        expect((footerEl.nativeElement as HTMLDivElement).innerText).toBe(
          fixtureTemp.componentInstance._footer() as string
        );
        (fixtureTemp.debugElement.query(By.css('#change')).nativeElement as HTMLButtonElement).click();
        fixtureTemp.detectChanges();
        expect(fixtureTemp.debugElement.query(By.css('.list-footer')) != null).toBe(true);
      });
    });

    describe('#nzSize', () => {
      for (const item of [
        { type: 'default', cls: '.ant-list' },
        { type: 'small', cls: '.ant-list-sm' },
        { type: 'large', cls: '.ant-list-lg' }
      ]) {
        it(`[${item.type}]`, () => {
          context.size.set(item.type as TriSizeLDSType);
          fixture.detectChanges();
          expect(dl.query(By.css(item.cls)) != null).toBe(true);
        });
      }
    });

    describe('#nzSplit', () => {
      for (const value of [true, false]) {
        it(`[${value}]`, () => {
          context.split.set(value);
          fixture.detectChanges();
          expect(dl.query(By.css('.ant-list-split')) != null).toBe(value);
        });
      }
    });

    describe('#nzLoading', () => {
      for (const value of [true, false]) {
        it(`[${value}]`, () => {
          context.loading.set(value);
          fixture.detectChanges();
          expect(dl.query(By.css('.ant-list-loading')) != null).toBe(value);
        });
      }

      it('should be minimum area block when data is empty', () => {
        context.loading.set(true);
        context.data.set([]);
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-spin-nested-loading'))).not.toBeNull();
      });
    });

    describe('#nzDataSource', () => {
      it('should working', () => {
        expect(dl.queryAll(By.css('nz-list-item')).length).toBe(context.data()!.length);
      });

      it('should be render empty text when data source is empty', () => {
        expect(dl.queryAll(By.css('.ant-list-empty-text')).length).toBe(0);
        context.data.set([]);
        fixture.detectChanges();
        expect(dl.queryAll(By.css('.ant-list-empty-text')).length).toBe(1);
      });

      it('should be ignore empty text when unspecified data source', () => {
        context.data.set(undefined!);
        fixture.detectChanges();
        expect(dl.queryAll(By.css('.ant-list-empty-text')).length).toBe(0);
      });
    });

    it('#nzGrid', () => {
      const colCls = `.ant-col-${context.grid().span}`;
      expect(dl.queryAll(By.css(colCls)).length).toBe(context.data()!.length);
    });

    it('#loadMore', () => {
      expect(dl.query(By.css('.loadmore'))).not.toBeNull();
    });

    it('#pagination', () => {
      expect(dl.query(By.css('.pagination'))).not.toBeNull();
    });

    it('should be use split main and extra when item layout is vertical', () => {
      context.itemLayout.set('vertical');
      fixture.detectChanges();
      expect(dl.query(By.css('.ant-list-item-main'))).not.toBeNull();
      expect(dl.query(By.css('.ant-list-item-extra'))).not.toBeNull();
    });

    describe('asynchronous action', () => {
      beforeEach(() => vi.useFakeTimers());
      afterEach(() => vi.useRealTimers());

      it('should display the asynchronous action', async () => {
        vi.advanceTimersByTime(500);
        await Promise.resolve();
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-list-item-action'))).not.toBeNull();
      });
    });
  });

  describe('item', () => {
    let fixtureTemp: ComponentFixture<TestListItemComponent>;

    beforeEach(() => {
      fixtureTemp = TestBed.createComponent(TestListItemComponent);
      fixtureTemp.detectChanges();
    });

    it('with string', () => {
      expect(
        (
          fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item')).nativeElement as HTMLElement
        ).textContent!.includes('content')
      ).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-action')) != null).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-string .extra-logo')) != null).toBe(true);
    });

    it('with custom template of [nzContent]', () => {
      expect(fixtureTemp.debugElement.query(By.css('#item-template .item-content')) != null).toBe(true);
    });

    it('#nzNoFlex', () => {
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-no-flex')) != null).toBe(false);
      fixtureTemp.componentInstance.noFlex.set(true);
      fixtureTemp.detectChanges();
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-no-flex')) != null).toBe(true);
    });
  });

  describe('item-meta', () => {
    let fixtureTemp: ComponentFixture<TestListItemComponent>;

    beforeEach(() => {
      fixtureTemp = TestBed.createComponent(TestListItemComponent);
      fixtureTemp.detectChanges();
    });

    it('with string', () => {
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-meta-title')) != null).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-meta-description')) != null).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-string .ant-list-item-meta-avatar')) != null).toBe(true);
    });

    it('with custom template', () => {
      expect(fixtureTemp.debugElement.query(By.css('#item-template .item-title')) != null).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-template .item-desc')) != null).toBe(true);
      expect(fixtureTemp.debugElement.query(By.css('#item-template .item-avatar')) != null).toBe(true);
    });
  });
});

testDirectionality(() => TestListComponent, By.directive(TriListComponent), 'ant-list', {
  providers: [provideNzIconsTesting()]
});

@Component({
  imports: [TriListModule, AsyncPipe],
  selector: 'tri-test-list',
  template: `
    <tri-list
      #comp
      [dataSource]="data()"
      [itemLayout]="itemLayout()"
      [bordered]="bordered()"
      [footer]="footer"
      [header]="header"
      [loading]="loading()"
      [size]="size()"
      [split]="split()"
      [grid]="grid()"
      [renderItem]="item"
      [loadMore]="loadMore"
      [pagination]="pagination"
    >
      <ng-template #item let-item>
        <tri-list-item [extra]="extra">
          <tri-list-item-meta
            title="title"
            avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
          <ul tri-list-item-actions>
            @for (action of actions$ | async; track action) {
              <tri-list-item-action>{{ action }}</tri-list-item-action>
            }
          </ul>
        </tri-list-item>
      </ng-template>
      <ng-template #loadMore>
        <div class="loadmore">load more</div>
      </ng-template>
      <ng-template #pagination>
        <div class="pagination">pagination</div>
      </ng-template>
      <ng-template #extra>
        <span class="extra-content">extra content</span>
      </ng-template>
    </tri-list>
  `
})
class TestListComponent {
  @ViewChild('comp', { static: false }) comp!: TriListComponent;
  readonly itemLayout = signal<TriDirectionVHType>('horizontal');
  readonly bordered = signal(false);
  footer = 'footer';
  header = 'header';
  readonly loading = signal(false);
  readonly size = signal<TriSizeLDSType>('default');
  readonly split = signal(true);
  readonly data = signal<string[]>([
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.'
  ]);
  readonly grid = signal({ gutter: 16, span: 12 });
  readonly actions$ = timer(500).pipe(map(() => ['Edit', 'Delete']));
}

@Component({
  imports: [TriListModule],
  template: `
    <button (click)="footer.set(footer)" id="change">change</button>
    <tri-list [footer]="footer()" [header]="header">
      <ng-template #nzFooter><p class="list-footer">footer</p></ng-template>
      <ng-template #nzHeader><p class="list-header">header</p></ng-template>
    </tri-list>
  `
})
class TestListWithTemplateComponent {
  @ViewChild('nzFooter', { static: false }) footer!: TemplateRef<void>;

  readonly _footer = signal<string | TemplateRef<void>>('footer with string');
}

@Component({
  imports: [TriIconModule, TriListModule],
  template: `
    <tri-list id="item-string">
      <tri-list-item content="content" [actions]="[action]" [extra]="extra" [noFlex]="noFlex()">
        <ng-template #action>
          <tri-icon type="star-o" style="margin-right: 8px;" />
          156
        </ng-template>
        <ng-template #extra>
          <img
            width="272"
            class="extra-logo"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        </ng-template>
        <tri-list-item-meta
          title="title"
          avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </tri-list-item>
    </tri-list>
    <tri-list id="item-template">
      <tri-list-item [content]="content">
        <ng-template #nzContent><p class="item-content">nzContent</p></ng-template>
        <tri-list-item-meta [title]="title" [avatar]="avatar" [description]="description">
          <ng-template #nzTitle><p class="item-title">nzTitle</p></ng-template>
          <ng-template #nzAvatar><p class="item-avatar">nzAvatar</p></ng-template>
          <ng-template #nzDescription><p class="item-desc">nzDescription</p></ng-template>
        </tri-list-item-meta>
      </tri-list-item>
    </tri-list>
  `
})
class TestListItemComponent {
  readonly noFlex = signal(false);
}
