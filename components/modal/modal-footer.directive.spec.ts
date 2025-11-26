/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriModalFooterDirective } from './modal-footer.directive';
import { TriModalRef } from './modal-ref';
import { TriModalComponent } from './modal.component';
import { TriModalModule } from './modal.module';
import { TriModalService } from './modal.service';

describe('modal footer directive', () => {
  let overlayContainer: OverlayContainer;
  let fixture: ComponentFixture<TestDirectiveFooterComponent>;
  let testComponent: TestDirectiveFooterComponent;
  let modalService: TriModalService;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [TriModalService, provideNoopAnimations(), provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDirectiveFooterComponent);
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
    expect(modalRef!.getConfig().footer).toEqual(testComponent.modalFooterDirective);

    testComponent.handleCancel();
    fixture.detectChanges();
  });

  it('should work with template when init opened', fakeAsync(() => {
    const initOpenedComponentFixture = TestBed.createComponent(TestDirectiveFooterWithInitOpenedComponent);
    const initOpenedComponent = initOpenedComponentFixture.componentInstance;
    initOpenedComponentFixture.detectChanges();
    expect(initOpenedComponent.isVisible).toBe(true);
    flush();
    initOpenedComponentFixture.detectChanges();
    const modalRef = initOpenedComponent.modalComponent.getModalRef();

    expect(modalRef!.getConfig().footer).toEqual(initOpenedComponent.modalFooterDirective);

    initOpenedComponentFixture.detectChanges();
  }));

  it('should work with service', () => {
    const modalRef = modalService.create({ content: TestDirectiveFooterInServiceComponent, footer: null });
    fixture.detectChanges();

    expect(modalRef.componentInstance!.nzModalRef).toBe(modalRef);
    expect(modalRef.componentInstance!.modalFooterDirective).toEqual(
      modalRef.getConfig().footer as TemplateRef<{}>
    );
  });
});

@Component({
  imports: [TriModalModule, TriButtonModule],
  template: `
    <tri-modal [(visibleChange)]="isVisible" title="Custom Modal Title" (onCancel)="handleCancel()">
      <div>
        <p>Modal Content</p>
      </div>
      <div *modalFooter>
        <button id="btn-template" tri-button type="default" (click)="handleCancel()">Custom Callback</button>
      </div>
    </tri-modal>
  `
})
class TestDirectiveFooterComponent {
  isVisible = false;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalFooterDirective, { static: true, read: TemplateRef })
  modalFooterDirective!: TemplateRef<TriSafeAny>;

  handleCancel(): void {
    this.isVisible = false;
  }

  showModal(): void {
    this.isVisible = true;
  }
}

@Component({
  imports: [TriModalModule, TriButtonModule],
  template: `
    <tri-modal [(visibleChange)]="isVisible" title="Custom Modal Title">
      <div>
        <p>Modal Content</p>
      </div>
      <div *modalFooter>
        <button id="btn-template" tri-button type="default">Custom Callback</button>
      </div>
    </tri-modal>
  `
})
class TestDirectiveFooterWithInitOpenedComponent {
  isVisible = true;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalFooterDirective, { static: true, read: TemplateRef })
  modalFooterDirective!: TemplateRef<TriSafeAny>;
}

@Component({
  imports: [TriModalModule, TriButtonModule],
  template: `
    <div *modalFooter>
      <button id="btn-template" tri-button type="default" (click)="handleCancel()">Custom Callback</button>
    </div>
  `
})
class TestDirectiveFooterInServiceComponent {
  @ViewChild(TriModalFooterDirective, { static: true, read: TemplateRef })
  modalFooterDirective!: TemplateRef<TriSafeAny>;

  constructor(public nzModalRef: TriModalRef) {}

  handleCancel(): void {
    this.nzModalRef.close();
  }
}
