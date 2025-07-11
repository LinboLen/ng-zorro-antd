import { Component, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalRef, TriModalService, TRI_MODAL_DATA, TriModalModule } from 'ng-zorro-antd/modal';

interface IModalData {
  favoriteLibrary: string;
  favoriteFramework: string;
}

@Component({
  selector: 'tri-demo-modal-service',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="createModal()">
      <span>String</span>
    </button>

    <button tri-button type="primary" (click)="createTplModal(tplTitle, tplContent, tplFooter)">
      <span>Template</span>
    </button>
    <ng-template #tplTitle>
      <span>Title Template</span>
    </ng-template>
    <ng-template #tplContent let-params>
      <p>some contents...</p>
      <p>some contents...</p>
      <p>{{ params?.value }}</p>
    </ng-template>
    <ng-template #tplFooter let-ref="modalRef">
      <button tri-button (click)="ref.destroy()">Destroy</button>
      <button tri-button type="primary" (click)="destroyTplModal(ref)" [loading]="tplModalButtonLoading">
        Close after submit
      </button>
    </ng-template>

    <br />
    <br />

    <button tri-button type="primary" (click)="createComponentModal()">
      <span>Use Component</span>
    </button>

    <button tri-button type="primary" (click)="createCustomButtonModal()">Custom Button</button>

    <br />
    <br />

    <button tri-button type="primary" (click)="openAndCloseAll()">Open more modals then close all after 2s</button>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoModalServiceComponent {
  tplModalButtonLoading = false;
  disabled = false;

  constructor(
    private modal: TriModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  createModal(): void {
    this.modal.create({
      title: 'Modal Title',
      content: 'string, will close after 1 sec',
      closable: false,
      onOk: () => new Promise(resolve => setTimeout(resolve, 1000))
    });
  }

  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.modal.create({
      title: tplTitle,
      content: tplContent,
      footer: tplFooter,
      maskClosable: false,
      closable: false,
      onOk: () => console.log('Click ok')
    });
  }

  destroyTplModal(modelRef: TriModalRef): void {
    this.tplModalButtonLoading = true;
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }

  createComponentModal(): void {
    const modal = this.modal.create<TriModalCustomComponent, IModalData>({
      title: 'Modal Title',
      content: TriModalCustomComponent,
      viewContainerRef: this.viewContainerRef,
      data: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular'
      },
      onOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      footer: [
        {
          label: 'change component title from outside',
          onClick: componentInstance => {
            componentInstance!.title = 'title in inner component is changed';
          }
        }
      ]
    });
    const instance = modal.getContentComponent();
    modal._afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal._afterClose.subscribe(result => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    setTimeout(() => {
      instance.subtitle = 'sub title is changed';
    }, 2000);
  }

  createCustomButtonModal(): void {
    const modal: TriModalRef = this.modal.create({
      title: 'custom button demo',
      content: 'pass array of button config to nzFooter to create multiple buttons',
      footer: [
        {
          label: 'Close',
          shape: 'round',
          onClick: () => modal.destroy()
        },
        {
          label: 'Confirm',
          type: 'primary',
          onClick: () => this.modal.confirm({ title: 'Confirm Modal Title', content: 'Confirm Modal Content' })
        },
        {
          label: 'Change Button Status',
          type: 'primary',
          danger: true,
          loading: false,
          onClick(): void {
            this.loading = true;
            setTimeout(() => (this.loading = false), 1000);
            setTimeout(() => {
              this.loading = false;
              this.disabled = true;
              this.label = 'can not be clicked！';
            }, 2000);
          }
        },
        {
          label: 'async load',
          type: 'dashed',
          onClick: () => new Promise(resolve => setTimeout(resolve, 2000))
        }
      ]
    });
  }

  openAndCloseAll(): void {
    let pos = 0;

    ['create', 'info', 'success', 'error'].forEach(method =>
      // @ts-ignore
      this.modal[method]({
        nzMask: false,
        nzTitle: `Test ${method} title`,
        nzContent: `Test content: <b>${method}</b>`,
        nzStyle: { position: 'absolute', top: `${pos * 70}px`, left: `${pos++ * 300}px` }
      })
    );

    this.modal.afterAllClose.subscribe(() => console.log('afterAllClose emitted!'));

    setTimeout(() => this.modal.closeAll(), 2000);
  }
}

@Component({
  selector: 'tri-modal-custom-component',
  imports: [TriButtonModule],
  template: `
    <div>
      <h2>{{ title }}</h2>
      <h4>{{ subtitle }}</h4>
      <p
        >My favorite framework is {{ modalData.favoriteFramework }} and my favorite library is
        {{ modalData.favoriteLibrary }}
      </p>
      <p>
        <span>Get Modal instance in component</span>
        <button tri-button [type]="'primary'" (click)="destroyModal()">destroy modal in the component</button>
      </p>
    </div>
  `
})
export class TriModalCustomComponent {
  @Input() title?: string;
  @Input() subtitle?: string;

  readonly #modal = inject(TriModalRef);
  readonly modalData: IModalData = inject(TRI_MODAL_DATA);

  destroyModal(): void {
    this.#modal.destroy({ data: 'this the result data' });
  }
}
