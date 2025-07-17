/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriSpaceAlign, TriSpaceDirection, TriSpaceSize } from 'ng-zorro-antd/space';
import { TriSpaceComponent } from 'ng-zorro-antd/space/space.component';

import { TriSpaceModule } from './space.module';

describe('Space', () => {
  let component: SpaceTestComponent;
  let fixture: ComponentFixture<SpaceTestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceTestComponent);
    component = fixture.componentInstance;
    component.size = 'small';
    component.direction = 'horizontal';
    fixture.detectChanges();
  });

  it('should render size', () => {
    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceElement = spaceComponent.nativeElement as HTMLElement;

    // default size is 'small'
    expect(spaceElement.style.columnGap).toBe('8px');
    expect(spaceElement.style.rowGap).toBe('8px');

    component.size = 'middle';
    fixture.detectChanges();
    expect(spaceElement.style.columnGap).toBe('16px');
    expect(spaceElement.style.rowGap).toBe('16px');

    component.size = 'large';
    fixture.detectChanges();
    expect(spaceElement.style.columnGap).toBe('24px');
    expect(spaceElement.style.rowGap).toBe('24px');
  });

  it('should render customize size', () => {
    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceElement = spaceComponent.nativeElement as HTMLElement;

    component.size = 36;
    fixture.detectChanges();
    expect(spaceElement.style.columnGap).toBe('36px');
    expect(spaceElement.style.rowGap).toBe('36px');

    component.size = [36, 18];
    fixture.detectChanges();
    expect(spaceElement.style.columnGap).toBe('36px');
    expect(spaceElement.style.rowGap).toBe('18px');
  });

  it('should wrap', () => {
    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceElement = spaceComponent.nativeElement as HTMLElement;

    // default wrap is false
    expect(spaceElement.style.flexWrap).toBeFalsy();

    component.wrap = true;
    fixture.detectChanges();

    expect(spaceElement.style.flexWrap).toBe('wrap');
  });

  it('should set direction', () => {
    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceElement = spaceComponent.nativeElement as HTMLElement;

    component.direction = 'vertical';
    fixture.detectChanges();
    expect(spaceElement.classList).toContain('ant-space-vertical');

    component.direction = 'horizontal';
    fixture.detectChanges();
    expect(spaceElement.classList).toContain('ant-space-horizontal');
  });

  it('should set align', () => {
    component.direction = 'vertical';
    fixture.detectChanges();

    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceNativeElement = spaceComponent.nativeElement as HTMLElement;
    expect(spaceNativeElement.classList).toContain('ant-space-vertical');

    spaceNativeElement.classList.forEach(className => {
      expect(className.indexOf('ant-space-align') === -1).toBe(true);
    });

    component.direction = 'horizontal';
    fixture.detectChanges();

    expect(spaceNativeElement.classList).toContain('ant-space-align-center');

    component.align = 'end';
    fixture.detectChanges();

    expect(spaceNativeElement.classList).toContain('ant-space-align-end');
  });

  it('should render split', () => {
    component.showSplit = true;
    fixture.detectChanges();

    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));
    const spaceElement = spaceComponent.nativeElement as HTMLElement;
    let items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    let splits = fixture.debugElement.queryAll(By.css('.ant-space-split'));

    expect(items.length).toBe(2);
    expect(splits.length).toBe(1);
    expect(spaceElement.style.columnGap).toBe('8px');
    expect(spaceElement.style.rowGap).toBe('8px');

    component.show = true;
    fixture.detectChanges();

    items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    splits = fixture.debugElement.queryAll(By.css('.ant-space-split'));

    expect(items.length).toBe(3);
    expect(splits.length).toBe(2);
    expect(spaceElement.style.columnGap).toBe('8px');
    expect(spaceElement.style.rowGap).toBe('8px');
  });
});

@Component({
  imports: [TriSpaceModule],
  template: `
    <tri-space
      [split]="showSplit ? spaceSplit : null"
      [size]="size"
      [direction]="direction"
      [align]="align"
      [wrap]="wrap"
    >
      <div *spaceItem>item</div>
      <div *spaceItem>item</div>
      @if (show) {
        <div *spaceItem>item</div>
      }
    </tri-space>

    <ng-template #spaceSplit>|</ng-template>
  `
})
class SpaceTestComponent {
  size: TriSpaceSize | [TriSpaceSize, TriSpaceSize] = 'small';
  direction: TriSpaceDirection = 'horizontal';
  show = false;
  align?: TriSpaceAlign;
  wrap?: boolean;
  showSplit = false;
}
