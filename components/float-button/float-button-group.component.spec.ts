/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { TriFourDirectionType, TriShapeSCType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFloatButtonGroupComponent } from './float-button-group.component';
import { TriFloatButtonModule } from './float-button.module';

describe('nz-float-button-group', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  });

  describe('basic', () => {
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
      testComponent.shape.set('square');
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
      testComponent.trigger.set('hover');
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-float-btn')[0].dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
      expect(testComponent.isClick()).toBe(true);
      resultEl.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
      expect(testComponent.isClick()).toBe(false);
    });

    it('nzTrigger click', () => {
      testComponent.trigger.set('click');
      fixture.detectChanges();
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
      expect(testComponent.isClick()).toBe(true);
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
      expect(testComponent.isClick()).toBe(false);
    });

    it('nzOpen true', () => {
      testComponent.open.set(true);
      testComponent.trigger.set('click');
      fixture.detectChanges();
      const openChangeSpy = vi.spyOn(groupComponent.openChange, 'emit');
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(true);
      expect(openChangeSpy).toHaveBeenCalledWith(false);
      expect(openChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('nzOpen false', () => {
      testComponent.open.set(false);
      testComponent.trigger.set('click');
      fixture.detectChanges();
      const openChangeSpy = vi.spyOn(groupComponent.openChange, 'emit');
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(resultEl.nativeElement.getElementsByClassName('anticon')[0].getAttribute('nztype') === 'close').toBe(
        false
      );
      expect(openChangeSpy).toHaveBeenCalledWith(true);
      expect(openChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('nzOpenChange should emit in controlled mode', () => {
      testComponent.open.set(true);
      testComponent.trigger.set('click');
      fixture.detectChanges();
      const openChangeSpy = vi.spyOn(groupComponent.openChange, 'emit');
      resultEl.nativeElement.getElementsByClassName('ant-btn')[0].dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(openChangeSpy).toHaveBeenCalledWith(false);
    });

    describe('float-button-group placement', () => {
      it('should set correct class for nzPlacement top', () => {
        testComponent.trigger.set('click');
        testComponent.placement.set('top');
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-top');
        // is not menu mode
        testComponent.trigger.set(null);
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-top');
      });

      it('should set correct class for nzPlacement bottom', () => {
        testComponent.trigger.set('click');
        testComponent.placement.set('bottom');
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-bottom');
        // is not menu mode
        testComponent.trigger.set(null);
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-bottom');
      });

      it('should set correct class for nzPlacement left', () => {
        testComponent.trigger.set('click');
        testComponent.placement.set('left');
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-left');
        // is not menu mode
        testComponent.trigger.set(null);
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-left');
      });

      it('should set correct class for nzPlacement right', () => {
        testComponent.trigger.set('click');
        testComponent.placement.set('right');
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).toContain('ant-float-btn-group-right');
        // is not menu mode
        testComponent.trigger.set(null);
        fixture.detectChanges();
        expect(resultEl.nativeElement.classList).not.toContain('ant-float-btn-group-right');
      });

      it('should get correct animation class according to nzPlacement', () => {
        fixture.detectChanges();
        // @ts-ignore
        const { enterAnimation, leaveAnimation } = groupComponent;
        expect(enterAnimation()).toBe('ant-float-btn-enter-top');
        expect(leaveAnimation()).toBe('ant-float-btn-leave-top');
        testComponent.placement.set('right');
        fixture.detectChanges();
        expect(enterAnimation()).toBe('ant-float-btn-enter-right');
        expect(leaveAnimation()).toBe('ant-float-btn-leave-right');
      });
    });
  });

  testDirectionality(
    () => TriTestFloatButtonGroupBasicComponent,
    By.directive(TriFloatButtonGroupComponent),
    'ant-float-btn-group'
  );
});

@Component({
  selector: 'tri-test-basic-float-button-group',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <tri-float-button-group
      icon="question-circle"
      [shape]="shape()"
      [trigger]="trigger()"
      [open]="open()"
      [placement]="placement()"
      (onOpenChange)="onClick($event)"
    />
  `
})
export class TriTestFloatButtonGroupBasicComponent {
  readonly shape = signal<TriShapeSCType>('circle');
  readonly trigger = signal<'click' | 'hover' | null>(null);
  readonly open = signal<boolean | null>(null);
  readonly placement = signal<TriFourDirectionType>('top');

  readonly isClick = signal(false);

  onClick(value: boolean): void {
    this.isClick.set(value);
  }
}
