/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer, ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, Provider, Type, ViewChild, inject } from '@angular/core';
import { ComponentFixture, inject as testingInject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import {
  createKeyboardEvent,
  createMouseEvent,
  dispatchEvent,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';
import { TriMenuModule } from 'ng-zorro-antd/menu';

import { TriContextMenuService } from './context-menu.service';
import { TriDropdownMenuComponent } from './dropdown-menu.component';
import { TriDropdownModule } from './dropdown.module';

describe('context-menu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation(), ...providers]
    });

    testingInject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(
    testingInject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    })
  );

  async function stabilize<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await updateNonSignalsInput(fixture);
    fixture.detectChanges();
  }

  it('should create dropdown', async () => {
    const fixture = createComponent(TriTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    const fakeEvent = createMouseEvent('contextmenu', 300, 300);
    const component = fixture.componentInstance;
    const viewRef = component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    expect(viewRef).toBeTruthy();
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');
  });

  it('should only one dropdown exist', async () => {
    const fixture = createComponent(TriTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    let fakeEvent = createMouseEvent('contextmenu', 0, 0);
    const component = fixture.componentInstance;
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');

    fakeEvent = createMouseEvent('contextmenu', window.innerWidth, window.innerHeight);
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');
  });

  it('should dropdown close when scroll', async () => {
    const scrolledSubject = new Subject<void>();
    const fixture = createComponent(TriTestDropdownContextMenuComponent, [
      { provide: ScrollDispatcher, useFactory: () => ({ scrolled: () => scrolledSubject }) }
    ]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    const fakeEvent = createMouseEvent('contextmenu', 0, 0);
    const component = fixture.componentInstance;
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');

    scrolledSubject.next();
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toBe('');
  });

  it('should backdrop work with click', async () => {
    const fixture = createComponent(TriTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    const fakeEvent = createMouseEvent('contextmenu', 300, 300);
    const component = fixture.componentInstance;
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');

    document.body.click();
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toBe('');
  });

  it('should backdrop work with keyboard event ESCAPE', async () => {
    const fixture = createComponent(TriTestDropdownContextMenuComponent);
    const keyboardEvent = createKeyboardEvent('keydown', ESCAPE, undefined, 'Escape');
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    const fakeEvent = createMouseEvent('contextmenu', 300, 300);
    const component = fixture.componentInstance;
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toContain('1st menu item');

    dispatchEvent(document.body, keyboardEvent);
    await stabilize(fixture);
    expect(overlayContainerElement.textContent).toBe('');
  });

  it('should not call the method close if the overlay is clicked inside', async () => {
    const fixture = createComponent(TriTestDropdownContextMenuComponent);
    fixture.detectChanges();
    const fakeEvent = createMouseEvent('contextmenu', 300, 300);
    const component = fixture.componentInstance;
    component.contextMenuService.create(fakeEvent, component.dropdownMenuComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const closeSpy = vi.spyOn(component.contextMenuService, 'close');
    overlayContainerElement.querySelector('ul')!.click();
    expect(closeSpy).toHaveBeenCalledTimes(0);
    document.body.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});

@Component({
  imports: [TriDropdownModule, TriMenuModule],
  template: `
    <tri-dropdown-menu>
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-item>3rd menu item</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriTestDropdownContextMenuComponent {
  public readonly contextMenuService = inject(TriContextMenuService);

  @ViewChild(TriDropdownMenuComponent, { static: true }) dropdownMenuComponent!: TriDropdownMenuComponent;
}
