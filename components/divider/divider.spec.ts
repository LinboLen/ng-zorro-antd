/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriDividerComponent } from './divider.component';
import { TriDividerModule } from './divider.module';

describe('divider', () => {
  let fixture: ComponentFixture<TestDividerComponent>;
  let context: TestDividerComponent;
  let dl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
    fixture = TestBed.createComponent(TestDividerComponent);
    context = fixture.componentInstance;
    dl = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('#nzDashed', () => {
    for (const value of [true, false]) {
      it(`[${value}]`, () => {
        context.dashed = value;
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-divider-dashed')) != null).toBe(value);
      });
    }
  });

  describe('#nzType', () => {
    for (const value of ['horizontal', 'vertical'] as const) {
      it(`[${value}]`, () => {
        context.type = value;
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-divider-${value}`)) != null).toBe(true);
      });
    }
  });

  describe('#nzText', () => {
    for (const item of [
      { text: 'with text', ret: true },
      { text: undefined, ret: false }
    ]) {
      it(`[${item.text}]`, () => {
        context.text = item.text;
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-divider-inner-text')) != null).toBe(item.ret);
      });
    }

    it('should be custom template', () => {
      const fixture = TestBed.createComponent(TestDividerTextTemplateComponent);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.anticon-plus')) != null).toBe(true);
    });
  });

  describe('#nzOrientation', () => {
    (['center', 'left', 'right'] as const).forEach(type => {
      it(`with ${type}`, () => {
        context.orientation = type;
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-divider-with-text-${type}`)) != null).toBe(true);
      });
    });
  });

  describe('#nzVariant', () => {
    (['dashed', 'dotted'] as const).forEach(type => {
      it(`with ${type}`, () => {
        context.comp.variant = type;
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-divider-${type}`)) != null).toBe(true);
      });
    });

    it('should have solid as default value for nzVariant', () => {
      expect(context.comp.variant).toEqual('solid');
    });
  });
});

@Component({
  imports: [TriDividerModule],
  template: `
    <tri-divider
      #comp
      [dashed]="dashed"
      [type]="type"
      [text]="text"
      [orientation]="orientation"
    ></tri-divider>
  `
})
class TestDividerComponent {
  @ViewChild('comp', { static: false }) comp!: TriDividerComponent;
  dashed = false;
  type: 'vertical' | 'horizontal' = 'horizontal';
  text?: string = 'with text';
  orientation!: 'left' | 'right' | 'center';
}

@Component({
  imports: [TriDividerModule, TriIconModule],
  template: `
    <tri-divider dashed [text]="text">
      <ng-template #text>
        <tri-icon type="plus" />
        Add
      </ng-template>
    </tri-divider>
  `
})
class TestDividerTextTemplateComponent {}
