/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  DOCUMENT,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, Subscription } from 'rxjs';

import { manifest, ThemeType } from '@ant-design/icons-angular';
import { AccountBookFill } from '@ant-design/icons-angular/icons';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { PREFIX } from 'ng-zorro-antd/core/logger';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule, TriIconService } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriModalModule } from 'ng-zorro-antd/modal';
import { TriPopoverModule } from 'ng-zorro-antd/popover';
import { TriProgressModule } from 'ng-zorro-antd/progress';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriResultModule } from 'ng-zorro-antd/result';
import { TriSpinModule } from 'ng-zorro-antd/spin';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';
import { TriUploadFile, TriUploadModule, TriUploadXHRArgs } from 'ng-zorro-antd/upload';

export interface Categories {
  direction: string[];
  suggestion: string[];
  logo: string[];
  data: string[];
  edit: string[];
  other?: string[];
}

declare global {
  interface Window {
    antdIconClassifier: AntdIconClassifier;
  }
}

interface AntdIconClassifier {
  load: () => Promise<void>;
  predict: (element: HTMLElement) => Result[];
}

interface Result {
  className: string;
  score: number;
}

interface Icon {
  type: string;
  score: number;
}

const direction = [
  'StepBackward',
  'StepForward',
  'FastBackward',
  'FastForward',
  'Shrink',
  'ArrowsAlt',
  'Down',
  'Up',
  'Left',
  'Right',
  'CaretUp',
  'CaretDown',
  'CaretLeft',
  'CaretRight',
  'UpCircle',
  'DownCircle',
  'LeftCircle',
  'RightCircle',
  'DoubleRight',
  'DoubleLeft',
  'VerticalLeft',
  'VerticalRight',
  'VerticalAlignTop',
  'VerticalAlignMiddle',
  'VerticalAlignBottom',
  'Forward',
  'Backward',
  'Rollback',
  'Enter',
  'Retweet',
  'Swap',
  'SwapLeft',
  'SwapRight',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PlayCircle',
  'UpSquare',
  'DownSquare',
  'LeftSquare',
  'RightSquare',
  'Login',
  'Logout',
  'MenuFold',
  'MenuUnfold',
  'BorderBottom',
  'BorderHorizontal',
  'BorderInner',
  'BorderOuter',
  'BorderLeft',
  'BorderRight',
  'BorderTop',
  'BorderVerticle',
  'PicCenter',
  'PicLeft',
  'PicRight',
  'RadiusBottomleft',
  'RadiusBottomright',
  'RadiusUpleft',
  'RadiusUpright',
  'Fullscreen',
  'FullscreenExit'
];

const suggestion = [
  'Question',
  'QuestionCircle',
  'Plus',
  'PlusCircle',
  'Pause',
  'PauseCircle',
  'Minus',
  'MinusCircle',
  'PlusSquare',
  'MinusSquare',
  'Info',
  'InfoCircle',
  'Exclamation',
  'ExclamationCircle',
  'Close',
  'CloseCircle',
  'CloseSquare',
  'Check',
  'CheckCircle',
  'CheckSquare',
  'ClockCircle',
  'Warning',
  'IssuesClose',
  'Stop'
];

const edit = [
  'Edit',
  'Form',
  'Copy',
  'Scissor',
  'Delete',
  'Snippets',
  'Diff',
  'Highlight',
  'AlignCenter',
  'AlignLeft',
  'AlignRight',
  'BgColors',
  'Bold',
  'Italic',
  'Underline',
  'Strikethrough',
  'Redo',
  'Undo',
  'ZoomIn',
  'ZoomOut',
  'FontColors',
  'FontSize',
  'LineHeight',
  'Dash',
  'SmallDash',
  'SortAscending',
  'SortDescending',
  'Drag',
  'OrderedList',
  'UnorderedList',
  'RadiusSetting',
  'ColumnWidth',
  'ColumnHeight'
];

const data = [
  'AreaChart',
  'PieChart',
  'BarChart',
  'DotChart',
  'LineChart',
  'RadarChart',
  'HeatMap',
  'Fall',
  'Rise',
  'Stock',
  'BoxPlot',
  'Fund',
  'Sliders'
];

const logo = [
  'Android',
  'Apple',
  'Windows',
  'Linux',
  'Ie',
  'Chrome',
  'Github',
  'Aliwangwang',
  'Dingding',
  'Dingtalk',
  'WeiboSquare',
  'WeiboCircle',
  'Weibo',
  'Taobao',
  'TaobaoCircle',
  'Twitter',
  'Wechat',
  'Youtube',
  'AlipayCircle',
  'Skype',
  'Qq',
  'MediumWorkmark',
  'Gitlab',
  'Medium',
  'Linkedin',
  'GooglePlus',
  'Dropbox',
  'Facebook',
  'Html5',
  'Java',
  'JavaScript',
  'Python',
  'Docker',
  'Kubernetes',
  'Ruby',
  'DotNet',
  'Codepen',
  'CodeSandbox',
  'CodeSandboxCircle',
  'Amazon',
  'Google',
  'CodepenCircle',
  'Alipay',
  'AntDesign',
  'AntCloud',
  'Aliyun',
  'Zhihu',
  'Slack',
  'SlackSquare',
  'Behance',
  'BehanceSquare',
  'Dribbble',
  'DribbbleSquare',
  'Instagram',
  'Yuque',
  'Alibaba',
  'Yahoo',
  'Reddit',
  'Discord',
  'Sketch',
  'Baidu',
  'Bilibili',
  'HarmonyOS',
  'OpenAI',
  'Pinterest',
  'Spotify',
  'TikTok',
  'Twitch',
  'WechatWork',
  'WhatsApp',
  'X'
];

const categories: Categories = {
  direction,
  suggestion,
  edit,
  data,
  logo
};

const newIconNames: string[] = [
  // direction
  'border-outter',
  'radius-upright',
  // suggestion
  // edit
  'colum-width',
  // data
  // other
  'eye-invisible',
  'batch-folding',
  // logo
  'code-sandbox',
  'code-sandbox-circle'
];

declare const locale: TriSafeAny;

@Component({
  selector: 'tri-page-demo-icon',
  imports: [
    FormsModule,
    TriBadgeModule,
    TriButtonModule,
    TriIconModule,
    TriInputModule,
    TriModalModule,
    TriPopoverModule,
    TriRadioModule,
    TriResultModule,
    TriSpinModule,
    TriTooltipModule,
    TriProgressModule,
    TriUploadModule
  ],
  template: `
    <h3>{{ localeObj.chooseTheme }}</h3>
    <div class="icon-selector">
      <tri-radio-group [ngModel]="currentTheme" (ngModelChange)="setIconsShouldBeDisplayed($event)">
        <label tri-radio-button value="outline">
          <tri-icon>
            <svg>
              <path
                d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z m-12 800H172c-6.6 0-12-5.4-12-12V172c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v680c0 6.6-5.4 12-12 12z"
              ></path>
            </svg>
          </tri-icon>
          Outlined
        </label>
        <label tri-radio-button value="fill">
          <tri-icon>
            <svg>
              <path
                d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z"
              ></path>
            </svg>
          </tri-icon>
          Filled
        </label>
        <label tri-radio-button value="twotone">
          <tri-icon>
            <svg>
              <path
                d="M16 512c0 273.932 222.066 496 496 496s496-222.068 496-496S785.932 16 512 16 16 238.066 16 512z m496 368V144c203.41 0 368 164.622 368 368 0 203.41-164.622 368-368 368z"
              ></path>
            </svg>
          </tri-icon>
          Two Tone
        </label>
      </tri-radio-group>
      <tri-input-group search [suffix]="suffixIconCamera" [addOnAfter]="addOnAfterIconSearch">
        <input
          tri-input
          [placeholder]="localeObj.search"
          [(ngModel)]="searchingString"
          (ngModelChange)="onSearchChange()"
        />
      </tri-input-group>
      <ng-template #suffixIconCamera>
        <div class="icon-pic-searcher">
          <tri-icon
            class="icon-pic-btn"
            tri-popover
            [popoverTrigger]="null"
            [(popoverVisibleChange)]="popoverVisible"
            [popoverContent]="localeObj.picSearcherIntro"
            (click)="toggleModal()"
          >
            <svg viewBox="64 64 896 896">
              <path
                d="M864 248H728l-32.4-90.8a32.07 32.07 0 00-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80zm8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456zM512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"
              ></path>
            </svg>
          </tri-icon>
        </div>
      </ng-template>
      <ng-template #addOnAfterIconSearch>
        <button tri-button type="default" search>
          <tri-icon type="search"></tri-icon>
        </button>
      </ng-template>
    </div>
    @for (category of categoryNames; track category; let i = $index) {
      <h3>{{ localeObj[category] }}</h3>
      <ul class="anticons-list">
        @for (icon of displayedNames[i].icons; track trackByFn(icon)) {
          <li (click)="onIconClick($event, icon)">
            <tri-icon [type]="kebabCase(icon)" [theme]="currentTheme"></tri-icon>
            <span class="anticon-class">
              @if (isNewIcon(icon)) {
                <tri-badge dot>
                  {{ icon }}
                </tri-badge>
              } @else {
                {{ icon }}
              }
            </span>
          </li>
        }
      </ul>
    }
    <tri-modal
      [title]="localeObj.picSearcherTitle"
      [(visibleChange)]="modalVisible"
      (onCancel)="toggleModal()"
      [footer]="null"
    >
      <ng-container *modalContent>
        @if (modelLoaded) {
          <tri-upload
            type="drag"
            accept="image/jpeg, image/png"
            listType="picture"
            [customRequest]="customRequestUploadFile"
            [fileList]="fileList"
            [showUploadList]="{ showPreviewIcon: false, showRemoveIcon: false }"
          >
            <p class="tri-upload-drag-icon">
              <tri-icon type="inbox" theme="outline"></tri-icon>
            </p>
            <p class="tri-upload-text">{{ localeObj.picSearcherUploadText }}</p>
            <p class="tri-upload-hint">{{ localeObj.picSearcherUploadHint }}</p>
          </tri-upload>
          <tri-spin [spinning]="loading" [tip]="localeObj.picSearcherMatching">
            <div class="icon-pic-search-result">
              @if (icons.length) {
                <div class="result-tip">
                  {{ localeObj.picSearcherResultTip }}
                </div>
                <table>
                  <thead>
                    <tr>
                      <th class="col-icon">
                        {{ localeObj.picSearcherThIcon }}
                      </th>
                      <th>{{ localeObj.picSearcherThScore }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (icon of icons; track icon) {
                      <tr>
                        <td class="col-icon">
                          <tri-icon
                            tri-tooltip
                            [tooltipTitle]="icon.type"
                            tooltipPlacement="right"
                            [type]="icon.type"
                            [theme]="currentTheme"
                            (click)="onIconClick($event, icon.type)"
                          >
                          </tri-icon>
                        </td>
                        <td>
                          <tri-progress strokeLinecap="round" [percent]="icon.score"></tri-progress>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
              @if (error) {
                <tri-result status="500" title="503" [subTitle]="localeObj.picSearcherServerError" />
              }
            </div>
          </tri-spin>
        } @else {
          <tri-spin [tip]="localeObj.picSearcherModelLoading">
            <div style="height: 100px;"></div>
          </tri-spin>
        }
      </ng-container>
    </tri-modal>
  `,
  styles: [
    `
      h3 {
        margin: 1.6em 0 0.6em;
        font-size: 18px;
      }

      ul.anticons-list li .anticon {
        font-size: 24px;
      }

      .icon-selector {
        display: flex;
        justify-content: space-between;
      }

      nz-input-group {
        margin-left: 10px;
        flex: 1 1 0;
      }
    `
  ]
})
export class TriPageDemoIconComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private message = inject(TriMessageService);
  private viewContainerRef = inject(ViewContainerRef);

  displayedNames: Array<{ name: string; icons: string[] }> = [];
  categoryNames: string[] = [];
  currentTheme: ThemeType = 'outline';
  localeObj: Record<string, string> = locale;
  searchingString = '';

  error = false;
  loading = false;
  modelLoaded = false;
  modalVisible = false;
  popoverVisible = false;
  fileList: TriUploadFile[] = [];
  icons: Icon[] = [];

  private document: Document = inject(DOCUMENT);

  trackByFn = (item: string): string => `${item}-${this.currentTheme}`;

  kebabCase = (str: string): string => kebabCase(str);

  isNewIcon = (name: string): boolean => newIconNames.indexOf(name) > -1;

  onIconClick(e: MouseEvent, icon: string): void {
    const target = e.target as HTMLElement;
    const copiedString = `<nz-icon nzType="${kebabCase(icon)}" nzTheme="${this.currentTheme}" />`;
    target.classList.add('copied');
    this._copy(copiedString).then(() => {
      setTimeout(() => {
        target.classList.remove('copied');
      }, 1000);
    });

    const content = this.getCopiedStringTemplateRef(copiedString);
    this.message.success(content);
  }

  private _copy(value: string): Promise<string> {
    return new Promise<string>((resolve): void => {
      let copyTextArea: HTMLTextAreaElement | null = null;
      try {
        copyTextArea = this.document.createElement('textarea') as HTMLTextAreaElement;
        copyTextArea.style.height = '0px';
        copyTextArea.style.opacity = '0';
        copyTextArea.style.width = '0px';
        this.document.body.appendChild(copyTextArea);
        copyTextArea.value = value;
        copyTextArea.select();
        this.document.execCommand('copy');
        resolve(value);
      } finally {
        if (copyTextArea && copyTextArea.parentNode) {
          copyTextArea.parentNode.removeChild(copyTextArea);
        }
      }
    });
  }

  prepareIcons(): void {
    const theme = this.currentTheme;

    const currentThemeIcons = (manifest[theme] as string[])
      .filter((name: string) => !['interation', 'canlendar'].includes(name))
      .map(name => upperCamelCase(name));

    let notEmptyCategories = Object.keys(categories).map(category => ({
      name: category,
      icons: categories[category as keyof Categories]!.filter(
        (name: string) =>
          currentThemeIcons.indexOf(name) > -1 && name.toLowerCase().includes(this.searchingString.toLowerCase())
      )
    }));

    const otherIcons = currentThemeIcons
      .filter(icon => notEmptyCategories.filter(({ name }) => name !== 'all').every(item => !item.icons.includes(icon)))
      .filter(name => name.toLowerCase().includes(this.searchingString.toLocaleLowerCase()));

    notEmptyCategories.push({ name: 'other', icons: otherIcons });
    notEmptyCategories = notEmptyCategories.filter(({ icons }) => Boolean(icons.length));

    this.displayedNames = notEmptyCategories;
    this.categoryNames = notEmptyCategories.map(({ name }) => name);
  }

  setIconsShouldBeDisplayed(theme: ThemeType): void {
    this.currentTheme = theme;
    this.prepareIcons();
  }

  onSearchChange(): void {
    this.prepareIcons();
  }

  private getCopiedStringTemplateRef(copiedString: string): TemplateRef<void> {
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(TriPageDemoIconCopiedCodeComponent);
    componentRef.instance.copiedCode = copiedString;

    return componentRef.instance.templateRef;
  }

  private loadModel(): void {
    if (window.antdIconClassifier) {
      this.onLoad();
      return;
    }

    const script = this.document.createElement('script');
    const source = 'https://cdn.jsdelivr.net/gh/lewis617/antd-icon-classifier@0.0/dist/main.js';
    script.type = 'text/javascript';
    script.src = source;
    script.onload = async () => {
      await window.antdIconClassifier?.load();
      this.onLoad();
    };
    script.onerror = () => {
      throw new Error(`${PREFIX} cannot load assets of antd icon classifier from source "${source}".`);
    };

    this.document.head.appendChild(script);
  }

  private onLoad(): void {
    this.modelLoaded = true;
    this.document.addEventListener('paste', this.onPaste as EventListener);
  }

  private onPaste = (event: ClipboardEvent): void => {
    const items = event.clipboardData && event.clipboardData.items;
    let file = null;
    if (items && items.length) {
      let i = 0;
      while (i < items.length) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
        i++;
      }
    }
    if (file) this.uploadFile(file);
  };

  // We don't need to upload it, so just fake api here
  customRequestUploadFile = (o: TriUploadXHRArgs): Subscription => {
    return of(true).subscribe(() => {
      this.uploadFile(o.file);
    });
  };

  private uploadFile = (file: File | TriUploadFile): void => {
    this.loading = true;
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.toImage(reader.result as string).then(this.predict);
      this.fileList = [{ uid: '1', name: file.name, status: 'done', url: reader.result as string }];
    };
    reader.readAsDataURL(file as File);
  };

  private toImage(url: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
      img.onload = function onload() {
        resolve(img);
      };
    });
  }

  private predict = (imgEl: HTMLImageElement): void => {
    try {
      const results = window.antdIconClassifier?.predict(imgEl);
      this.icons = results.map((r: Result) => ({
        score: Math.ceil(r.score * 100),
        type: r.className.replace(/\s/g, '-')
      }));
      this.loading = false;
      this.error = false;
    } catch {
      this.loading = false;
      this.error = true;
    }
  };

  toggleModal(): void {
    this.modalVisible = !this.modalVisible;
    this.popoverVisible = false;
    this.fileList = [];
    this.icons = [];

    if (!localStorage.getItem('disableIconTip')) {
      localStorage.setItem('disableIconTip', 'true');
    }
  }

  constructor() {
    // This is to test that tree shake works!
    inject(TriIconService).addIcon(AccountBookFill);

    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener('paste', this.onPaste as EventListener);
      this.viewContainerRef.clear();
    });
  }

  ngOnInit(): void {
    this.setIconsShouldBeDisplayed('outline');
    // load model in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadModel();
      this.popoverVisible = !localStorage.getItem('disableIconTip');
    }
  }
}

@Component({
  selector: 'tri-page-demo-icon-copied-code',
  template: `
    <ng-template #templateRef>
      <span>
        <code class="copied-code">{{ copiedCode }}</code> copied 🎉
      </span>
    </ng-template>
  `
})
export class TriPageDemoIconCopiedCodeComponent {
  @Input() copiedCode!: string;
  @ViewChild('templateRef', { static: true }) templateRef!: TemplateRef<void>;
}

function camelCase(value: string): string {
  return value.replace(/-\w/g, (_r, i) => value.charAt(i + 1).toUpperCase());
}

function upperCamelCase(value: string): string {
  const camelCased = camelCase(value);
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}

function kebabCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([a-zA-Z]+)$/g, '-$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
