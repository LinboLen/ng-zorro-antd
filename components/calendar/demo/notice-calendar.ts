import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'tri-demo-calendar-notice-calendar',
  imports: [TriBadgeModule, TriCalendarModule],
  template: `
    <tri-calendar>
      <ul *dateCell="let date" class="events">
        @switch (date.getDate()) {
          @case (8) {
            @for (item of listDataMap.eight; track $index) {
              <li>
                <tri-badge [status]="item.type" [text]="item.content"></tri-badge>
              </li>
            }
          }
          @case (10) {
            @for (item of listDataMap.ten; track $index) {
              <li>
                <tri-badge [status]="item.type" [text]="item.content"></tri-badge>
              </li>
            }
          }
          @case (11) {
            @for (item of listDataMap.eleven; track $index) {
              <li>
                <tri-badge [status]="item.type" [text]="item.content"></tri-badge>
              </li>
            }
          }
        }
      </ul>
      <ng-container *monthCell="let month">
        @if (getMonthData(month); as monthData) {
          <div class="notes-month">
            <section>{{ monthData }}</section>
            <span>Backlog number</span>
          </div>
        }
      </ng-container>
    </tri-calendar>
  `,
  styles: [
    `
      .events {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .events .ant-badge-status {
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        font-size: 12px;
      }
    `
  ]
})
export class TriDemoCalendarNoticeCalendarComponent {
  readonly listDataMap = {
    eight: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' }
    ],
    ten: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
      { type: 'error', content: 'This is error event.' }
    ],
    eleven: [
      { type: 'warning', content: 'This is warning event' },
      { type: 'success', content: 'This is very long usual event........' },
      { type: 'error', content: 'This is error event 1.' },
      { type: 'error', content: 'This is error event 2.' },
      { type: 'error', content: 'This is error event 3.' },
      { type: 'error', content: 'This is error event 4.' }
    ]
  };

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }
}
