/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TriFormModule } from 'ng-zorro-antd/form';

import { TriFormItemComponent } from './form-item.component';

describe('nz-form-item', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
  });

  it('should className correct', () => {
    const fixture = TestBed.createComponent(TriFormItemComponent);
    expect(fixture.nativeElement.classList).toContain('ant-form-item');
  });

  it('should apply item layout class', () => {
    const fixture = TestBed.createComponent(TriFormItemComponent);

    fixture.componentRef.setInput('nzLayout', 'vertical');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('ant-form-item-vertical');
    expect(fixture.nativeElement.classList).not.toContain('ant-form-item-horizontal');

    fixture.componentRef.setInput('nzLayout', 'horizontal');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('ant-form-item-horizontal');
    expect(fixture.nativeElement.classList).not.toContain('ant-form-item-vertical');
  });

  it('should support mix layout inside form', () => {
    const horizontalFixture = TestBed.createComponent(TriTestHorizontalFormWithVerticalItemComponent);
    horizontalFixture.detectChanges();

    const horizontalForm = horizontalFixture.nativeElement.querySelector('form') as HTMLFormElement;
    const horizontalItems = horizontalFixture.debugElement.queryAll(By.directive(TriFormItemComponent));

    expect(horizontalForm.classList).toContain('ant-form-horizontal');
    expect(horizontalForm.classList).not.toContain('ant-form-vertical');
    expect(horizontalItems[0].nativeElement.classList).toContain('ant-form-item-vertical');
    expect(horizontalItems[0].nativeElement.classList).not.toContain('ant-form-item-horizontal');
    expect(horizontalItems[1].nativeElement.classList).not.toContain('ant-form-item-vertical');
    expect(horizontalItems[1].nativeElement.classList).not.toContain('ant-form-item-horizontal');

    const verticalFixture = TestBed.createComponent(TriTestVerticalFormWithHorizontalItemComponent);
    verticalFixture.detectChanges();

    const verticalForm = verticalFixture.nativeElement.querySelector('form') as HTMLFormElement;
    const verticalItems = verticalFixture.debugElement.queryAll(By.directive(TriFormItemComponent));

    expect(verticalForm.classList).toContain('ant-form-vertical');
    expect(verticalForm.classList).not.toContain('ant-form-horizontal');
    expect(verticalItems[0].nativeElement.classList).toContain('ant-form-item-horizontal');
    expect(verticalItems[0].nativeElement.classList).not.toContain('ant-form-item-vertical');
    expect(verticalItems[1].nativeElement.classList).not.toContain('ant-form-item-vertical');
    expect(verticalItems[1].nativeElement.classList).not.toContain('ant-form-item-horizontal');
  });
});

@Component({
  imports: [TriFormModule],
  template: `
    <form tri-form layout="horizontal">
      <tri-form-item layout="vertical" />
      <tri-form-item />
    </form>
  `
})
export class TriTestHorizontalFormWithVerticalItemComponent {}

@Component({
  imports: [TriFormModule],
  template: `
    <form tri-form layout="vertical">
      <tri-form-item layout="horizontal" />
      <tri-form-item />
    </form>
  `
})
export class TriTestVerticalFormWithHorizontalItemComponent {}
