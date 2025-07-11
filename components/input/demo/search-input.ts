import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-search-input',
  imports: [FormsModule, TriButtonModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-group [suffix]="suffixIconSearch">
      <input type="text" tri-input placeholder="input search text" />
    </tri-input-group>
    <ng-template #suffixIconSearch>
      <tri-icon type="search" />
    </ng-template>
    <br />
    <br />
    <tri-input-group search [addOnAfter]="suffixIconButton">
      <input type="text" tri-input placeholder="input search text" />
    </tri-input-group>
    <ng-template #suffixIconButton>
      <button tri-button type="primary" search><tri-icon type="search" /></button>
    </ng-template>
    <br />
    <br />
    <tri-input-group search size="large" [addOnAfter]="suffixButton">
      <input type="text" tri-input placeholder="input search text" />
    </tri-input-group>
    <ng-template #suffixButton>
      <button tri-button type="primary" size="large" search>Search</button>
    </ng-template>
  `
})
export class TriDemoInputSearchInputComponent {}
