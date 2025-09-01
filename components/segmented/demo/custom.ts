import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-custom',
  imports: [TriAvatarModule, TriSegmentedModule],
  template: `
    <tri-segmented>
      <label tri-segmented-item value="user1">
        <tri-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        <div>User 1</div>
      </label>
      <label tri-segmented-item value="user2">
        <tri-avatar text="K" [style.background]="'#f56a00'" />
        <div>User 2</div>
      </label>
      <label tri-segmented-item value="user3">
        <tri-avatar icon="user" [style.background]="'#87d068'" />
        <div>User 3</div>
      </label>
    </tri-segmented>

    <br />
    <br />

    <tri-segmented>
      <label tri-segmented-item value="spring">
        <div>Spring</div>
        <div>Jan-Mar</div>
      </label>
      <label tri-segmented-item value="summer">
        <div>Summer</div>
        <div>Apr-Jun</div>
      </label>
      <label tri-segmented-item value="autumn">
        <div>Autumn</div>
        <div>Jul-Sept</div>
      </label>
      <label tri-segmented-item value="winter">
        <div>Winter</div>
        <div>Oct-Dec</div>
      </label>
    </tri-segmented>
  `,
  styles: `
    :host ::ng-deep .ant-segmented-item-label {
      margin: 4px;
    }
  `
})
export class TriDemoSegmentedCustomComponent {}
