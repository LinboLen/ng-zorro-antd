/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFloatButtonComponent } from './float-button.component';
import { TriFloatButtonModule } from './float-button.module';
import { TriFloatButtonBadge, TriFloatButtonType } from './typings';

describe('float-button', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations(), provideZoneChangeDetection()]
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
      testComponent.type = 'primary';
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('.ant-float-btn > .ant-btn-primary');
      expect(view.tagName).toBe('BUTTON');
    });

    it('nzShape', () => {
      testComponent.shape = 'square';
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).toContain('ant-float-btn-square');
    });

    it('nzHref && nzTarget', () => {
      testComponent.target = '_blank';
      testComponent.href = 'https://ng.ant.design/';
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('.ant-float-btn > .ant-btn');
      expect(view.getAttribute('href') === 'https://ng.ant.design/').toBe(true);
      expect(view.getAttribute('target') === '_blank').toBe(true);
    });

    it('nzIcon', () => {
      testComponent.icon = testComponent._icon;
      fixture.detectChanges();
      const view = resultEl.nativeElement.getElementsByClassName('anticon-question-circle')[0];
      expect(view.getAttribute('nztype') === 'question-circle').toBe(true);
    });

    it('should nzIcon support passing nzType string only', () => {
      testComponent.icon = 'file-search';
      fixture.detectChanges();
      const view = resultEl.nativeElement.querySelector('nz-icon');
      expect(view.classList).toContain('anticon-file-search');
    });

    it('nzOnClick', () => {
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(testComponent.isClick).toBe(true);
    });

    it('nzBadge', () => {
      expect(resultEl.nativeElement.querySelector('.ant-badge')).toBeNull();
      expect(floatButtonComponent.badge()).toBeNull();
      testComponent.badge = { nzCount: 5 };
      fixture.detectChanges();
      expect(floatButtonComponent.badge()).toEqual({
        nzCount: 5
      });
      expect(resultEl.nativeElement.querySelector('.ant-badge')).toBeTruthy();
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestFloatButtonRtlComponent>;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFloatButtonRtlComponent);
      resultEl = fixture.debugElement.query(By.directive(TriFloatButtonComponent));
    });

    it('rtl', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).toContain('ant-float-btn-rtl');
    });
  });
});

@Component({
  selector: 'tri-test-basic-float-button',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <tri-float-button
      [icon]="icon"
      [description]="description"
      [href]="href"
      [target]="target"
      [type]="type"
      [shape]="shape"
      [badge]="badge"
      (onClick)="onClick($event)"
    />
    <ng-template #icon>
      <tri-icon type="question-circle" theme="outline" />
    </ng-template>
    <ng-template #description>HELP</ng-template>
  `
})
export class TriTestFloatButtonBasicComponent {
  href: string | null = null;
  target: string | null = null;
  type: TriFloatButtonType = 'default';
  shape: TriShapeSCType = 'circle';
  icon: string | TemplateRef<void> | null = null;
  description: TemplateRef<void> | null = null;
  badge: TriFloatButtonBadge | null = null;

  @ViewChild('icon', { static: false }) _icon!: TemplateRef<void>;
  @ViewChild('description', { static: false }) _description!: TemplateRef<void>;

  isClick: boolean = false;

  onClick(value: boolean): void {
    this.isClick = value;
  }
}

@Component({
  imports: [BidiModule, TriFloatButtonModule],
  template: `
    <div [dir]="direction">
      <tri-float-button />
    </div>
  `
})
export class TriTestFloatButtonRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
