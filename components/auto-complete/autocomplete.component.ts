/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AnimationEvent } from '@angular/animations';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, defer, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { slideMotion, TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { TRI_AFTER_NEXT_RENDER$ } from 'ng-zorro-antd/core/render';
import { CompareWith, TriSafeAny } from 'ng-zorro-antd/core/types';
import { numberAttributeWithZeroFallback } from 'ng-zorro-antd/core/util';

import { TriAutocompleteOptionComponent, TriOptionSelectionChange } from './autocomplete-option.component';

export interface AutocompleteDataSourceItem {
  value: string;
  label: string;
}

export type AutocompleteDataSource = Array<AutocompleteDataSourceItem | string | number>;

function normalizeDataSource(value: AutocompleteDataSource): AutocompleteDataSourceItem[] {
  return value?.map(item => {
    if (typeof item === 'number' || typeof item === 'string') {
      return {
        label: item.toString(),
        value: item.toString()
      };
    }
    return item;
  });
}

@Component({
  selector: 'tri-autocomplete',
  exportAs: 'triAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet, TriAutocompleteOptionComponent, TriNoAnimationDirective],
  template: `
    <ng-template>
      <div
        #panel
        class="tri-select-dropdown tri-select-dropdown-placement-bottomLeft"
        [class.tri-select-dropdown-hidden]="!showPanel"
        [class.tri-select-dropdown-rtl]="dir === 'rtl'"
        [class]="overlayClassName"
        [style]="overlayStyle"
        [noAnimation]="noAnimation?.nzNoAnimation?.()"
        @slideMotion
        (@slideMotion.done)="onAnimationEvent($event)"
        [@.disabled]="!!noAnimation?.nzNoAnimation?.()"
      >
        <div class="tri-select-dropdown-content-wrapper">
          <div class="tri-select-dropdown-content">
            <ng-template *ngTemplateOutlet="dataSource ? optionsTemplate : contentTemplate"></ng-template>
          </div>
        </div>
      </div>
      <ng-template #contentTemplate>
        <ng-content></ng-content>
      </ng-template>
      <ng-template #optionsTemplate>
        @for (option of normalizedDataSource; track option.value) {
          <tri-auto-option [value]="option.value" [label]="option.label">
            {{ option.label }}
          </tri-auto-option>
        }
      </ng-template>
    </ng-template>
  `,
  animations: [slideMotion]
})
export class TriAutocompleteComponent implements AfterContentInit, AfterViewInit, OnInit, OnChanges {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  @Input({ transform: numberAttributeWithZeroFallback }) width?: number;
  @Input() overlayClassName = '';
  @Input() overlayStyle: Record<string, string> = {};
  @Input({ transform: booleanAttribute }) defaultActiveFirstOption = true;
  @Input({ transform: booleanAttribute }) backfill = false;
  @Input() compareWith: CompareWith = (o1, o2) => o1 === o2;
  @Input() dataSource?: AutocompleteDataSource;
  @Output()
  readonly selectionChange: EventEmitter<TriAutocompleteOptionComponent> =
    new EventEmitter<TriAutocompleteOptionComponent>();

  showPanel: boolean = true;
  isOpen: boolean = false;
  activeItem: TriAutocompleteOptionComponent | null = null;
  dir: Direction = 'ltr';
  normalizedDataSource: AutocompleteDataSourceItem[] = [];
  animationStateChange = new EventEmitter<AnimationEvent>();

  /**
   * Options accessor, its source may be content or dataSource
   */
  get options(): QueryList<TriAutocompleteOptionComponent> {
    // first dataSource
    if (this.dataSource) {
      return this.fromDataSourceOptions;
    } else {
      return this.fromContentOptions;
    }
  }

  /** Provided by content */
  @ContentChildren(TriAutocompleteOptionComponent, { descendants: true })
  fromContentOptions!: QueryList<TriAutocompleteOptionComponent>;
  /** Provided by dataSource */
  @ViewChildren(TriAutocompleteOptionComponent) fromDataSourceOptions!: QueryList<TriAutocompleteOptionComponent>;

  /** cdk-overlay */
  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;
  @ViewChild('panel', { static: false }) panel?: ElementRef;
  @ViewChild('content', { static: false }) content?: ElementRef;

  private activeItemIndex: number = -1;
  private selectionChangeSubscription: Subscription | null = Subscription.EMPTY;
  private optionMouseEnterSubscription: Subscription | null = Subscription.EMPTY;
  private dataSourceChangeSubscription: Subscription | null = Subscription.EMPTY;

  /** Options changes listener */
  private readonly optionSelectionChanges: Observable<TriOptionSelectionChange> = defer(() => {
    if (this.options) {
      return merge<TriOptionSelectionChange[]>(...this.options.map(option => option.selectionChange));
    }

    return this.afterNextRender$.pipe(switchMap(() => this.optionSelectionChanges));
  });

  private readonly optionMouseEnter: Observable<TriAutocompleteOptionComponent> = defer(() => {
    if (this.options) {
      return merge<TriAutocompleteOptionComponent[]>(...this.options.map(option => option.mouseEntered));
    }

    return this.afterNextRender$.pipe(switchMap(() => this.optionMouseEnter));
  });

  private afterNextRender$ = inject(TRI_AFTER_NEXT_RENDER$);

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.dataSourceChangeSubscription!.unsubscribe();
      this.selectionChangeSubscription!.unsubscribe();
      this.optionMouseEnterSubscription!.unsubscribe();
      // Caretaker note: we have to set these subscriptions to `null` since these will be closed subscriptions, but they
      // still keep references to destinations (which are `SafeSubscriber`s). Destinations keep referencing `next` functions,
      // which we pass, for instance, to `this.optionSelectionChanges.subscribe(...)`.
      this.dataSourceChangeSubscription = this.selectionChangeSubscription = this.optionMouseEnterSubscription = null;
    });
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.changeDetectorRef.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDataSource } = changes;
    if (nzDataSource) {
      this.normalizedDataSource = normalizeDataSource(nzDataSource.currentValue);
    }
  }

  onAnimationEvent(event: AnimationEvent): void {
    this.animationStateChange.emit(event);
  }

  ngAfterContentInit(): void {
    if (!this.dataSource) {
      this.optionsInit();
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.optionsInit();
    }
  }

  setVisibility(): void {
    this.showPanel = !!this.options.length;
    this.changeDetectorRef.markForCheck();
  }

  setActiveItem(index: number): void {
    const activeItem = this.options.get(index);
    if (activeItem && !activeItem.active) {
      this.activeItem = activeItem;
      this.activeItemIndex = index;
      this.clearSelectedOptions(this.activeItem);
      this.activeItem.setActiveStyles();
    } else {
      this.activeItem = null;
      this.activeItemIndex = -1;
      this.clearSelectedOptions();
    }
    this.changeDetectorRef.markForCheck();
  }

  setNextItemActive(): void {
    const nextIndex = this.activeItemIndex + 1 <= this.options.length - 1 ? this.activeItemIndex + 1 : 0;
    this.setActiveItem(nextIndex);
  }

  setPreviousItemActive(): void {
    const previousIndex = this.activeItemIndex - 1 < 0 ? this.options.length - 1 : this.activeItemIndex - 1;
    this.setActiveItem(previousIndex);
  }

  getOptionIndex(value: TriSafeAny): number {
    return this.options.reduce(
      (result: number, current: TriAutocompleteOptionComponent, index: number) =>
        result === -1 ? (this.compareWith(value, current.value) ? index : -1) : result,
      -1
    )!;
  }

  getOption(value: TriSafeAny): TriAutocompleteOptionComponent | null {
    return this.options.find(item => this.compareWith(value, item.value)) || null;
  }

  private optionsInit(): void {
    this.setVisibility();
    this.subscribeOptionChanges();
    const changes = this.dataSource ? this.fromDataSourceOptions.changes : this.fromContentOptions.changes;
    // async
    this.dataSourceChangeSubscription = changes.subscribe(e => {
      if (!e.dirty && this.isOpen) {
        setTimeout(() => this.setVisibility());
      }
      this.subscribeOptionChanges();
    });
  }

  /**
   * Clear the status of options
   */
  clearSelectedOptions(skip?: TriAutocompleteOptionComponent | null, deselect: boolean = false): void {
    this.options.forEach(option => {
      if (option !== skip) {
        if (deselect) {
          option.deselect();
        }
        option.setInactiveStyles();
      }
    });
  }

  private subscribeOptionChanges(): void {
    this.selectionChangeSubscription!.unsubscribe();
    this.selectionChangeSubscription = this.optionSelectionChanges
      .pipe(filter((event: TriOptionSelectionChange) => event.isUserInput))
      .subscribe((event: TriOptionSelectionChange) => {
        event.source.select();
        event.source.setActiveStyles();
        this.activeItem = event.source;
        this.activeItemIndex = this.getOptionIndex(this.activeItem.value);
        this.clearSelectedOptions(event.source, true);
        this.selectionChange.emit(event.source);
      });

    this.optionMouseEnterSubscription!.unsubscribe();
    this.optionMouseEnterSubscription = this.optionMouseEnter.subscribe((event: TriAutocompleteOptionComponent) => {
      event.setActiveStyles();
      this.activeItem = event;
      this.activeItemIndex = this.getOptionIndex(this.activeItem.value);
      this.clearSelectedOptions(event);
    });
  }
}
