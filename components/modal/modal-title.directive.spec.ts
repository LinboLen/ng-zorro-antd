/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriModalRef } from './modal-ref';
import { TriModalTitleDirective } from './modal-title.directive';
import { TriModalComponent } from './modal.component';
import { TriModalModule } from './modal.module';
import { TriModalService } from './modal.service';

describe('modal title directive', () => {
  let overlayContainer: OverlayContainer;
  let fixture: ComponentFixture<TestDirectiveTitleComponent>;
  let testComponent: TestDirectiveTitleComponent;
  let modalService: TriModalService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TriModalService, provideNoopAnimations()]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDirectiveTitleComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([OverlayContainer, TriModalService], (oc: OverlayContainer, m: TriModalService) => {
    overlayContainer = oc;
    modalService = m;
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should work with template', () => {
    testComponent.showModal();
    fixture.detectChanges();
    expect(testComponent.isVisible).toBe(true);
    const modalRef = testComponent.modalComponent.getModalRef();
    expect(modalRef!.getConfig().title).toEqual(testComponent.modalTitleDirective);

    testComponent.handleCancel();
    fixture.detectChanges();
  });

  it('should work with template when init opened', fakeAsync(() => {
    const initOpenedComponentFixture = TestBed.createComponent(TestDirectiveTitleWithInitOpenedComponent);
    const initOpenedComponent = initOpenedComponentFixture.componentInstance;
    initOpenedComponentFixture.detectChanges();
    expect(initOpenedComponent.isVisible).toBe(true);
    flush();
    initOpenedComponentFixture.detectChanges();
    const modalRef = initOpenedComponent.modalComponent.getModalRef();

    expect(modalRef!.getConfig().title).toEqual(initOpenedComponent.modalTitleDirective);

    initOpenedComponentFixture.detectChanges();
  }));

  it('should work with service', () => {
    const modalRef = modalService.create({ content: TestDirectiveTitleInServiceComponent, title: '' });
    fixture.detectChanges();

    expect(modalRef.componentInstance!.nzModalRef).toBe(modalRef);
    expect(modalRef.componentInstance!.NzModalTitleDirective).toEqual(modalRef.getConfig().title as TemplateRef<{}>);
  });
});

@Component({
  imports: [TriModalModule],
  template: `
    <tri-modal [(visibleChange)]="isVisible" (onCancel)="handleCancel()">
      <div>
        <p>Modal Content</p>
      </div>
      <div *modalTitle>Custom Modal Title</div>
    </tri-modal>
  `
})
class TestDirectiveTitleComponent {
  isVisible = false;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDirective!: TemplateRef<TriSafeAny>;

  handleCancel(): void {
    this.isVisible = false;
  }

  showModal(): void {
    this.isVisible = true;
  }
}

@Component({
  imports: [TriModalModule],
  template: `
    <tri-modal [(visibleChange)]="isVisible">
      <div>
        <p>Modal Content</p>
      </div>
      <div *modalTitle>Custom Modal Title</div>
    </tri-modal>
  `
})
class TestDirectiveTitleWithInitOpenedComponent {
  isVisible = true;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDirective!: TemplateRef<TriSafeAny>;
}

@Component({
  imports: [TriModalModule],
  template: `<div *modalTitle>Custom Modal Title</div>`
})
class TestDirectiveTitleInServiceComponent {
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) NzModalTitleDirective!: TemplateRef<TriSafeAny>;

  constructor(public nzModalRef: TriModalRef) {}

  handleCancel(): void {
    this.nzModalRef.close();
  }
}
