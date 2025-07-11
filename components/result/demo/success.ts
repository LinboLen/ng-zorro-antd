import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-success',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    >
      <div tri-result-extra>
        <button tri-button type="primary">Go Console</button>
        <button tri-button>Buy Again</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultSuccessComponent {}
