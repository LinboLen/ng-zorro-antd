import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TRI_DRAWER_DATA, TriDrawerModule, TriDrawerRef, TriDrawerService } from 'ng-zorro-antd/drawer';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
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
  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: TriDrawerRef<string>;
  }>;
  value = 'ng';

  constructor(private drawerService: TriDrawerService) {}

  openTemplate(): void {
    const drawerRef = this.drawerService.create({
      nzTitle: 'Template',
      footer: 'Footer',
      extra: 'Extra',
      content: this.drawerTemplate,
      contentParams: {
        value: this.value
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
    const drawerRef = this.drawerService.create<TriDrawerCustomComponent, { value: string }, string>({
      nzTitle: 'Component',
      footer: 'Footer',
      extra: 'Extra',
      content: TriDrawerCustomComponent,
      contentParams: {
        value: this.value
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
        this.value = data;
      }
    });
  }
}

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriDividerModule, TriInputModule],
  template: `
    <div>
      <input tri-input [(ngModel)]="data.value" />
      <tri-divider></tri-divider>
      <button type="primary" (click)="close()" tri-button>Confirm</button>
    </div>
  `
})
export class TriDrawerCustomComponent {
  // @Input() value = '';
  data: { value: string } = inject(TRI_DRAWER_DATA);

  constructor(private drawerRef: TriDrawerRef<string>) {}

  close(): void {
    this.drawerRef.close(this.data);
  }
}
