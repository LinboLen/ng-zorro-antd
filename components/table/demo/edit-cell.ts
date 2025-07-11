import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TriTableModule } from 'ng-zorro-antd/table';

interface ItemData {
  id: string;
  name: string;
  age: string;
  address: string;
}

@Component({
  selector: 'tri-demo-table-edit-cell',
  imports: [FormsModule, TriButtonModule, TriInputModule, TriPopconfirmModule, TriTableModule],
  template: `
    <button tri-button (click)="addRow()" type="primary">Add</button>
    <br />
    <br />
    <tri-table #editRowTable bordered [data]="listOfData">
      <thead>
        <tr>
          <th width="30%">Name</th>
          <th>Age</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of editRowTable.data; track data) {
          <tr class="editable-row">
            <td>
              <div class="editable-cell" [hidden]="editId === data.id" (click)="startEdit(data.id)">
                {{ data.name }}
              </div>
              <input [hidden]="editId !== data.id" type="text" tri-input [(ngModel)]="data.name" (blur)="stopEdit()" />
            </td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
            <td>
              <a tri-popconfirm popconfirmTitle="Sure to delete?" (onConfirm)="deleteRow(data.id)">Delete</a>
            </td>
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: [
    `
      .editable-cell {
        position: relative;
        padding: 5px 12px;
        cursor: pointer;
      }

      .editable-row:hover .editable-cell {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
      }
    `
  ]
})
export class TriDemoTableEditCellComponent implements OnInit {
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        name: `Edward King ${this.i}`,
        age: '32',
        address: `London, Park Lane no. ${this.i}`
      }
    ];
    this.i++;
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  ngOnInit(): void {
    this.addRow();
    this.addRow();
  }
}
