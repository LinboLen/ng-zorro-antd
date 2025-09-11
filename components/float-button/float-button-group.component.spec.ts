/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriFourDirectionType, TriShapeSCType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFloatButtonGroupComponent } from './float-button-group.component';
import { TriFloatButtonModule } from './float-button.module';

describe('nz-float-button-group', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideNzIconsTesting()]
    });
  }));

  describe('float-button-group basic', () => {
    let fixture: ComponentFixture<TriTestFloatButtonGroupBasicComponent>;
    let testComponent: TriTestFloatButtonGroupBasicComponent;
    let resultEl: DebugElement;
    let groupComponent: TriFloatButtonGroupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFloatButtonGroupBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriFloatButtonGroupComponent));
      groupComponent = resultEl.componentInstance;
    });

    it('basic', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-circle');
    });

    it('nzShape', () => {
      testComponent.shape = 'square';
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-square');
      const innerButtons = [
        ...groupComponent.floatButtonComponents(),
        ...groupComponent.floatButtonTopComponents()
      ];
      innerButtons.forEach(btn => {
        expect(btn._shape()).toBe('square');
      });
    });

    it('nzTrigger hover', () => {
      testComponent.trigger = 'hover';
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-float-btn')[0].dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
      expect(testComponent.isClick).toBe(true);
      resultEl.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
      expect(testComponent.isClick).toBe(false);
    });

    it('nzTrigger click', () => {
      testComponent.trigger = 'click';
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
      expect(testComponent.isClick).toBe(true);
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
      expect(testComponent.isClick).toBe(false);
    });

    it('nzOpen true', () => {
      testComponent.open = true;
      testComponent.trigger = 'click';
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
    });

    it('nzOpen false', () => {
      testComponent.open = false;
      testComponent.trigger = 'click';
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
    });

    describe('float-button-group placement', () => {
      it('should set correct class for nzPlacement top', () => {
        testComponent.trigger = 'click';
        testComponent.placement = 'top';
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-top');
        // is not menu mode
        testComponent.trigger = null;
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-top');
      });

      it('should set correct class for nzPlacement bottom', () => {
        testComponent.trigger = 'click';
        testComponent.placement = 'bottom';
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-bottom');
        // is not menu mode
        testComponent.trigger = null;
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-bottom');
      });

      it('should set correct class for nzPlacement left', () => {
        testComponent.trigger = 'click';
        testComponent.placement = 'left';
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-left');
        // is not menu mode
        testComponent.trigger = null;
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-left');
      });

      it('should set correct class for nzPlacement right', () => {
        testComponent.trigger = 'click';
        testComponent.placement = 'right';
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-right');
        // is not menu mode
        testComponent.trigger = null;
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-right');
      });
    });
  });
});

describe('nz-float-button-group RTL', () => {
  let fixture: ComponentFixture<TriTestFloatButtonRtlComponent>;
  let resultEl: DebugElement;
  let groupComponent: TriFloatButtonGroupComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideNzIconsTesting()]
    });
    fixture = TestBed.createComponent(TriTestFloatButtonRtlComponent);
    resultEl = fixture.debugElement.query(By.directive(TriFloatButtonGroupComponent));
    groupComponent = resultEl.componentInstance;
  }));

  it('rtl', () => {
    fixture.detectChanges();
    // @ts-ignore
    expect(groupComponent.dir()).toBe('rtl');
    expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-rtl');
  });
});

@Component({
  selector: 'tri-test-basic-float-button-group',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <tri-float-button-group
      icon="question-circle"
      [shape]="shape"
      [trigger]="trigger"
      [open]="open"
      [placement]="placement"
      (onOpenChange)="onClick($event)"
    >
    </tri-float-button-group>
  `
})
export class TriTestFloatButtonGroupBasicComponent {
  shape: TriShapeSCType = 'circle';
  trigger: 'click' | 'hover' | null = null;
  open: boolean | null = null;
  placement: TriFourDirectionType = 'top';

  isClick: boolean = false;

  onClick(value: boolean): void {
    this.isClick = value;
  }
}

@Component({
  imports: [BidiModule, TriFloatButtonModule],
  template: `
    <div [dir]="direction">
      <tri-float-button-group></tri-float-button-group>
    </div>
  `
})
export class TriTestFloatButtonRtlComponent {
  direction: Direction = 'rtl';
}
