/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { TriTSType } from 'ng-zorro-antd/core/types';
import { TriI18nService, TriTextI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-text-copy',
  exportAs: 'triTextCopy',
  template: `
    <button
      type="button"
      tri-tooltip
      tri-trans-button
      [tooltipTitle]="copied ? copedTooltip : copyTooltip"
      class="tri-typography-copy"
      [class.tri-typography-copy-success]="copied"
      (click)="onClick()"
    >
      <ng-container *stringTemplateOutlet="copied ? copedIcon : copyIcon; let icon">
        <tri-icon [type]="icon" />
      </ng-container>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriTooltipModule, TriTransButtonModule, TriIconModule, TriOutletModule]
})
export class TriTextCopyComponent implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);
  private clipboard = inject(Clipboard);
  private i18n = inject(TriI18nService);
  private destroyRef = inject(DestroyRef);

  copied = false;
  copyId?: ReturnType<typeof setTimeout>;
  locale!: TriTextI18nInterface;
  nativeElement = inject(ElementRef).nativeElement;
  copyTooltip: TriTSType | null = null;
  copedTooltip: TriTSType | null = null;
  copyIcon: TriTSType = 'copy';
  copedIcon: TriTSType = 'check';

  @Input() text!: string;
  @Input() tooltips?: [TriTSType, TriTSType] | null;
  @Input() icons: [TriTSType, TriTSType] = ['copy', 'check'];

  @Output() readonly textCopy = new EventEmitter<string>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.copyId);
    });
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.updateTooltips();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { tooltips, icons } = changes;
    if (tooltips) {
      this.updateTooltips();
    }
    if (icons) {
      this.updateIcons();
    }
  }

  onClick(): void {
    if (this.copied) {
      return;
    }
    this.copied = true;
    this.cdr.detectChanges();
    const text = this.text;
    this.textCopy.emit(text);
    this.clipboard.copy(text);
    this.onCopied();
  }

  onCopied(): void {
    clearTimeout(this.copyId);
    this.copyId = setTimeout(() => {
      this.copied = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  private updateTooltips(): void {
    if (this.tooltips === null) {
      this.copedTooltip = null;
      this.copyTooltip = null;
    } else if (Array.isArray(this.tooltips)) {
      const [copyTooltip, copedTooltip] = this.tooltips;
      this.copyTooltip = copyTooltip || this.locale?.copy;
      this.copedTooltip = copedTooltip || this.locale?.copied;
    } else {
      this.copyTooltip = this.locale?.copy;
      this.copedTooltip = this.locale?.copied;
    }
    this.cdr.markForCheck();
  }

  private updateIcons(): void {
    const [copyIcon, copedIcon] = this.icons;
    this.copyIcon = copyIcon;
    this.copedIcon = copedIcon;
    this.cdr.markForCheck();
  }
}
