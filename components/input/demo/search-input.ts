import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-search-input',
  imports: [FormsModule, TriButtonModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-wrapper class="tri-input-search">
      <input tri-input type="search" placeholder="input search text" />
      <button inputAddonAfter tri-button class="tri-input-search-button">
        <tri-icon type="search" />
      </button>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper allowClear class="tri-input-search">
      <input tri-input type="search" placeholder="input search text" />
      <button inputAddonAfter tri-button class="tri-input-search-button">
        <tri-icon type="search" />
      </button>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper class="tri-input-search">
      <span inputAddonBefore>https://</span>
      <input tri-input type="search" placeholder="input search text" />
      <button inputAddonAfter tri-button class="tri-input-search-button">
        <tri-icon type="search" />
      </button>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper class="tri-input-search tri-input-search-with-button">
      <input tri-input type="search" placeholder="input search text" />
      <button inputAddonAfter tri-button type="primary" class="tri-input-search-button">
        <tri-icon type="search" />
      </button>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper class="tri-input-search tri-input-search-large tri-input-search-with-button">
      <input tri-input type="search" placeholder="input search text" size="large" />
      <button inputAddonAfter tri-button type="primary" size="large" class="tri-input-search-button"
        >Submit</button
      >
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper class="tri-input-search tri-input-search-large tri-input-search-with-button">
      <input tri-input type="search" placeholder="input search text" size="large" />
      <tri-icon inputSuffix type="audio" [style.font-size.px]="16" [style.color]="'#1677ff'" />
      <button inputAddonAfter tri-button type="primary" size="large" class="tri-input-search-button"
        >Submit</button
      >
    </tri-input-wrapper>
  `
})
export class TriDemoInputSearchInputComponent {}
