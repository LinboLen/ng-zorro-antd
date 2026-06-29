/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { testDirectionality } from 'ng-zorro-antd/core/testing';

import { TriTagComponent } from './tag.component';
import { TriTagModule } from './tag.module';

describe('tag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
  });

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

      testComponent.mode.set('checkable');
      fixture.detectChanges();
      expect(testComponent.checked()).toBe(false);
      expect(testComponent.checkedChange).toHaveBeenCalledTimes(0);
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable');
      expect(tag.nativeElement.classList).not.toContain('ant-tag-checkable-checked');

      tag.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.checked()).toBe(true);
      expect(testComponent.checkedChange).toHaveBeenCalledTimes(1);
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable');
      expect(tag.nativeElement.classList).toContain('ant-tag-checkable-checked');
    });

    it('should closeable work', async () => {
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeNull();
      testComponent.mode.set('closeable');
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();

      tag.nativeElement.querySelector('.anticon-close').click();
      fixture.detectChanges();
      expect(testComponent.onClose).toHaveBeenCalledTimes(1);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('nz-tag')).toBeFalsy();
    });

    it('should color work', () => {
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');

      testComponent.color.set('green');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');

      testComponent.color.set('#f50');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-green');
      expect(tag.nativeElement.style.backgroundColor).toBe('rgb(255, 85, 0)');

      testComponent.color.set('green');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');
      expect(tag.nativeElement.style.backgroundColor).toBe('');
    });

    it('should status color work', () => {
      fixture.detectChanges();
      testComponent.color.set('success');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-success');

      testComponent.color.set('processing');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-processing');

      testComponent.color.set('invalid');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-invalid');
    });

    // https://github.com/NG-ZORRO/ng-zorro-antd/issues/1176
    it('should nzColor accept empty string', () => {
      testComponent.color.set('green');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).toContain('ant-tag-green');

      testComponent.color.set('');
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');

      testComponent.color.set(undefined);
      fixture.detectChanges();
      expect(tag.nativeElement.classList).not.toContain('ant-tag-has-color');
    });

    it('should have bordered by default', () => {
      expect(tag.nativeElement.classList).not.toContain('ant-tag-borderless');
      testComponent.bordered.set(false);
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

    it('should close prevent default', async () => {
      fixture.detectChanges();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();
      tag.nativeElement.querySelector('.anticon-close').click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(tag.nativeElement.querySelector('.anticon-close')).toBeDefined();
    });
  });

  testDirectionality(() => TriTestTagBasicComponent, By.directive(TriTagComponent), 'ant-tag');
});

@Component({
  imports: [TriTagModule],
  selector: 'tri-test-basic-tag',
  template: `
    <tri-tag
      [mode]="mode()"
      [(checkedChange)]="checked"
      (checkedChange)="checkedChange($event)"
      [color]="color()"
      [bordered]="bordered()"
      (onClose)="onClose()"
    >
      Tag 1
    </tri-tag>
  `
})
export class TriTestTagBasicComponent {
  readonly mode = signal<'default' | 'closeable' | 'checkable'>('default');
  readonly color = signal<string | undefined>(undefined);
  readonly checked = signal(false);
  readonly bordered = signal(true);
  onClose = vi.fn();
  afterClose = vi.fn();
  checkedChange = vi.fn();
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
