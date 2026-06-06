/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  provideZoneChangeDetection,
  TemplateRef,
  ViewChild,
  inject
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject as testingInject, TestBed } from '@angular/core/testing';
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

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [TriModalService, provideNoopAnimations(), provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
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
    expect(testComponent.isVisible).toBe(true);
    const modalRef = testComponent.modalComponent.getModalRef();
    expect(modalRef!.getConfig().title).toEqual(testComponent.modalTitleDir);

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

    expect(modalRef!.getConfig().title).toEqual(initOpenedComponent.modalTitleDir);

    initOpenedComponentFixture.detectChanges();
  }));

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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
class TestDirectiveTitleComponent {
  isVisible = false;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<TriSafeAny>;

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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
class TestDirectiveTitleWithInitOpenedComponent {
  isVisible = true;
  @ViewChild(TriModalComponent) modalComponent!: TriModalComponent;
  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<TriSafeAny>;
}

@Component({
  imports: [TriModalModule],
  template: `<div *modalTitle>Custom Modal Title</div>`,
  changeDetection: ChangeDetectionStrategy.Eager
})
class TestDirectiveTitleInServiceComponent {
  readonly modalRef = inject(TriModalRef);

  @ViewChild(TriModalTitleDirective, { static: true, read: TemplateRef }) modalTitleDir!: TemplateRef<TriSafeAny>;

  handleCancel(): void {
    this.modalRef.close();
  }
}
