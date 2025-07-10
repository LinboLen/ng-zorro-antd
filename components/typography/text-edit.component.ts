/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { TriTSType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriI18nService, TriTextI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriAutosizeDirective, TriInputModule } from 'ng-zorro-antd/input';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: '',
  exportAs: 'triTextEdit',
  template: `
    @if (editing) {
      <textarea #textarea tri-input autosize (blur)="confirm()"></textarea>
      <button tri-trans-button class="tri-typography-edit-content-confirm" (click)="confirm()">
        <tri-icon type="enter" />
      </button>
    } @else {
      <button
        tri-tooltip
        tri-trans-button
        class="tri-typography-edit"
        [tooltipTitle]="tooltip === null ? null : tooltip || locale?.edit"
        (click)="onClick()"
      >
        <ng-container *stringTemplateOutlet="icon; let icon">
          <tri-icon [type]="icon" />
        </ng-container>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriInputModule, TriTransButtonModule, TriIconModule, TriToolTipModule, TriOutletModule]
})
export class TriTextEditComponent implements OnInit {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(TriI18nService);
  private destroyRef = inject(DestroyRef);

  editing = false;
  locale!: TriTextI18nInterface;

  @Input() text?: string;
  @Input() icon: TriTSType = 'edit';
  @Input() tooltip?: null | TriTSType;
  @Output() readonly startEditing = new EventEmitter<void>();
  @Output() readonly endEditing = new EventEmitter<string>(true);
  @ViewChild('textarea', { static: false })
  set textarea(textarea: ElementRef<HTMLTextAreaElement> | undefined) {
    this.textarea$.next(textarea);
  }
  @ViewChild(TriAutosizeDirective, { static: false }) autosizeDirective!: TriAutosizeDirective;

  beforeText?: string;
  currentText?: string;
  nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  // We could've saved the textarea within some private property (e.g. `_textarea`) and have a getter,
  // but having subject makes the code more reactive and cancellable (e.g., event listeners will be
  // automatically removed and re-added through the `switchMap` below).
  private textarea$ = new BehaviorSubject<ElementRef<HTMLTextAreaElement> | null | undefined>(null);

  private injector = inject(Injector);

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });

    this.textarea$
      .pipe(
        switchMap(textarea => fromEventOutsideAngular<KeyboardEvent>(textarea?.nativeElement, 'keydown')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        // Caretaker note: adding modifier at the end (for instance `(keydown.esc)`) will tell Angular to add
        // an event listener through the `KeyEventsPlugin`, which always runs `ngZone.runGuarded()` internally.
        // We're interested only in escape and enter keyboard buttons, otherwise Angular will run change detection
        // on any `keydown` event.
        if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
          return;
        }

        this.ngZone.run(() => {
          if (event.keyCode === ESCAPE) {
            this.onCancel();
          } else {
            this.onEnter(event);
          }
          this.cdr.markForCheck();
        });
      });

    this.textarea$
      .pipe(
        switchMap(textarea => fromEventOutsideAngular<KeyboardEvent>(textarea?.nativeElement, 'input')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.currentText = (event.target as HTMLTextAreaElement).value;
      });
  }

  onClick(): void {
    this.beforeText = this.text;
    this.currentText = this.beforeText;
    this.editing = true;
    this.startEditing.emit();
    this.focusAndSetValue();
  }

  confirm(): void {
    this.editing = false;
    this.endEditing.emit(this.currentText);
  }

  onEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.confirm();
  }

  onCancel(): void {
    this.currentText = this.beforeText;
    this.confirm();
  }

  focusAndSetValue(): void {
    const { injector } = this;

    afterNextRender(
      () => {
        this.textarea$
          .pipe(
            // It may still not be available, so we need to wait until view queries
            // are executed during the change detection. It's safer to wait until
            // the query runs, and the textarea is set on the behavior subject.
            first((textarea): textarea is ElementRef<HTMLTextAreaElement> => textarea != null),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(textarea => {
            textarea.nativeElement.focus();
            textarea.nativeElement.value = this.currentText || '';
            this.autosizeDirective.resizeToFitContent();
            this.cdr.markForCheck();
          });
      },
      { injector }
    );
  }
}
