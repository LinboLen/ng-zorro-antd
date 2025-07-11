import { Component } from '@angular/core';

import { TriFormatEmitEvent, TriTreeModule, TriTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'tri-demo-tree-dynamic',
  imports: [TriTreeModule],
  template: `
    <tri-tree [data]="nodes" asyncData (click)="event($event)" (expandChange)="event($event)"></tri-tree>
  `
})
export class TriDemoTreeDynamicComponent {
  readonly nodes = [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true }
  ];

  event(event: TriFormatEmitEvent): void {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
        });
      }
    }
  }

  loadNode(): Promise<TriTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve([
            { title: 'Child Node', key: `${new Date().getTime()}-0` },
            { title: 'Child Node', key: `${new Date().getTime()}-1` }
          ]),
        1000
      );
    });
  }
}
