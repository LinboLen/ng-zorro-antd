/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { IconDefinition } from '@ant-design/icons-angular';

import { TRI_ICONS, TRI_ICONS_PATCH, TriIconPatchService } from './icon.service';

/**
 * Provide icon definitions for NzIcon in root
 *
 * @param icons Icon definitions
 */
export const provideNzIcons = (icons: IconDefinition[]): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: TRI_ICONS,
      useValue: icons
    }
  ]);
};

/**
 * Provide icon definitions for NzIcon in feature module or standalone component
 *
 * @param icons Icon definitions
 */
export const provideNzIconsPatch = (icons: IconDefinition[]): Provider[] => {
  return [
    TriIconPatchService,
    {
      provide: TRI_ICONS_PATCH,
      useValue: icons
    }
  ];
};
