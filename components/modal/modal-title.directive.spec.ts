/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { ComponentFixture, inject as testingInject, TestBed } from '@angular/core/testing';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TriModalService, provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TestDirectiveTitleComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(
    testingInject([OverlayContainer, TriModalService], (oc: OverlayContainer, m: TriModalService) => {
      overlayContainer = oc;
      modalService = m;
    })
  );

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should work with template', () => {
    testComponent.showModal();
    fixture.detectChanges();
    expect(testComponent.isVisible()).toBe(true);
    const modalRef = testComponent.modalComponent.getModalRef();
    expect(modalRef!.getConfig().title).toEqual(testComponent.modalTitleDir);
  });

  it('should work with template when init opened', async () => {
    const fixture = TestBed.createComponent(TestDirectiveTitleWithInitOpenedComponent);
    const initOpenedComponent = fixture.componentInstance;
    fixture.detectChanges();
    expect(initOpenedComponent.isVisible()).toBe(true);

    await fixture.whenStable();
    fixture.detectChanges();
    const modalRef = initOpenedComponent.modalComponent.getModalRef();
    expect(modalRef!.getConfig().title).toEqual(initOpenedComponent.modalTitleDir);
  });

  it('should work with service', () => {
    const modalRef = modalService.create({ content: TestDirectiveTitleInServiceComponent, title: '' });
    fixture.detectChanges();

    expect(modalRef.componentInstance!.modalRef).toBe(modalRef);
    expect(modalRef.componentInstance!.modalTitleDir).toEqual(modalRef.getConfig().title as TemplateRef<{}>);
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
  readonly isVisible = signal(false);
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<void>;

  handleCancel(): void {
    this.isVisible.set(false);
  }

  showModal(): void {
    this.isVisible.set(true);
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
  readonly isVisible = signal(true);
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<void>;
}

@Component({
  imports: [TriModalModule],
  template: `<div *modalTitle>Custom Modal Title</div>`
})
class TestDirectiveTitleInServiceComponent {
  readonly modalRef = inject(TriModalRef);

  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<void>;

  handleCancel(): void {
    this.modalRef.close();
  }
}
