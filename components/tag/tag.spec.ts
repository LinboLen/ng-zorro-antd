/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriTagComponent } from './tag.component';
import { TriTagModule } from './tag.module';

describe('tag', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
  }));

  describe('basic tag', () => {
    let fixture: ComponentFixture<TriTestTagBasicComponent>;
    let testComponent: TriTestTagBasicComponent;
    let tag: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTagBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      tag = fixture.debugElement.query(By.directive(TriTagComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag');
    });

    it('should checkable work', () => {
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-checkable');
      testComponent.mode = 'checkable';
      fixture.detectChanges();
      expect(testComponent.checked).toBe(false);
      expect(testComponent.checkedChange).toHaveBeenCalledTimes(0);
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable');
      expect(tag.nativeElement.classList).not.toContain('ant-tag-checkable-checked');
      tag.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.checked).toBe(true);
      expect(testComponent.checkedChange).toHaveBeenCalledTimes(1);
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable');
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable-checked');
    });

    it('should closeable work', fakeAsync(() => {
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeNull();
      testComponent.mode = 'closeable';
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();
      tag.nativeElement.querySelector('.anticon-close').click();
      fixture.detectChanges();
      expect(testComponent.onClose).toHaveBeenCalledTimes(1);
      tick(1000);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('nz-tag')).toBeFalsy();
    }));

    it('should color work', () => {
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');
      testComponent.color = 'green';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');
      testComponent.color = '#f50';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-green');
      expect(tag.nativeElement.style.backgroundColor).toBe('rgb(255, 85, 0)');
      testComponent.color = 'green';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');
      expect(tag.nativeElement.style.backgroundColor).toBe('');
    });

    it('should status color work', () => {
      fixture.detectChanges();
      testComponent.color = 'success';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-success');
      testComponent.color = 'processing';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-processing');
      testComponent.color = 'invalid';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-invalid');
    });

    // https://github.com/NG-ZORRO/ng-zorro-antd/issues/1176
    it('should nzColor accept empty string', () => {
      testComponent.color = 'green';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');
      testComponent.color = '';
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');
      testComponent.color = undefined;
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');
    });

    it('should have bordered by default', () => {
      expect(tag.nativeElement.classList).not.toContain('ant-tag-borderless');
      testComponent.bordered = false;
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-borderless');
    });
  });

  describe('prevent tag', () => {
    let fixture: ComponentFixture<TriTestTagPreventComponent>;
    let tag: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTagPreventComponent);
      fixture.detectChanges();
      tag = fixture.debugElement.query(By.directive(TriTagComponent));
    });

    it('should close prevent default', fakeAsync(() => {
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();
      tag.nativeElement.querySelector('.anticon-close').click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();
    }));
  });

  describe('RTL', () => {
    it('should className correct on dir change', () => {
      const fixture = TestBed.createComponent(TriTestTagRtlComponent);
      const tag = fixture.debugElement.query(By.directive(TriTagComponent));
      fixture.detectChanges();
      expect(tag.nativeElement.className).toContain('ant-tag-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(tag.nativeElement.className).not.toContain('ant-tag-rtl');
    });
  });
});

@Component({
  imports: [TriTagModule],
  selector: 'tri-test-basic-tag',
  template: `
    <tri-tag
      [mode]="mode"
      [(checkedChange)]="checked"
      [color]="color"
      [bordered]="bordered"
      (checkedChange)="checkedChange($event)"
      (onClose)="onClose()"
    >
      Tag 1
    </tri-tag>
  `
})
export class TriTestTagBasicComponent {
  mode: 'default' | 'closeable' | 'checkable' = 'default';
  color: string | undefined;
  checked = false;
  bordered = true;
  onClose = jasmine.createSpy('on close');
  afterClose = jasmine.createSpy('after close');
  checkedChange = jasmine.createSpy('after close');
}

@Component({
  imports: [TriTagModule],
  template: `<tri-tag mode="closeable" (onClose)="onClose($event)">Tag 1</tri-tag>`
})
export class TriTestTagPreventComponent {
  onClose(e: MouseEvent): void {
    e.preventDefault();
  }
}

@Component({
  imports: [BidiModule, TriTestTagBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-test-basic-tag></tri-test-basic-tag>
    </div>
  `
})
export class TriTestTagRtlComponent {
  direction: Direction = 'rtl';
}
