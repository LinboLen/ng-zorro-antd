import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'tri-demo-badge-status',
  imports: [TriBadgeModule],
  template: `
    <tri-badge status="success" />
    <tri-badge status="error" />
    <tri-badge status="default" />
    <tri-badge status="processing" />
    <tri-badge status="warning" />
    <br />
    <tri-badge status="success" text="Success" />
    <br />
    <tri-badge status="error" text="Error" />
    <br />
    <tri-badge status="default" text="Default" />
    <br />
    <tri-badge status="processing" text="Processing" />
    <br />
    <tri-badge status="warning" text="Warning" />
    <br />
  `
})
export class TriDemoBadgeStatusComponent {}
