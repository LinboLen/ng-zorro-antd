import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPageHeaderModule } from 'ng-zorro-antd/page-header';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriTagModule } from 'ng-zorro-antd/tag';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-page-header-content',
  imports: [
    TriAvatarModule,
    TriBreadCrumbModule,
    TriButtonModule,
    TriDropdownModule,
    TriGridModule,
    TriIconModule,
    TriPageHeaderModule,
    TriSpaceModule,
    TriTagModule,
    TriTypographyModule,
    TriNoAnimationDirective
  ],
  template: `
    <tri-page-header>
      <!--breadcrumb-->
      <tri-breadcrumb tri-page-header-breadcrumb>
        <tri-breadcrumb-item>First-level Menu</tri-breadcrumb-item>
        <tri-breadcrumb-item>
          <a>Second-level Menu</a>
        </tri-breadcrumb-item>
        <tri-breadcrumb-item>Third-level Menu</tri-breadcrumb-item>
      </tri-breadcrumb>

      <!--avatar-->
      <tri-avatar tri-page-header-avatar src="https://avatars0.githubusercontent.com/u/22736418?s=88&v=4" />

      <!--title-->
      <tri-page-header-title>Title</tri-page-header-title>

      <!--subtitle-->
      <tri-page-header-subtitle>This is a subtitle</tri-page-header-subtitle>

      <!--tags-->
      <tri-page-header-tags>
        <tri-tag color="blue">Running</tri-tag>
      </tri-page-header-tags>

      <!--extra-->
      <tri-page-header-extra>
        <tri-space>
          <button *spaceItem tri-button>Operation</button>
          <button *spaceItem tri-button>Operation</button>
          <button *spaceItem tri-button type="primary">Primary</button>
          <button
            *spaceItem
            tri-button
            noAnimation
            tri-dropdown
            [dropdownMenu]="menu"
            placement="bottomRight"
            style="border: none; padding: 0"
          >
            <tri-icon type="more" theme="outline" style="font-size: 20px; vertical-align: top;" />
          </button>
        </tri-space>
        <tri-dropdown-menu #menu="nzDropdownMenu">
          <ul tri-menu>
            <li tri-menu-item>1st menu item length</li>
            <li tri-menu-item>2nd menu item length</li>
            <li tri-menu-item>3rd menu item length</li>
          </ul>
        </tri-dropdown-menu>
      </tri-page-header-extra>

      <!--content-->
      <tri-page-header-content>
        <div tri-row>
          <div class="content">
            <p tri-paragraph>
              Ant Design interprets the color system into two levels: a system-level color system and a product-level
              color system.
            </p>
            <p tri-paragraph>
              Ant Design's design team preferred to design with the HSB color model, which makes it easier for designers
              to have a clear psychological expectation of color when adjusting colors, as well as facilitate
              communication in teams.
            </p>
            <div class="content-link">
              <a>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" alt="start" />
                Quick Start
              </a>
              <a>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" alt="info" />
                Product Info
              </a>
              <a>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" alt="doc" />
                Product Doc
              </a>
            </div>
          </div>
          <div class="content-image">
            <img src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg" alt="content" />
          </div>
        </div>
      </tri-page-header-content>
    </tri-page-header>
  `,
  styles: `
    .content {
      flex: 1;
    }

    .content p {
      margin-bottom: 1em;
    }

    .content-link a {
      margin-right: 16px;
    }

    .content-link a img {
      margin-right: 8px;
    }

    .content-image {
      margin: 0 0 0 60px;
      display: flex;
      align-items: center;
    }

    .content-image img {
      width: 100%;
    }

    @media (max-width: 768px) {
      .content-image {
        flex: 100%;
        margin: 24px 0 0;
      }
    }
  `
})
export class TriDemoPageHeaderContentComponent {}
