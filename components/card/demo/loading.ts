import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriCardModule } from 'ng-zorro-antd/card';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriAvatarModule, TriCardModule, TriIconModule, TriSwitchModule, TriSkeletonModule],
  template: `
    <tri-switch [(ngModel)]="loading"></tri-switch>
    <tri-card style="width: 300px;margin-top: 16px" [loading]="loading">
      <tri-card-meta
        [avatar]="avatarTemplate"
        title="Card title"
        description="This is the description"
      ></tri-card-meta>
    </tri-card>
    <tri-card style="width: 300px;margin-top: 16px" [actions]="[actionSetting, actionEdit, actionEllipsis]">
      <tri-skeleton [active]="true" [loading]="loading" [avatar]="{ size: 'large' }">
        <tri-card-meta
          [avatar]="avatarTemplate"
          title="Card title"
          description="This is the description"
        ></tri-card-meta>
      </tri-skeleton>
    </tri-card>
    <ng-template #avatarTemplate>
      <tri-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></tri-avatar>
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
export class TriDemoCardLoadingComponent {
  loading = true;
}
