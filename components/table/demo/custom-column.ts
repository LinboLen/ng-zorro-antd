import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriModalModule } from 'ng-zorro-antd/modal';
import { TriCustomColumn, TriTableModule } from 'ng-zorro-antd/table';

interface Person {
  key: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  address: string;
}

interface CustomColumn extends TriCustomColumn {
  name: string;
  required?: boolean;
  position?: 'left' | 'right';
}

@Component({
  selector: 'tri-demo-table-custom-column',
  imports: [
    TriButtonModule,
    TriDividerModule,
    TriGridModule,
    TriIconModule,
    TriModalModule,
    TriTableModule,
    CdkDrag,
    CdkDropList
  ],
  template: `
    <button tri-button type="primary" size="small" (click)="showModal()" style="margin-bottom: 8px;">
      <tri-icon type="setting" theme="outline" />
    </button>
    <tri-table #basicTable [data]="listOfData" [customColumn]="customColumn">
      <thead>
        <tr>
          <th cellControl="name">Name</th>
          <th cellControl="gender">Gender</th>
          <th cellControl="age">Age</th>
          <th cellControl="address">Address</th>
          <th cellControl="action">Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data) {
          <tr>
            <td cellControl="name">{{ data.name }}</td>
            <td cellControl="gender">{{ data.gender }}</td>
            <td cellControl="age">{{ data.age }}</td>
            <td cellControl="address">{{ data.address }}</td>
            <td cellControl="action">
              <a>Action</a>
              <tri-divider type="vertical"></tri-divider>
              <a>Delete</a>
            </td>
          </tr>
        }
      </tbody>
    </tri-table>

    <tri-modal [(visibleChange)]="isVisible" title="Custom Column" (onCancel)="handleCancel()" (onOk)="handleOk()">
      <ng-container *modalContent>
        <div tri-row [gutter]="24">
          <div tri-col class="gutter-row" [span]="12">
            <div class="example-container">
              <p>Displayed (drag and drop to sort)</p>
              @for (item of title; track item) {
                <div class="example-box">
                  {{ item.name }}
                </div>
              }
              <div
                cdkDropList
                #todoList="cdkDropList"
                [cdkDropListData]="fix"
                [cdkDropListConnectedTo]="[doneList]"
                class="example-list"
                (cdkDropListDropped)="drop($event)"
              >
                @for (item of fix; track item; let i = $index) {
                  <div class="example-box" cdkDrag>
                    {{ item.name }}
                    <tri-icon type="minus-circle" theme="outline" (click)="deleteCustom(item, i)" />
                  </div>
                }
              </div>
              @for (item of footer; track item) {
                <div class="example-box">
                  {{ item.name }}
                </div>
              }
            </div>
          </div>
          <div tri-col class="gutter-row" [span]="12">
            <div class="example-container">
              <p>Not Shown</p>
              <div
                cdkDropList
                #doneList="cdkDropList"
                [cdkDropListData]="notFix"
                [cdkDropListConnectedTo]="[todoList]"
                class="example-list"
                (cdkDropListDropped)="drop($event)"
              >
                @for (item of notFix; track item; let i = $index) {
                  <div class="example-box" cdkDrag>
                    {{ item.name }}
                    <tri-icon type="plus-circle" theme="outline" (click)="addCustom(item, i)" />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </tri-modal>
  `,
  styles: [
    `
      .example-container {
        height: 350px;
        display: flex;
        flex-direction: column;
      }

      .example-list {
        min-height: 60px;
        border-radius: 4px;
        overflow-x: hidden;
        overflow-y: auto;
        display: block;
        border: 1px dashed #ccc;
        flex: 1 1 auto;
      }

      .example-list > .example-box {
        cursor: move;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow:
          0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14),
          0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        margin: 4px;
        padding: 4px 8px;
        background-color: rgb(0 112 204 / 15%);
      }

      .example-box span {
        cursor: pointer;
      }
    `
  ]
})
export class TriDemoTableCustomColumnComponent implements OnInit {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      gender: 'female',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      gender: 'female',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      gender: 'male',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  customColumn: CustomColumn[] = [
    {
      name: 'Name',
      value: 'name',
      default: true,
      required: true,
      position: 'left',
      width: 200,
      fixWidth: true
    },
    {
      name: 'Gender',
      value: 'gender',
      default: true,
      width: 200
    },
    {
      name: 'Address',
      value: 'address',
      default: true,
      width: 200
    },
    {
      name: 'Age',
      value: 'age',
      default: true,
      width: 200
    },
    {
      name: 'Action',
      value: 'action',
      default: true,
      required: true,
      position: 'right',
      width: 200
    }
  ];

  isVisible: boolean = false;
  title: CustomColumn[] = [];
  footer: CustomColumn[] = [];
  fix: CustomColumn[] = [];
  notFix: CustomColumn[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.title = this.customColumn.filter(item => item.position === 'left' && item.required);
    this.footer = this.customColumn.filter(item => item.position === 'right' && item.required);
    this.fix = this.customColumn.filter(item => item.default && !item.required);
    this.notFix = this.customColumn.filter(item => !item.default && !item.required);
  }

  drop(event: CdkDragDrop<CustomColumn[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.fix = this.fix.map(item => {
      item.default = true;
      return item;
    });
    this.notFix = this.notFix.map(item => {
      item.default = false;
      return item;
    });
    this.cdr.markForCheck();
  }

  deleteCustom(value: CustomColumn, index: number): void {
    value.default = false;
    this.notFix = [...this.notFix, value];
    this.fix.splice(index, 1);
    this.cdr.markForCheck();
  }

  addCustom(value: CustomColumn, index: number): void {
    value.default = true;
    this.fix = [...this.fix, value];
    this.notFix.splice(index, 1);
    this.cdr.markForCheck();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.customColumn = [...this.title, ...this.fix, ...this.notFix, ...this.footer];
    this.isVisible = false;
    this.cdr.markForCheck();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
