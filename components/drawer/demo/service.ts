import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TRI_DRAWER_DATA, TriDrawerModule, TriDrawerRef, TriDrawerService } from 'ng-zorro-antd/drawer';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

interface IDrawerData {
  value: string;
}

@Component({
  selector: 'tri-demo-drawer-service',
  imports: [FormsModule, TriButtonModule, TriDrawerModule, TriFormModule, TriInputModule],
  template: `
    <ng-template #drawerTemplate let-data let-drawerRef="drawerRef">
      value: {{ data?.value }}
      <br />
      <br />
      <button tri-button type="primary" (click)="drawerRef.close()">close</button>
    </ng-template>
    <div tri-form>
      <tri-form-item>
        <input tri-input [(ngModel)]="value" />
      </tri-form-item>
    </div>
    <button tri-button type="primary" (click)="openTemplate()">Use Template</button>
    &nbsp;
    <button tri-button type="primary" (click)="openComponent()">Use Component</button>
  `
})
export class TriDemoDrawerServiceComponent {
  private readonly drawerService = inject(TriDrawerService);

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: IDrawerData;
    drawerRef: TriDrawerRef<string>;
  }>;
  readonly value = signal('ng');

  openTemplate(): void {
    const drawerRef = this.drawerService.create({
      nzTitle: 'Template',
      footer: 'Footer',
      extra: 'Extra',
      content: this.drawerTemplate,
      contentParams: {
        value: this.value()
      }
    });

    drawerRef._afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef._afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
    });
  }

  openComponent(): void {
    const drawerRef = this.drawerService.create<TriDrawerCustomComponent, IDrawerData, string>({
      nzTitle: 'Component',
      footer: 'Footer',
      extra: 'Extra',
      content: TriDrawerCustomComponent,
      contentParams: {
        value: this.value()
      },
      data: {
        value: 'Ng Zorro'
      }
    });

    drawerRef._afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef._afterClose.subscribe(data => {
      console.log(data);
      if (typeof data === 'string') {
        this.value.set(data);
      }
      console.log('Drawer(Component) close');
    });
  }
}

@Component({
  selector: 'tri-drawer-custom-component',
  imports: [FormsModule, TriButtonModule, TriDividerModule, TriInputModule],
  template: `
    <div>
      <input tri-input [(ngModel)]="data" />
      <tri-divider />
      <button type="primary" (click)="close()" tri-button>Confirm</button>
    </div>
  `
})
export class TriDrawerCustomComponent {
  readonly data = inject<IDrawerData>(TRI_DRAWER_DATA).value;
  readonly drawerRef: TriDrawerRef<this, string> = inject(TriDrawerRef);

  close(): void {
    this.drawerRef.close(this.data);
  }
}
