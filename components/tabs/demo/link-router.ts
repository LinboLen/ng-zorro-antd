import { Component } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-link-router',
  imports: [RouterLink, TriTabsModule, TriButtonModule],
  template: `
    <div style="margin-bottom: 16px;">
      <button tri-button (click)="newTab()">ADD</button>
    </div>
    <tri-tabs linkRouter>
      <tri-tab>
        <a *tabLink tri-tab-link [routerLink]="['.']" [queryParams]="{ tab: 'one' }" queryParamsHandling="merge">
          Default
        </a>
        Default.
      </tri-tab>
      <tri-tab>
        <a *tabLink tri-tab-link [routerLink]="['.']" [queryParams]="{ tab: 'two' }" queryParamsHandling="merge">
          Two
        </a>
        Two.
      </tri-tab>
      <tri-tab>
        <a *tabLink tri-tab-link [routerLink]="['.']" [queryParams]="{ tab: 'three' }" queryParamsHandling="merge">
          Three
        </a>
        Three.
      </tri-tab>
      <tri-tab>
        <a *tabLink tri-tab-link [routerLink]="['.']" [queryParams]="{ tab: 'four' }" queryParamsHandling="merge">
          Four
        </a>
        Four.
      </tri-tab>
      @for (tab of dynamicTabs; track tab.title) {
        <tri-tab>
          <a
            *tabLink
            tri-tab-link
            [routerLink]="tab.routerLink"
            [queryParams]="tab.queryParams ?? {}"
            queryParamsHandling="merge"
          >
            {{ tab.title }}
          </a>
          {{ tab.content }}
        </tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsLinkRouterComponent {
  dynamicTabs: Array<{ title: string; content: string; queryParams?: Params; routerLink: string[] }> = [];

  newTab(): void {
    const { length } = this.dynamicTabs;
    const newTabId = length + 1;
    const title = `NewTab${newTabId}`;
    this.dynamicTabs = [
      ...this.dynamicTabs,
      {
        title,
        content: title,
        routerLink: ['.'],
        queryParams: {
          tab: newTabId
        }
      }
    ];
  }
}
