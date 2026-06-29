/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal, ViewChild } from '@angular/core';
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
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
    fixture = TestBed.createComponent(TestDividerComponent);
    context = fixture.componentInstance;
    dl = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('#nzDashed', () => {
    for (const value of [true, false]) {
      it(`[${value}]`, () => {
        context.dashed.set(value);
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-divider-dashed')) != null).toBe(value);
      });
    }
  });

  describe('#nzType', () => {
    for (const value of ['horizontal', 'vertical'] as const) {
      it(`[${value}]`, () => {
        context.type.set(value);
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
        context.text.set(item.text);
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-divider-inner-text')) != null).toBe(item.ret);
      });
    }

    it('should be custom template', () => {
      const fixture = TestBed.createComponent(TestDividerTextTemplateComponent);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.anticon-plus'))).not.toBeNull();
    });
  });

  describe('#nzOrientation', () => {
    (['center', 'left', 'right'] as const).forEach(type => {
      it(`with ${type}`, () => {
        context.orientation.set(type);
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-divider-with-text-${type}`))).not.toBeNull();
      });
    });
  });

  describe('#nzVariant', () => {
    (['dashed', 'dotted'] as const).forEach(type => {
      it(`with ${type}`, () => {
        context.variant.set(type);
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-divider-${type}`))).not.toBeNull();
      });
    });

    it('should have solid as default value for nzVariant', () => {
      expect(context.comp.variant).toEqual('solid');
    });
  });

  describe('#nzPlain', () => {
    for (const value of [true, false]) {
      it(`[${value}]`, () => {
        context.plain.set(value);
        fixture.detectChanges();
        expect(dl.query(By.css('.ant-divider-plain')) != null).toBe(value);
      });
    }
  });

  describe('#nzSize', () => {
    it('should not have size class by default', () => {
      fixture.detectChanges();
      const el = dl.query(By.css('.ant-divider'))!.nativeElement as HTMLElement;
      expect(el.classList.contains('ant-divider-sm')).toBe(false);
      expect(el.classList.contains('ant-divider-md')).toBe(false);
      expect(el.classList.contains('ant-divider-lg')).toBe(false);
    });

    (['small', 'middle', 'large'] as const).forEach(size => {
      it(`with ${size}`, () => {
        context.size.set(size);
        fixture.detectChanges();
        const el = dl.query(By.css('.ant-divider'))!.nativeElement as HTMLElement;
        expect(el.classList.contains('ant-divider-sm')).toBe(size === 'small');
        expect(el.classList.contains('ant-divider-md')).toBe(size === 'middle');
        // Large size does not have a specific class; ensure no lg class is added
        expect(el.classList.contains('ant-divider-lg')).toBe(false);
      });
    });
  });

  describe('#with text class', () => {
    it('should have ant-divider-with-text when nzText set', () => {
      context.text.set('text');
      fixture.detectChanges();
      expect(dl.query(By.css('.ant-divider-with-text'))).not.toBeNull();
    });

    it('should not have ant-divider-with-text when nzText removed', () => {
      context.text.set(undefined);
      fixture.detectChanges();
      expect(dl.query(By.css('.ant-divider-with-text'))).toBeNull();
    });
  });
});

@Component({
  imports: [TriDividerModule],
  template: `
    <tri-divider
      #comp
      [dashed]="dashed()"
      [type]="type()"
      [text]="text()"
      [orientation]="orientation()"
      [variant]="variant()"
      [plain]="plain()"
      [size]="size()"
    />
  `
})
class TestDividerComponent {
  @ViewChild('comp', { static: false }) comp!: TriDividerComponent;
  readonly dashed = signal(false);
  readonly type = signal<'vertical' | 'horizontal'>('horizontal');
  readonly text = signal<string | undefined>('with text');
  readonly orientation = signal<'left' | 'right' | 'center'>('center');
  readonly variant = signal<'dashed' | 'dotted' | 'solid'>('solid');
  readonly plain = signal(false);
  readonly size = signal<'small' | 'middle' | 'large' | undefined>(undefined);
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
