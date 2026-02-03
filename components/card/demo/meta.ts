import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriCardModule } from 'ng-zorro-antd/card';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-card-meta',
  imports: [TriAvatarModule, TriCardModule, TriIconModule],
  template: `
    <tri-card style="width:300px;" [cover]="coverTemplate" [actions]="[actionSetting, actionEdit, actionEllipsis]">
      <tri-card-meta title="Card title" description="This is the description" [avatar]="avatarTemplate" />
    </tri-card>
    <ng-template #avatarTemplate>
      <tri-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    </ng-template>
    <ng-template #coverTemplate>
      <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
    </ng-template>
    <ng-template #actionSetting>
      <tri-icon type="setting" />
    </ng-template>
    <ng-template #actionEdit>
      <tri-icon type="edit" />
    </ng-template>
    <ng-template #actionEllipsis>
      <tri-icon type="ellipsis" />
    </ng-template>
  `
})
export class TriDemoCardMetaComponent {}
