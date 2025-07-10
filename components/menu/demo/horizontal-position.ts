import { Component } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: '',
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="horizontal">
      <li tri-submenu placement="bottomLeft" title="bottomLeft">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu placement="bottomCenter" title="bottomCenter">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu placement="bottomRight" title="bottomRight">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu placement="topLeft" title="topLeft">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu placement="topCenter" title="topCenter">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu placement="topRight" title="topRight">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  `
})
export class TriDemoMenuHorizontalPositionComponent {}
