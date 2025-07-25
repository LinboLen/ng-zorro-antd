/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TriAutoFocusType } from 'ng-zorro-antd/popconfirm/popconfirm';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm/popconfirm.module';

import { TriPopConfirmButtonProps } from './popconfirm-option';

describe('NzPopconfirm', () => {
  let fixture: ComponentFixture<TriPopconfirmTestNewComponent>;
  let component: TriPopconfirmTestNewComponent;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriPopconfirmTestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getTitleText(): Element | null {
    return overlayContainerElement.querySelector('.ant-popover-message-title');
  }

  function getTooltipTrigger(index: number): HTMLButtonElement {
    return overlayContainerElement.querySelectorAll('.ant-popover-buttons button')[index] as HTMLButtonElement;
  }

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  it('should support custom icon', fakeAsync(() => {
    component.icon = 'question-circle';
    const triggerElement = component.iconTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.anticon-exclamation-circle')).toBeFalsy();
  }));

  it('should nzOk work', () => {
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTooltipTrigger(0).textContent).toContain('cancel-text');
    expect(getTooltipTrigger(1).textContent).toContain('ok-text');
    expect(getTooltipTrigger(1).classList).not.toContain('ant-btn-primary');
  });

  it('should support nzOkType danger case', () => {
    component.okType = 'danger';
    fixture.detectChanges();

    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();

    expect(getTooltipTrigger(1).classList).toContain('ant-btn-dangerous');
    expect(getTooltipTrigger(1).classList).toContain('ant-btn-primary');
  });

  it('should support nzOkDisabled case', () => {
    component.okDisabled = true;
    fixture.detectChanges();

    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();

    expect(getTooltipTrigger(1).disabled).toBeTrue();
  });

  it('should support nzOkButtonProps', () => {
    fixture.detectChanges();
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    component.okButtonProps.update(props => ({ ...props, nzDisabled: true }));
    fixture.detectChanges();
    expect(getTooltipTrigger(1).disabled).toBeTrue();
  });

  it('should support nzCancelButtonProps and disabled the cancel button', () => {
    fixture.detectChanges();
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    expect(getTooltipTrigger(0).disabled).toBeFalse();
    component.cancelButtonProps.update(props => ({ ...props, nzDisabled: true }));
    fixture.detectChanges();
    expect(getTooltipTrigger(0).disabled).toBeTrue();
  });

  it('should support nzCancelButtonProps and support danger on close button', () => {
    fixture.detectChanges();
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    component.cancelButtonProps.update(props => ({ ...props, nzDanger: true }));
    fixture.detectChanges();
    expect(getTooltipTrigger(0).classList).toContain('ant-btn-dangerous');
  });

  it('should cancel work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()!.textContent).toContain('title-string');
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    dispatchMouseEvent(getTooltipTrigger(0), 'click');
    waitingForTooltipToggling();
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(1);
    expect(getTitleText()).toBeNull();
  }));

  it('should confirm work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()!.textContent).toContain('title-string');
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    dispatchMouseEvent(getTooltipTrigger(1), 'click');
    waitingForTooltipToggling();
    expect(component.confirm).toHaveBeenCalledTimes(1);
    expect(component.cancel).toHaveBeenCalledTimes(0);
    expect(getTitleText()).toBeNull();
  }));

  it('should autofocus work', fakeAsync(() => {
    let focusElement;

    focusElement = fixture.debugElement.query(By.css(':focus'));
    expect(focusElement).toBeNull();

    component.autoFocus = 'cancel';
    fixture.detectChanges();
    focusElement = fixture.debugElement.query(By.css(':focus'));
    expect(focusElement?.nativeElement).toBe(getTooltipTrigger(0));

    component.autoFocus = 'ok';
    fixture.detectChanges();
    focusElement = fixture.debugElement.query(By.css(':focus'));
    expect(focusElement?.nativeElement).toBe(getTooltipTrigger(1));
  }));

  it('should condition work', fakeAsync(() => {
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    component.condition = true;
    fixture.detectChanges();
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()).toBeNull();
    expect(component.confirm).toHaveBeenCalledTimes(1);
    expect(component.cancel).toHaveBeenCalledTimes(0);
  }));

  it('should before confirm work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()!.textContent).toContain('title-string');
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    component.beforeConfirm = () => false;
    fixture.detectChanges();

    dispatchMouseEvent(getTooltipTrigger(1), 'click');
    waitingForTooltipToggling();
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);
    expect(getTitleText()!.textContent).toContain('title-string');
  }));

  it('should before confirm observable work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()!.textContent).toContain('title-string');
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    component.beforeConfirm = () =>
      new Observable(observer => {
        setTimeout(() => {
          observer.next(true);
          observer.complete();
        }, 200);
      });

    dispatchMouseEvent(getTooltipTrigger(1), 'click');
    tick(200 + 10);
    waitingForTooltipToggling();
    expect(getTitleText()).toBeNull();
    expect(component.confirm).toHaveBeenCalledTimes(1);
    expect(component.cancel).toHaveBeenCalledTimes(0);
  }));

  it('should before confirm promise work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(getTitleText()!.textContent).toContain('title-string');
    expect(component.confirm).toHaveBeenCalledTimes(0);
    expect(component.cancel).toHaveBeenCalledTimes(0);

    component.beforeConfirm = () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      });

    dispatchMouseEvent(getTooltipTrigger(1), 'click');
    tick(200 + 10);
    waitingForTooltipToggling();
    expect(getTitleText()).toBeNull();
    expect(component.confirm).toHaveBeenCalledTimes(1);
    expect(component.cancel).toHaveBeenCalledTimes(0);
  }));

  it('should nzPopconfirmShowArrow work', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');

    component.popconfirmShowArrow = false;
    fixture.detectChanges();
    expect(overlayContainerElement.querySelector('.ant-popover-arrow')).toBeFalsy();

    component.popconfirmShowArrow = true;
    fixture.detectChanges();
    expect(overlayContainerElement.querySelector('.ant-popover-arrow')).toBeTruthy();
  }));

  it('should nzPopconfirmBackdrop work', fakeAsync(() => {
    component.popconfirmBackdrop = true;
    fixture.detectChanges();
    const triggerElement = component.stringTemplate.nativeElement;
    dispatchMouseEvent(triggerElement, 'click');
    fixture.detectChanges();
    expect(overlayContainerElement.children[0].classList).toContain('cdk-overlay-backdrop');
  }));

  it('should change overlayClass when the nzPopconfirmOverlayClassName is changed', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;

    dispatchMouseEvent(triggerElement, 'click');
    waitingForTooltipToggling();

    component.class = 'testClass2';
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector<HTMLElement>('.testClass')).toBeNull();
    expect(overlayContainerElement.querySelector<HTMLElement>('.testClass2')).not.toBeNull();
  }));

  it('should nzPopconfirmOverlayClassName support classes listed in the string (space delimited)', fakeAsync(() => {
    const triggerElement = component.stringTemplate.nativeElement;
    component.class = 'testClass1 testClass2';

    dispatchMouseEvent(triggerElement, 'click');
    waitingForTooltipToggling();

    expect(overlayContainerElement.querySelector('.testClass1.testClass2')).not.toBeNull();
  }));
});

@Component({
  imports: [TriPopconfirmModule],
  template: `
    <a
      tri-popconfirm
      #stringTemplate
      popconfirmTitle="title-string"
      okText="ok-text"
      [okType]="okType"
      [okDisabled]="okDisabled"
      cancelText="cancel-text"
      [autofocus]="autoFocus"
      [condition]="condition"
      [beforeConfirm]="beforeConfirm"
      [popconfirmShowArrow]="popconfirmShowArrow"
      [popconfirmBackdrop]="popconfirmBackdrop"
      [popconfirmOverlayClassName]="class"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
      [okButtonProps]="okButtonProps()"
      [cancelButtonProps]="cancelButtonProps()"
    >
      Delete
    </a>
    <a
      tri-popconfirm
      #templateTemplate
      [icon]="icon"
      [popconfirmTitle]="titleTemplate"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
    >
      Delete
    </a>

    <a tri-popconfirm #iconTemplate [icon]="icon">Delete</a>

    <ng-template #titleTemplate>title-template</ng-template>
  `
})
export class TriPopconfirmTestNewComponent {
  confirm = jasmine.createSpy('confirm');
  cancel = jasmine.createSpy('cancel');
  condition = false;
  okType: string = 'default';
  okDisabled: boolean = false;
  cancelText = 'Cancel';
  okText = 'Ok';
  okButtonProps = signal<TriPopConfirmButtonProps>({ nzDisabled: false });
  cancelButtonProps = signal<TriPopConfirmButtonProps>({ nzDisabled: false });
  popconfirmShowArrow = true;
  icon: string | undefined = undefined;
  popconfirmBackdrop = false;
  autoFocus: TriAutoFocusType = null;
  beforeConfirm?: () => Observable<boolean> | Promise<boolean> | boolean = undefined;

  @ViewChild('stringTemplate', { static: false }) stringTemplate!: ElementRef;
  @ViewChild('templateTemplate', { static: false }) templateTemplate!: ElementRef;
  @ViewChild('iconTemplate', { static: false }) iconTemplate!: ElementRef;

  visible = false;
  class = 'testClass';
}
