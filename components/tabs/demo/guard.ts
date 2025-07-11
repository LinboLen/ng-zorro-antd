import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';
import { TriTabsCanDeactivateFn, TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-guard',
  imports: [TriTabsModule, TriModalModule],
  template: `
    <tri-tabs [canDeactivate]="canDeactivate">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab' + tab">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriDemoTabsGuardComponent {
  tabs = [1, 2, 3, 4];
  private modalService = inject(TriModalService);

  canDeactivate: TriTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
    switch (fromIndex) {
      case 0:
        return toIndex === 1;
      case 1:
        return Promise.resolve(toIndex === 2);
      case 2:
        return this.confirm();
      default:
        return true;
    }
  };

  private confirm(): Observable<boolean> {
    return new Observable(observer => {
      this.modalService.confirm({
        title: 'Are you sure you want to leave this tab?',
        onOk: () => {
          observer.next(true);
          observer.complete();
        },
        onCancel: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
