import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: '',
  imports: [TriBadgeModule, TriCardModule],
  template: `
    <tri-ribbon text="Hippies">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="pink">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="red">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="cyan">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="green">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="purple">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="volcano">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
    <br />
    <tri-ribbon text="Hippies" color="magenta">
      <tri-card title="Pushes open the window" size="small"> And raises the spyglass. </tri-card>
    </tri-ribbon>
  `
})
export class TriDemoBadgeRibbonComponent {}
