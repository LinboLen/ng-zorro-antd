/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriDescriptionsComponent } from './descriptions.component';
import { TriDescriptionsModule } from './descriptions.module';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
declare const viewport: any;

describe('descriptions', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('with different spans', () => {
    let testComponent: TriTestDescriptionsComponent;
    let componentElement: HTMLElement;
    let fixture: ComponentFixture<TriTestDescriptionsComponent>;
    let rows;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestDescriptionsComponent);
      testComponent = fixture.componentInstance;
      componentElement = fixture.debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should have correct layout', () => {
      let title = componentElement.querySelector('.ant-descriptions-title');
      const view = componentElement.querySelector('.ant-descriptions-view');

      expect(title).toBeTruthy();
      expect(view).toBeTruthy();

      testComponent.title = '';
      fixture.detectChanges();
      title = componentElement.querySelector('.ant-descriptions-title');
      expect(title).toBeFalsy();
    });

    it('should render spans correctly', () => {
      const spyOnWarn = spyOn(console, 'warn');
      spyOnWarn.calls.reset();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(1);

      testComponent.colspanArray = [1, 1, 1, 2, 3, 1, 5];
      fixture.detectChanges();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(3);
      expect(spyOnWarn).toHaveBeenCalledTimes(2);
      expect(spyOnWarn).toHaveBeenCalledWith('[NG-ZORRO]:', '"nzColumn" is 3 but we have row length 5');
      expect(spyOnWarn).toHaveBeenCalledWith('[NG-ZORRO]:', '"nzColumn" is 3 but we have row length 6');

      testComponent.column = 5;
      testComponent.colspanArray = [1, 2, 3];
      fixture.detectChanges();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(1);
      expect(spyOnWarn).toHaveBeenCalledTimes(4);
      expect(spyOnWarn).toHaveBeenCalledWith('[NG-ZORRO]:', '"nzColumn" is 5 but we have row length 6');

      testComponent.colspanArray = [1, 2, 2];
      fixture.detectChanges();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(1);

      // Should the last fill the rest space.
      testComponent.colspanArray = [1, 1];
      fixture.detectChanges();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      const tds = componentElement.querySelectorAll('.ant-descriptions-item');
      expect(rows.length).toBe(1);
      expect((tds[1] as HTMLTableCellElement).colSpan).toBe(4);
      spyOnWarn.calls.reset();
    });

    it('should responsive work', fakeAsync(() => {
      testComponent.column = {
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 3,
        sm: 2,
        xs: 1
      };
      testComponent.colspanArray = [1, 1, 1, 2, 3, 1, 5];

      viewport.set(1024, 1024);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(3);

      viewport.set(320, 320);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();

      rows = componentElement.querySelectorAll('.ant-descriptions-row');
      expect(rows.length).toBe(7);

      viewport.reset();
    }));

    // fix #3795
    it('should change to use content work', fakeAsync(() => {
      let firstTitle = componentElement.querySelector('.ant-descriptions-item-label') as HTMLSpanElement;
      expect(firstTitle.innerText).toBe('Item Title 0');

      testComponent.itemTitle = 'Item ';
      fixture.detectChanges();
      tick(16);
      fixture.detectChanges();
      firstTitle = componentElement.querySelector('.ant-descriptions-item-label') as HTMLSpanElement;
      expect(firstTitle.innerText).toBe('Item 0');
    }));
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestDescriptionsRtlComponent>;
    let componentElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestDescriptionsRtlComponent);
      componentElement = fixture.debugElement.query(By.directive(TriDescriptionsComponent)).nativeElement;
      fixture.detectChanges();
    });

    it('should className correct on dir change', fakeAsync(() => {
      expect(componentElement.classList).toContain('ant-descriptions-rtl');
      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(componentElement.classList).not.toContain('ant-descriptions-rtl');
    }));
  });
});

@Component({
  imports: [TriDescriptionsModule],
  selector: 'tri-test-descriptions',
  template: `
    <tri-descriptions [title]="title" [bordered]="bordered" [column]="column">
      @for (col of colspanArray; track i; let i = $index) {
        <tri-descriptions-item [title]="itemTitle + i" [span]="col" />
      }
    </tri-descriptions>
  `
})
export class TriTestDescriptionsComponent {
  bordered = false;
  colspanArray: number[] = [1, 1, 1];
  column: TriDescriptionsComponent['nzColumn'] = 3;
  title = 'Title';
  itemTitle = 'Item Title ';
}

@Component({
  imports: [BidiModule, TriTestDescriptionsComponent],
  template: `
    <div [dir]="direction">
      <tri-test-descriptions></tri-test-descriptions>
    </div>
  `
})
export class TriTestDescriptionsRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
