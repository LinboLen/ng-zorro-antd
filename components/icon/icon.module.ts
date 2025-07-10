/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { IconDefinition } from '@ant-design/icons-angular';

import { TriIconDirective } from './icon.directive';
import { provideNzIcons, provideNzIconsPatch } from './provide-icons';

@NgModule({
  imports: [TriIconDirective],
  exports: [TriIconDirective]
})
export class TriIconModule {
  static forRoot(icons: IconDefinition[]): ModuleWithProviders<TriIconModule> {
    return {
      ngModule: TriIconModule,
      providers: [provideNzIcons(icons)]
    };
  }

  static forChild(icons: IconDefinition[]): ModuleWithProviders<TriIconModule> {
    return {
      ngModule: TriIconModule,
      providers: [provideNzIconsPatch(icons)]
    };
  }
}
