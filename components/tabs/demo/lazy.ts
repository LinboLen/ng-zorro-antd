import { Component, OnInit } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tab-content-lazy',
  template: `lazy`
})
export class TriDemoTabContentLazyComponent implements OnInit {
  ngOnInit(): void {
    console.log(`I will init when tab active`);
  }
}

@Component({
  selector: 'tri-demo-tab-content-eagerly',
  template: `eagerly`
})
export class TriDemoTabContentEagerlyComponent implements OnInit {
  ngOnInit(): void {
    console.log(`I will init eagerly`);
  }
}

@Component({
  selector: 'tri-demo-tabs-lazy',
  imports: [TriTabsModule, TriDemoTabContentEagerlyComponent, TriDemoTabContentLazyComponent],
  template: `
    <tri-tabs>
      <tri-tab title="Tab Eagerly 1">
        <tri-demo-tab-content-eagerly />
      </tri-tab>
      <tri-tab title="Tab Eagerly 2">
        <tri-demo-tab-content-eagerly />
      </tri-tab>
      <tri-tab title="Tab Lazy 1">
        <ng-template tri-tab>
          <tri-demo-tab-content-lazy />
        </ng-template>
      </tri-tab>
      <tri-tab title="Tab Lazy 2">
        <ng-template tri-tab>
          <tri-demo-tab-content-lazy />
        </ng-template>
      </tri-tab>
    </tri-tabs>
  `
})
export class TriDemoTabsLazyComponent {}
