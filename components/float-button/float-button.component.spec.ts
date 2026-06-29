/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFloatButtonComponent } from './float-button.component';
import { TriFloatButtonModule } from './float-button.module';
import { TriFloatButtonBadge, TriFloatButtonType } from './typings';

describe('float-button', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNzNoAnimation()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestFloatButtonBasicComponent>;
    let testComponent: TriTestFloatButtonBasicComponent;
    let resultEl: DebugElement;
    let floatButtonComponent: TriFloatButtonComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFloatButtonBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriFloatButtonComponent));
      floatButtonComponent = resultEl.componentInstance;
    });

    it('nzType', () => {
      testComponent.type.set('primary');
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('.ant-float-btn > .ant-btn-primary');
      expect(view.tagName).toBe('BUTTON');
    });

    it('nzShape', () => {
      testComponent.shape.set('square');
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).toContain('ant-float-btn-square');
    });

    it('nzHref && nzTarget', () => {
      testComponent.target.set('_blank');
      testComponent.href.set('https://ng.ant.design/');
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('.ant-float-btn > .ant-btn');
      expect(view.getAttribute('href') === 'https://ng.ant.design/').toBe(true);
      expect(view.getAttribute('target') === '_blank').toBe(true);
    });

    it('nzIcon', () => {
      testComponent.icon.set(testComponent._icon);
      fixture.detectChanges();
      const view = resultEl.nativeElement.getElementsByClassName('anticon-question-circle')[0];
      expect(view.getAttribute('nztype') === 'question-circle').toBe(true);
    });

    it('should nzIcon support passing nzType string only', () => {
      testComponent.icon.set('file-search');
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('nz-icon');
      expect(view.classList).toContain('anticon-file-search');
    });

    it('nzOnClick', () => {
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(testComponent.isClick()).toBe(true);
    });

    it('nzBadge', () => {
      expect(resultEl.nativeElement.querySelector('.ant-badge')).toBeNull();
      expect(floatButtonComponent.badge()).toBeNull();
      testComponent.badge.set({ nzCount: 5 });
      fixture.detectChanges();
      expect(floatButtonComponent.badge()).toEqual({
        nzCount: 5
      });
      expect(resultEl.nativeElement.querySelector('.ant-badge')).toBeTruthy();
    });
  });

  testDirectionality(() => TriTestFloatButtonBasicComponent, By.directive(TriFloatButtonComponent), 'ant-float-btn');
});

@Component({
  selector: 'tri-test-basic-float-button',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <tri-float-button
      [icon]="icon()"
      [description]="description()"
      [href]="href()"
      [target]="target()"
      [type]="type()"
      [shape]="shape()"
      [badge]="badge()"
      (onClick)="onClick($event)"
    />
    <ng-template #icon>
      <tri-icon type="question-circle" theme="outline" />
    </ng-template>
    <ng-template #description>HELP</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestFloatButtonBasicComponent {
  readonly href = signal<string | null>(null);
  readonly target = signal<string | null>(null);
  readonly type = signal<TriFloatButtonType>('default');
  readonly shape = signal<TriShapeSCType>('circle');
  readonly icon = signal<string | TemplateRef<void> | null>(null);
  readonly description = signal<TemplateRef<void> | null>(null);
  readonly badge = signal<TriFloatButtonBadge | null>(null);

  @ViewChild('icon', { static: false }) _icon!: TemplateRef<void>;
  @ViewChild('description', { static: false }) _description!: TemplateRef<void>;

  readonly isClick = signal(false);

  onClick(value: boolean): void {
    this.isClick.set(value);
  }
}
