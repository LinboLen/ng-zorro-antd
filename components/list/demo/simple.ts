import { Component } from '@angular/core';

import { TriListModule } from 'ng-zorro-antd/list';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-list-simple',
  imports: [TriListModule, TriTypographyModule],
  template: `
    <h3>Default Size</h3>
    <tri-list bordered header="Header" footer="Footer">
      @for (item of data; track item) {
        <tri-list-item>
          <span tri-typography><mark>[ITEM]</mark></span>
          {{ item }}
        </tri-list-item>
      }
    </tri-list>

    <h3>Small Size</h3>
    <tri-list bordered size="small">
      <tri-list-header>Header</tri-list-header>
      @for (item of data; track item) {
        <tri-list-item>{{ item }}</tri-list-item>
      }

      <tri-list-footer>Footer</tri-list-footer>
    </tri-list>

    <h3>Large Size</h3>
    <ul tri-list [dataSource]="data" bordered size="large">
      <tri-list-header>Header</tri-list-header>
      @for (item of data; track item) {
        <li tri-list-item noFlex>
          <ul tri-list-item-actions>
            <tri-list-item-action>
              <a (click)="msg.info('edit')">edit</a>
            </tri-list-item-action>
          </ul>
          {{ item }}
        </li>
      }
      <tri-list-footer>Footer</tri-list-footer>
    </ul>
  `,
  styles: [
    `
      h3 {
        margin: 16px 0;
      }
      h3:first-child {
        margin-top: 0;
      }
      h3:last-child {
        margin-bottom: 0;
      }
    `
  ]
})
export class TriDemoListSimpleComponent {
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];

  constructor(public msg: TriMessageService) {}
}
