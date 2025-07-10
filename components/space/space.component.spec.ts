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

  it('should render size when the items changes', () => {
    let items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    expect(items.length).toBe(2);

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('8px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });

    component.show = true;
    fixture.detectChanges();

    items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    expect(items.length).toBe(3);
    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('8px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });
  });

  it('should render size', () => {
    const items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('8px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });

    component.size = 'middle';
    fixture.detectChanges();

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('16px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });

    component.size = 'large';
    fixture.detectChanges();

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('24px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });
  });

  it('should render customize size', () => {
    component.size = 36;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.ant-space-item'));

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('36px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });

    component.size = 18;
    fixture.detectChanges();

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('18px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });
  });

  it('should set direction', () => {
    const items = fixture.debugElement.queryAll(By.css('.ant-space-item'));

    component.direction = 'vertical';
    fixture.detectChanges();

    const spaceComponent = fixture.debugElement.query(By.directive(TriSpaceComponent));

    expect((spaceComponent.nativeElement as HTMLElement).classList).toContain('ant-space-vertical');

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBeFalsy();
        expect(element.style.marginBlockEnd).toBeTruthy();
      } else {
        expect(element.style.marginInlineEnd).toBeFalsy();
        expect(element.style.marginBlockEnd).toBeFalsy();
      }
    });

    component.direction = 'horizontal';
    fixture.detectChanges();

    expect((spaceComponent.nativeElement as HTMLElement).classList).toContain('ant-space-horizontal');

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBeTruthy();
        expect(element.style.marginBlockEnd).toBeFalsy();
      } else {
        expect(element.style.marginInlineEnd).toBeFalsy();
        expect(element.style.marginBlockEnd).toBeFalsy();
      }
    });
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

    let items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    let splits = fixture.debugElement.queryAll(By.css('.ant-space-split'));
    expect(items.length).toBe(2);
    expect(splits.length).toBe(1);

    items.forEach((item, i) => {
      const element = item.nativeElement as HTMLElement;
      if (i < items.length - 1) {
        expect(element.style.marginInlineEnd).toBe('4px');
      } else {
        expect(element.style.marginInlineEnd).toBe('');
      }
    });

    splits.forEach(item => {
      const element = item.nativeElement as HTMLElement;
      expect(element.style.marginInlineEnd).toBe('4px');
    });

    component.show = true;
    fixture.detectChanges();

    items = fixture.debugElement.queryAll(By.css('.ant-space-item'));
    splits = fixture.debugElement.queryAll(By.css('.ant-space-split'));

    expect(items.length).toBe(3);
    expect(splits.length).toBe(2);

    splits.forEach(item => {
      const element = item.nativeElement as HTMLElement;
      expect(element.style.marginInlineEnd).toBe('4px');
    });
  });
});

@Component({
  imports: [TriSpaceModule],
  template: `
    <tri-space [split]="showSplit ? spaceSplit : null" [size]="size" [direction]="direction" [align]="align">
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
  size: TriSpaceSize = 'small';
  direction: TriSpaceDirection = 'horizontal';
  show = false;
  align?: TriSpaceAlign;
  showSplit = false;
}
