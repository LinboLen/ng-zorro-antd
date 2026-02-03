import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TriTableModule } from 'ng-zorro-antd/table';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'tri-demo-table-edit-row',
  imports: [FormsModule, TriInputModule, TriPopconfirmModule, TriTableModule],
  template: `
    <tri-table #editRowTable bordered [data]="listOfData" tableLayout="fixed">
      <thead>
        <tr>
          <th width="25%">Name</th>
          <th width="15%">Age</th>
          <th width="40%">Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of editRowTable.data; track data) {
          <tr>
            @if (!editCache[data.id].edit) {
              <td>{{ data.name }}</td>
              <td>{{ data.age }}</td>
              <td>{{ data.address }}</td>
              <td><a (click)="startEdit(data.id)">Edit</a></td>
            } @else {
              <td><input type="text" tri-input [(ngModel)]="editCache[data.id].data.name" /></td>
              <td><input type="text" tri-input [(ngModel)]="editCache[data.id].data.age" /></td>
              <td><input type="text" tri-input [(ngModel)]="editCache[data.id].data.address" /></td>
              <td>
                <a (click)="saveEdit(data.id)" class="save">Save</a>
                <a tri-popconfirm popconfirmTitle="Sure to cancel?" (onConfirm)="cancelEdit(data.id)">Cancel</a>
              </td>
            }
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: `
    .save {
      margin-right: 8px;
    }
  `
})
export class TriDemoTableEditRowComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {
    const data: ItemData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: `${i}`,
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      });
    }
    this.listOfData = data;
    this.updateEditCache();
  }
}
