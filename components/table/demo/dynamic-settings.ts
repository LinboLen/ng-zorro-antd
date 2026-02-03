import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import {
  TriTableLayout,
  TriTableModule,
  TriTablePaginationPosition,
  TriTablePaginationType,
  TriTableSize
} from 'ng-zorro-antd/table';

interface ItemData {
  name: string;
  age: number | string;
  address: string;
  checked: boolean;
  expand: boolean;
  description: string;
  disabled?: boolean;
}

type TableScroll = 'unset' | 'scroll' | 'fixed';

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: TriTableSize;
  tableScroll: TableScroll;
  tableLayout: TriTableLayout;
  position: TriTablePaginationPosition;
  paginationType: TriTablePaginationType;
}

@Component({
  selector: 'tri-demo-table-dynamic-settings',
  imports: [ReactiveFormsModule, TriDividerModule, TriFormModule, TriRadioModule, TriSwitchModule, TriTableModule],
  template: `
    <div class="components-table-demo-control-bar">
      <form tri-form layout="inline" [formGroup]="settingForm">
        @for (item of listOfSwitch; track item) {
          <tri-form-item>
            <tri-form-label>{{ item.name }}</tri-form-label>
            <tri-form-control>
              <tri-switch [formControlName]="item.formControlName" />
            </tri-form-control>
          </tri-form-item>
        }
        @for (radio of listOfRadio; track radio) {
          <tri-form-item>
            <tri-form-label>{{ radio.name }}</tri-form-label>
            <tri-form-control>
              <tri-radio-group [formControlName]="radio.formControlName">
                @for (o of radio.listOfOption; track o) {
                  <label tri-radio-button [value]="o.value">{{ o.label }}</label>
                }
              </tri-radio-group>
            </tri-form-control>
          </tri-form-item>
        }
      </form>
    </div>
    <tri-table
      #dynamicTable
      [scroll]="{ x: scrollX, y: scrollY }"
      [data]="listOfData"
      [tableLayout]="settingValue.tableLayout"
      [bordered]="settingValue.bordered"
      [simple]="settingValue.simple"
      [loading]="settingValue.loading"
      [paginationType]="settingValue.paginationType"
      [paginationPosition]="settingValue.position"
      [showSizeChanger]="settingValue.sizeChanger"
      [frontPagination]="settingValue.pagination"
      [showPagination]="settingValue.pagination"
      [footer]="settingValue.footer ? 'Here is Footer' : null"
      [title]="settingValue.title ? 'Here is Title' : null"
      [size]="settingValue.size"
      (currentPageDataChange)="currentPageDataChange($event)"
    >
      <thead>
        @if (settingValue.header) {
          <tr>
            @if (settingValue.expandable) {
              <th width="40px" [left]="fixedColumn"></th>
            }
            @if (settingValue.checkbox) {
              <th
                width="60px"
                [(checkedChange)]="allChecked"
                [left]="fixedColumn"
                [indeterminate]="indeterminate"
                (checkedChange)="checkAll($event)"
              ></th>
            }
            <th [left]="fixedColumn">Name</th>
            <th>Age</th>
            <th>Address</th>
            <th [right]="fixedColumn">Action</th>
          </tr>
        }
      </thead>
      <tbody>
        @for (data of dynamicTable.data; track data) {
          <tr>
            @if (settingValue.expandable) {
              <td [left]="fixedColumn" [(expandChange)]="data.expand"></td>
            }
            @if (settingValue.checkbox) {
              <td [left]="fixedColumn" [(checkedChange)]="data.checked" (checkedChange)="refreshStatus()"></td>
            }
            <td [left]="fixedColumn">{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td [ellipsis]="settingValue.ellipsis">{{ data.address }}</td>
            <td [right]="fixedColumn" [ellipsis]="settingValue.ellipsis">
              <a href="#">Delete</a>
              <tri-divider type="vertical" />
              <a href="#">More action</a>
            </td>
          </tr>
          @if (settingValue.expandable) {
            <tr [expand]="data.expand">
              <span>{{ data.description }}</span>
            </tr>
          }
        }
      </tbody>
    </tri-table>
  `,
  styles: `
    form nz-form-item {
      margin-right: 16px;
      margin-bottom: 8px;
    }
  `
})
export class TriDemoTableDynamicSettingsComponent implements OnInit {
  settingForm: FormGroup<{ [K in keyof Setting]: FormControl<Setting[K]> }>;
  listOfData: readonly ItemData[] = [];
  displayData: readonly ItemData[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;
  listOfSwitch = [
    { name: 'Bordered', formControlName: 'bordered' },
    { name: 'Loading', formControlName: 'loading' },
    { name: 'Pagination', formControlName: 'pagination' },
    { name: 'PageSizeChanger', formControlName: 'sizeChanger' },
    { name: 'Title', formControlName: 'title' },
    { name: 'Column Header', formControlName: 'header' },
    { name: 'Footer', formControlName: 'footer' },
    { name: 'Expandable', formControlName: 'expandable' },
    { name: 'Checkbox', formControlName: 'checkbox' },
    { name: 'Fixed Header', formControlName: 'fixHeader' },
    { name: 'No Result', formControlName: 'noResult' },
    { name: 'Ellipsis', formControlName: 'ellipsis' },
    { name: 'Simple Pagination', formControlName: 'simple' }
  ];
  listOfRadio = [
    {
      name: 'Size',
      formControlName: 'size',
      listOfOption: [
        { value: 'default', label: 'Default' },
        { value: 'middle', label: 'Middle' },
        { value: 'small', label: 'Small' }
      ]
    },
    {
      name: 'Table Scroll',
      formControlName: 'tableScroll',
      listOfOption: [
        { value: 'unset', label: 'Unset' },
        { value: 'scroll', label: 'Scroll' },
        { value: 'fixed', label: 'Fixed' }
      ]
    },
    {
      name: 'Table Layout',
      formControlName: 'tableLayout',
      listOfOption: [
        { value: 'auto', label: 'Auto' },
        { value: 'fixed', label: 'Fixed' }
      ]
    },
    {
      name: 'Pagination Position',
      formControlName: 'position',
      listOfOption: [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'both', label: 'Both' }
      ]
    },
    {
      name: 'Pagination Type',
      formControlName: 'paginationType',
      listOfOption: [
        { value: 'default', label: 'Default' },
        { value: 'small', label: 'Small' }
      ]
    }
  ];

  currentPageDataChange($event: readonly ItemData[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  generateData(): readonly ItemData[] {
    const data: ItemData[] = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        name: 'John Brown',
        age: `${i}2`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        checked: false,
        expand: false
      });
    }
    return data;
  }

  constructor(private formBuilder: NonNullableFormBuilder) {
    this.settingForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [true],
      header: [true],
      footer: [true],
      expandable: [true],
      checkbox: [true],
      fixHeader: [false],
      noResult: [false],
      ellipsis: [false],
      simple: [false],
      size: 'small' as TriTableSize,
      paginationType: 'default' as TriTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as TriTableLayout,
      position: 'bottom' as TriTablePaginationPosition
    });

    this.settingValue = this.settingForm.value as Setting;
  }

  ngOnInit(): void {
    this.settingForm.valueChanges.subscribe(value => {
      this.settingValue = value as Setting;
    });
    this.settingForm.controls.tableScroll.valueChanges.subscribe(scroll => {
      this.fixedColumn = scroll === 'fixed';
      this.scrollX = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    this.settingForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollY = fixed ? '240px' : null;
    });
    this.settingForm.controls.noResult.valueChanges.subscribe(empty => {
      if (empty) {
        this.listOfData = [];
      } else {
        this.listOfData = this.generateData();
      }
    });
    this.listOfData = this.generateData();
  }
}
