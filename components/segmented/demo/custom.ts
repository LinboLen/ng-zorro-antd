import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [TriAvatarModule, TriSegmentedModule],
  template: `
    <tri-segmented>
      <label tri-segmented-item value="user1">
        <div [style.padding.px]="4">
          <tri-avatar src="https://joeschmoe.io/api/v1/random" />
          <div>User 1</div>
        </div>
      </label>
      <label tri-segmented-item value="user2">
        <div [style.padding.px]="4">
          <tri-avatar text="K" [style.background]="'#f56a00'" />
          <div>User 2</div>
        </div>
      </label>
      <label tri-segmented-item value="user3">
        <div [style.padding.px]="4">
          <tri-avatar icon="user" [style.background]="'#87d068'" />
          <div>User 3</div>
        </div>
      </label>
    </tri-segmented>

    <br />
    <br />

    <tri-segmented>
      <label tri-segmented-item value="spring">
        <div [style.padding.px]="4">
          <div>Spring</div>
          <div>Jan-Mar</div>
        </div>
      </label>
      <label tri-segmented-item value="summer">
        <div [style.padding.px]="4">
          <div>Summer</div>
          <div>Apr-Jun</div>
        </div>
      </label>
      <label tri-segmented-item value="autumn">
        <div [style.padding.px]="4">
          <div>Autumn</div>
          <div>Jul-Sept</div>
        </div>
      </label>
      <label tri-segmented-item value="winter">
        <div [style.padding.px]="4">
          <div>Winter</div>
          <div>Oct-Dec</div>
        </div>
      </label>
    </tri-segmented>
  `
})
export class TriDemoSegmentedCustomComponent {}
