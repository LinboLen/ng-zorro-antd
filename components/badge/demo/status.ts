import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: '',
  imports: [TriBadgeModule],
  template: `
    <tri-badge status="success"></tri-badge>
    <tri-badge status="error"></tri-badge>
    <tri-badge status="default"></tri-badge>
    <tri-badge status="processing"></tri-badge>
    <tri-badge status="warning"></tri-badge>
    <br />
    <tri-badge status="success" text="Success"></tri-badge>
    <br />
    <tri-badge status="error" text="Error"></tri-badge>
    <br />
    <tri-badge status="default" text="Default"></tri-badge>
    <br />
    <tri-badge status="processing" text="Processing"></tri-badge>
    <br />
    <tri-badge status="warning" text="Warning"></tri-badge>
    <br />
  `
})
export class TriDemoBadgeStatusComponent {}
