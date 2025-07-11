import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-space-compact-buttons',
  imports: [TriSpaceModule, TriButtonModule, TriIconModule, TriDropDownModule, TriToolTipModule],
  template: `
    <tri-space-compact block>
      <button tri-button tri-tooltip tooltipTitle="Like">
        <tri-icon type="like" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Comment">
        <tri-icon type="comment" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Star">
        <tri-icon type="star" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Heart">
        <tri-icon type="heart" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Share">
        <tri-icon type="share-alt" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Download">
        <tri-icon type="download" />
      </button>
      <tri-dropdown-menu #menu>
        <ul tri-menu>
          <li tri-menu-item>
            <a>1st item</a>
          </li>
          <li tri-menu-item>
            <a>2nd item</a>
          </li>
          <li tri-menu-item>
            <a>3rd item</a>
          </li>
        </ul>
      </tri-dropdown-menu>
      <button tri-button tri-dropdown [dropdownMenu]="menu">
        <tri-icon type="ellipsis" />
      </button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <button tri-button type="primary">Button 1</button>
      <button tri-button type="primary">Button 2</button>
      <button tri-button type="primary">Button 3</button>
      <button tri-button type="primary">Button 4</button>
      <button tri-button type="primary" disabled tri-tooltip tooltipTitle="Tooltip">
        <tri-icon type="download" />
      </button>
      <button tri-button type="primary" tri-tooltip tooltipTitle="Tooltip">
        <tri-icon type="download" />
      </button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <button tri-button>Button 1</button>
      <button tri-button>Button 2</button>
      <button tri-button>Button 3</button>
      <button tri-button disabled tri-tooltip tooltipTitle="Tooltip">
        <tri-icon type="download" />
      </button>
      <button tri-button tri-tooltip tooltipTitle="Tooltip">
        <tri-icon type="download" />
      </button>
      <button tri-button type="primary">Button 4</button>
      <tri-dropdown-menu #menu>
        <ul tri-menu>
          <li tri-menu-item>
            <a>1st item</a>
          </li>
          <li tri-menu-item>
            <a>2nd item</a>
          </li>
          <li tri-menu-item>
            <a>3rd item</a>
          </li>
        </ul>
      </tri-dropdown-menu>
      <button tri-button type="primary" tri-dropdown [dropdownMenu]="menu">
        <tri-icon type="ellipsis" />
      </button>
    </tri-space-compact>
  `
})
export class TriDemoSpaceCompactButtonsComponent {}
