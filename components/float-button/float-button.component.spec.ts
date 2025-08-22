/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFloatButtonComponent } from './float-button.component';
import { TriFloatButtonModule } from './float-button.module';

describe('nz-float-button', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  }));

  describe('float-button basic', () => {
    let fixture: ComponentFixture<TriTestFloatButtonBasicComponent>;
    let testComponent: TriTestFloatButtonBasicComponent;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFloatButtonBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriFloatButtonComponent));
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
      const view = resultEl.nativeElement.getElementsByClassName('anticon-question-circle')[0];
      expect(view.getAttribute('nztype') === 'file-search').toBe(true);
    });

    it('nzOnClick', () => {
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(testComponent.isClick).toBe(true);
    });
  });
});

describe('nz-float-button RTL', () => {
  let fixture: ComponentFixture<TriTestFloatButtonRtlComponent>;
  let resultEl: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
    fixture = TestBed.createComponent(TriTestFloatButtonRtlComponent);
    resultEl = fixture.debugElement.query(By.directive(TriFloatButtonComponent));
  }));

  it('rtl', () => {
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-float-btn-rtl');
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
      (onClick)="onClick($event)"
    ></tri-float-button>
    <ng-template #icon>
      <tri-icon type="question-circle" theme="outline" />
    </ng-template>
    <ng-template #description>HELP</ng-template>
  `
})
export class TriTestFloatButtonBasicComponent {
  href: string | null = null;
  target: string | null = null;
  type: 'default' | 'primary' = 'default';
  shape: 'circle' | 'square' = 'circle';
  icon: string | TemplateRef<void> | null = null;
  description: TemplateRef<void> | null = null;

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
      <tri-float-button></tri-float-button>
    </div>
  `
})
export class TriTestFloatButtonRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
