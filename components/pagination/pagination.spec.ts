/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { ENTER } from '@angular/cdk/keycodes';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { createKeyboardEvent, dispatchKeyboardEvent } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import en_US from 'ng-zorro-antd/i18n/languages/en_US';
import { TriI18nService } from 'ng-zorro-antd/i18n/nz-i18n.service';

import { TriPaginationComponent } from './pagination.component';
import { TriPaginationModule } from './pagination.module';

declare const viewport: TriSafeAny;

describe('pagination', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
  }));

  describe('pagination complex', () => {
    let fixture: ComponentFixture<TriTestPaginationComponent>;
    let testComponent: TriTestPaginationComponent;
    let pagination: DebugElement;
    let paginationElement: HTMLElement;
    let paginationRootElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestPaginationComponent);
      testComponent = fixture.debugElement.componentInstance;
      pagination = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      paginationRootElement = pagination.nativeElement;
      paginationElement = pagination.nativeElement.querySelector('ul')!;
    });

    describe('not simple mode', () => {
      it('should className correct', () => {
        fixture.detectChanges();
        expect(paginationRootElement.classList.contains('ant-pagination')).toBe(true);
        expect(paginationElement.firstElementChild!.classList.contains('ant-pagination-prev')).toBe(true);
        expect(paginationElement.firstElementChild!.classList.contains('ant-pagination-disabled')).toBe(true);
        expect(paginationElement.lastElementChild!.classList.contains('ant-pagination-next')).toBe(true);
        const length = paginationElement.children.length;
        const array = Array.prototype.slice.call(paginationElement.children).slice(1, length - 1);
        expect(array[0].classList.contains('ant-pagination-item-active')).toBe(true);
        expect(array.every((node: HTMLElement) => node.classList.contains('ant-pagination-item'))).toBe(true);
      });

      it('should small size className correct', () => {
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(paginationRootElement.classList.contains('ant-pagination-mini')).toBe(true);
      });

      it('should pageIndex change work', () => {
        testComponent.pageIndex = 2;
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        const length = paginationElement.children.length;
        const array = Array.prototype.slice.call(paginationElement.children).slice(1, length - 1);
        expect(array[1].classList.contains('ant-pagination-item-active')).toBe(true);
      });

      it('should pageIndex change not trigger when same', () => {
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        const length = paginationElement.children.length;
        const array = Array.prototype.slice.call(paginationElement.children).slice(1, length - 1);
        expect(array[0].classList.contains('ant-pagination-item-active')).toBe(true);
        array[0].click();
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
      });

      it('should change pageIndex change pages list', () => {
        fixture.detectChanges();
        testComponent.total = 500;
        fixture.detectChanges();
        expect(paginationElement.children.length).toBe(9);
        testComponent.pageIndex = 5;
        fixture.detectChanges();
        expect(paginationElement.children.length).toBe(11);
      });

      it('should pre button disabled', () => {
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        (paginationElement.children[0] as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        expect(testComponent.pageIndex).toBe(1);
      });

      it('should pre button work', () => {
        testComponent.pageIndex = 5;
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        (paginationElement.children[0] as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(4);
      });

      it('should next button disabled', () => {
        testComponent.pageIndex = 5;
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        (paginationElement.lastElementChild as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        expect(testComponent.pageIndex).toBe(5);
      });

      it('should next button work', () => {
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        (paginationElement.lastElementChild as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndex).toBe(2);
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
      });

      it('should click pageIndex work', () => {
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        (paginationElement.children[3] as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndex).toBe(3);
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
      });

      it('should total change style work', () => {
        testComponent.total = 500;
        fixture.detectChanges();
        expect(paginationElement.children.length).toBe(9);
      });

      it('should next five work', () => {
        testComponent.total = 500;
        fixture.detectChanges();
        testComponent.pageIndex = 46;
        fixture.detectChanges();
        (paginationElement.children[8] as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndex).toBe(50);
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(paginationElement.children.length).toBe(9);
      });

      it('should pre five work', () => {
        testComponent.total = 500;
        fixture.detectChanges();
        testComponent.pageIndex = 5;
        fixture.detectChanges();
        expect(paginationElement.children.length).toBe(11);
        (paginationElement.children[2] as HTMLElement).click();
        fixture.detectChanges();
        expect(testComponent.pageIndex).toBe(1);
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(paginationElement.children.length).toBe(9);
      });

      it('should showSizeChanger work', waitForAsync(() => {
        testComponent.total = 500;
        testComponent.pageIndex = 50;
        testComponent.showSizeChanger = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(paginationElement.children.length).toBe(10);
          expect(paginationElement.lastElementChild!.classList.contains('ant-pagination-options')).toBe(true);
        });
      }));

      it('should change pageSize correct', () => {
        testComponent.pageIndex = 5;
        fixture.detectChanges();
        testComponent.paginationComponent.onPageSizeChange(20);
        fixture.detectChanges();
        expect(testComponent.pageIndex).toBe(3);
        expect(testComponent.pageSizeChange).toHaveBeenCalledTimes(1);
      });

      it('should showQuickJumper work', () => {
        testComponent.showQuickJumper = true;
        fixture.detectChanges();
        const input = pagination.nativeElement.querySelector('input');
        input.value = 5;
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        const event = createKeyboardEvent('keydown', ENTER, input, 'enter');
        input.dispatchEvent(event);
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
        expect(input.value).toBe('');
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
        input.value = 'abc';
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
        input.value = -1;
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
        input.value = 10;
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
      });

      it('should nzDisabled work', () => {
        fixture.detectChanges();
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(paginationRootElement.classList.contains('ant-pagination-disabled')).toBe(true);
      });
    });

    describe('simple mode', () => {
      beforeEach(() => {
        testComponent.simple = true;
        fixture.detectChanges();
        paginationRootElement = pagination.nativeElement;
        paginationElement = pagination.nativeElement.querySelector('ul')!;
      });
      it('should simple className work', () => {
        expect(paginationRootElement.classList.contains('ant-pagination-simple')).toBe(true);
        expect(paginationElement.firstElementChild!.classList.contains('ant-pagination-prev')).toBe(true);
        expect(paginationElement.lastElementChild!.classList.contains('ant-pagination-next')).toBe(true);
      });
      it('should simple pager jump', () => {
        fixture.detectChanges();
        const input = pagination.nativeElement.querySelector('input');
        input.value = 5;
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(0);
        const event = createKeyboardEvent('keydown', ENTER, input, 'enter');
        input.dispatchEvent(event);
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('5');
        expect(testComponent.pageIndex).toBe(5);
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('5');
        input.value = 100;
        expect(testComponent.pageIndex).toBe(5);
        dispatchKeyboardEvent(input, 'keydown', ENTER, input);
        fixture.detectChanges();
        expect(testComponent.pageIndexChange).toHaveBeenCalledTimes(1);
        expect(testComponent.pageIndex).toBe(5);
      });
    });
    it('should zero total hide all', () => {
      testComponent.total = 0;
      fixture.detectChanges();
      expect(pagination.nativeElement.innerText).toEqual('');
    });
    it('should be hidden pagination when total is 0 and nzHideOnSinglePage is true', () => {
      (testComponent as TriTestPaginationComponent).total = 0;
      (testComponent as TriTestPaginationComponent).hideOnSinglePage = true;
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.ant-pagination').children.length).toBe(0);
    });
    it('should be display one more page when the 4th is selected', () => {
      testComponent.total = 500;
      testComponent.pageIndex = 4; // he 4th is selected
      fixture.detectChanges();
      expect(paginationElement.children.length).toBe(10);
      testComponent.pageIndex = 3;
      fixture.detectChanges();
      expect(paginationElement.children.length).toBe(9);

      testComponent.pageIndex = 47; // the 4th from last is selected
      fixture.detectChanges();
      expect(paginationElement.children.length).toBe(10);
      testComponent.pageIndex = 48;
      fixture.detectChanges();
      expect(paginationElement.children.length).toBe(9);
    });
  });

  describe('pagination render items', () => {
    let fixture: ComponentFixture<TriTestPaginationRenderComponent>;
    let pagination: DebugElement;
    let paginationElement: HTMLElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestPaginationRenderComponent);
      pagination = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      paginationElement = pagination.nativeElement.querySelector('ul')!;
    });
    it('should render correct', () => {
      fixture.detectChanges();
      expect((paginationElement.firstElementChild as HTMLElement).innerText).toBe('Previous');
      expect((paginationElement.lastElementChild as HTMLElement).innerText).toBe('Next');
      expect((paginationElement.children[1] as HTMLElement).innerText).toBe('2');
    });
  });

  describe('pagination total items', () => {
    let fixture: ComponentFixture<TriTestPaginationTotalComponent>;
    let testComponent: TriTestPaginationTotalComponent;
    let pagination: DebugElement;
    let paginationElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestPaginationTotalComponent);
      testComponent = fixture.debugElement.componentInstance;
      pagination = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      paginationElement = pagination.nativeElement.querySelector('ul')!;
    });

    it('should render correct', () => {
      fixture.detectChanges();
      expect((paginationElement.firstElementChild as HTMLElement).innerText.trim()).toBe('1-20 of 85 items');
      testComponent.pageIndex = 2;
      fixture.detectChanges();
      expect((paginationElement.firstElementChild as HTMLElement).innerText.trim()).toBe('21-40 of 85 items');
      testComponent.pageIndex = 5;
      fixture.detectChanges();
      expect((paginationElement.firstElementChild as HTMLElement).innerText.trim()).toBe('81-85 of 85 items');
    });
  });

  it('should auto resize work', fakeAsync(() => {
    const fixture = TestBed.createComponent(TriTestPaginationAutoResizeComponent);
    const pagination = fixture.debugElement.query(By.directive(TriPaginationComponent));

    viewport.set(1200, 350);
    fixture.detectChanges();
    let paginationElement = pagination.nativeElement;
    expect(paginationElement.classList).not.toContain('ant-pagination-mini');

    viewport.set(350, 350);
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    paginationElement = pagination.nativeElement;
    expect(paginationElement.classList).toContain('ant-pagination-mini');
    viewport.reset();
  }));

  it('#i18n', () => {
    const fixture = TestBed.createComponent(TriTestPaginationComponent);
    const dl = fixture.debugElement;
    fixture.detectChanges();
    TestBed.inject(TriI18nService).setLocale(en_US);
    fixture.detectChanges();
    const prevText = (dl.query(By.css('.ant-pagination-prev')).nativeElement as HTMLElement).title;
    expect(prevText).toBe(en_US.Pagination.prev_page);
    const nextText = (dl.query(By.css('.ant-pagination-next')).nativeElement as HTMLElement).title;
    expect(nextText).toBe(en_US.Pagination.next_page);
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestPaginationRtlComponent>;
    let pagination: DebugElement;
    let paginationElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestPaginationRtlComponent);
      pagination = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      paginationElement = pagination.nativeElement.querySelector('ul')!;
    });

    it('should pagination className correct on dir change', () => {
      fixture.detectChanges();
      expect(pagination.nativeElement.classList).toContain('ant-pagination-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(pagination.nativeElement.classList).not.toContain('ant-pagination-rtl');
    });

    it('should render icons correct', () => {
      fixture.detectChanges();
      fixture.componentInstance.total = 500;
      fixture.detectChanges();
      fixture.componentInstance.pageIndex = 7;
      fixture.detectChanges();
      const prev = paginationElement.firstElementChild as HTMLElement;
      const next = paginationElement.lastElementChild as HTMLElement;
      expect(prev.querySelector('.anticon')?.classList.contains('anticon-right')).toBe(true);
      expect(next.querySelector('.anticon')?.classList.contains('anticon-left')).toBe(true);

      const prev_5 = paginationElement.querySelector('.ant-pagination-jump-prev') as HTMLElement;
      const next_5 = paginationElement.querySelector('.ant-pagination-jump-next') as HTMLElement;

      expect(prev_5.querySelector('.anticon')?.classList.contains('anticon-double-right')).toBe(true);
      expect(next_5.querySelector('.anticon')?.classList.contains('anticon-double-left')).toBe(true);
    });
  });
});

@Component({
  imports: [TriPaginationModule],
  template: `
    <tri-pagination
      [simple]="simple"
      [(pageIndexChange)]="pageIndex"
      [disabled]="disabled"
      (pageIndexChange)="pageIndexChange($event)"
      [(pageSizeChange)]="pageSize"
      (pageSizeChange)="pageSizeChange($event)"
      [size]="size"
      [total]="total"
      [hideOnSinglePage]="hideOnSinglePage"
      [pageSizeOptions]="pageSizeOptions"
      [showSizeChanger]="showSizeChanger"
      [showQuickJumper]="showQuickJumper"
    ></tri-pagination>
  `
})
export class TriTestPaginationComponent {
  @ViewChild(TriPaginationComponent, { static: false }) paginationComponent!: TriPaginationComponent;
  pageIndex = 1;
  pageSize = 10;
  total = 50;
  disabled = false;
  pageIndexChange = jasmine.createSpy<TriSafeAny>('pageIndexChange callback');
  pageSizeChange = jasmine.createSpy<TriSafeAny>('pageSizeChange callback');
  showQuickJumper = false;
  showSizeChanger = false;
  hideOnSinglePage = false;
  pageSizeOptions = [10, 20, 30, 40];
  simple = false;
  size: 'default' | 'small' = 'default';
}

@Component({
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="1" [total]="50" [itemRender]="renderItemTemplate"></tri-pagination>
    <ng-template #renderItemTemplate let-type let-page="page">
      @switch (type) {
        @case ('prev') {
          <a>Previous</a>
        }
        @case ('next') {
          <a>Next</a>
        }
        @case ('page') {
          <a>{{ page * 2 }}</a>
        }
      }
    </ng-template>
  `
})
export class TriTestPaginationRenderComponent {}

@Component({
  imports: [TriPaginationModule],
  template: `
    <tri-pagination
      [(pageIndexChange)]="pageIndex"
      [total]="85"
      [pageSize]="20"
      [showTotal]="rangeTemplate"
    ></tri-pagination>
    <ng-template #rangeTemplate let-range="range" let-total>
      {{ range[0] }}-{{ range[1] }} of {{ total }} items
    </ng-template>
  `
})
export class TriTestPaginationTotalComponent {
  pageIndex = 1;
}

@Component({
  imports: [TriPaginationModule],
  template: `<tri-pagination responsive></tri-pagination>`
})
export class TriTestPaginationAutoResizeComponent {}

@Component({
  imports: [BidiModule, TriPaginationModule],
  template: `
    <div [dir]="direction">
      <tri-pagination
        [simple]="false"
        [(pageIndexChange)]="pageIndex"
        [total]="total"
        [(pageSizeChange)]="pageSize"
      ></tri-pagination>
    </div>
  `
})
export class TriTestPaginationRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
  pageIndex = 1;
  pageSize = 10;
  total = 50;
}
