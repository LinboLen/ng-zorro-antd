/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { dispatchFakeEvent, dispatchKeyboardEvent } from 'ng-zorro-antd/core/testing';
import { TriPlacementType } from 'ng-zorro-antd/dropdown/dropdown-menu.component';
import { TriMenuModule } from 'ng-zorro-antd/menu';

import { TriDropDownDirective } from './dropdown.directive';
import { TriDropDownModule } from './dropdown.module';

describe('dropdown', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers
    });

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should hover correct', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownComponent);
    fixture.componentInstance.trigger = 'hover';
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
      dispatchFakeEvent(dropdownElement, 'mouseenter');
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
    }).not.toThrowError();
  }));
  it('should click correct', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownComponent);
    fixture.componentInstance.trigger = 'click';
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
      dispatchFakeEvent(dropdownElement, 'click');
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
    }).not.toThrowError();
  }));
  it('should disabled work', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
      dispatchFakeEvent(dropdownElement, 'mouseenter');
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toBe('');
    }).not.toThrowError();
  }));

  describe('when nzBackdrop=true', () => {
    let fixture: ComponentFixture<TriTestDropdownComponent>;

    beforeEach(() => {
      fixture = createComponent(TriTestDropdownComponent);
      fixture.componentInstance.backdrop = true;
    });

    it('should disappear if invisible backdrop clicked if nzTrigger=click', fakeAsync(() => {
      fixture.componentInstance.trigger = 'click';
      fixture.detectChanges();

      expect(() => {
        const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
        dispatchFakeEvent(dropdownElement, 'click');

        tick(1000);
        fixture.detectChanges();

        const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();

        dispatchFakeEvent(backdrop as Element, 'click');
        tick(1000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeNull();
      }).not.toThrowError();
    }));
  });

  it('should disappear if Escape pressed', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownComponent);
    fixture.componentInstance.trigger = 'click';
    fixture.componentInstance.backdrop = true;
    fixture.detectChanges();

    expect(() => {
      const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;

      dispatchFakeEvent(dropdownElement, 'click');
      tick(1000);
      fixture.detectChanges();

      const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop');
      expect(backdrop).not.toBeNull();

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      tick(1000);
      fixture.detectChanges();

      const nullBackdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop');
      expect(nullBackdrop).toBeNull();
    }).not.toThrowError();
  }));
  it('should nzOverlayClassName and nzOverlayStyle work', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownComponent);
    fixture.detectChanges();
    expect(() => {
      const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
      dispatchFakeEvent(dropdownElement, 'mouseenter');
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.ant-dropdown')!.classList).toContain('custom-class');
      expect(overlayContainerElement.querySelector<HTMLElement>('.ant-dropdown')!.style.color).toBe('rgb(0, 0, 0)');
    }).not.toThrowError();
  }));
  it('should nzVisible & nzClickHide work', fakeAsync(() => {
    const fixture = createComponent(TriTestDropdownVisibleComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledTimes(0);
    const dropdownElement = fixture.debugElement.query(By.directive(TriDropDownDirective)).nativeElement;
    dispatchFakeEvent(dropdownElement, 'mouseenter');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledWith(true);
    expect(overlayContainerElement.textContent).toContain('Clicking me will not close the menu.');
    dispatchFakeEvent(overlayContainerElement.querySelector('.first-menu')!, 'click');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledWith(true);
    expect(overlayContainerElement.textContent).toContain('Clicking me will not close the menu.');
    dispatchFakeEvent(overlayContainerElement.querySelector('.second-menu')!, 'click');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledTimes(1);
    expect(overlayContainerElement.textContent).toContain('Clicking me will not close the menu.');
    dispatchFakeEvent(overlayContainerElement.querySelector('.close-menu')!, 'click');
    fixture.detectChanges();
    tick(2000);
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerVisible).toHaveBeenCalledTimes(1);
  }));
});

@Component({
  imports: [TriDropDownModule, TriMenuModule],
  template: `
    <a
      tri-dropdown
      [dropdownMenu]="menu"
      [trigger]="trigger"
      [disabled]="disabled"
      [placement]="placement"
      [backdrop]="backdrop"
      [overlayClassName]="className"
      [overlayStyle]="overlayStyle"
    >
      Trigger
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-item>3rd menu item</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriTestDropdownComponent {
  backdrop = false;
  trigger: 'click' | 'hover' = 'hover';
  placement: TriPlacementType = 'bottomLeft';
  disabled = false;
  className = 'custom-class';
  overlayStyle = { color: '#000' };
}

@Component({
  imports: [TriDropDownModule, TriMenuModule],
  template: `
    <a
      tri-dropdown
      [dropdownMenu]="menu"
      [clickHide]="false"
      [(visibleChange)]="visible"
      (visibleChange)="triggerVisible($event)"
    >
      Hover me
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item class="first-menu">Clicking me will not close the menu.</li>
        <li tri-menu-item class="second-menu">Clicking me will not close the menu also.</li>
        <li tri-menu-item (click)="visible = false" class="close-menu">Clicking me will close the menu</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriTestDropdownVisibleComponent {
  visible = false;
  triggerVisible = jasmine.createSpy('visibleChange');
}
