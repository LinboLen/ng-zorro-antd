/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  CSP_NONCE,
  DestroyRef,
  Injectable,
  afterNextRender,
  assertInInjectionContext,
  inject,
  Signal,
  computed,
  WritableSignal,
  signal,
  InputSignalWithTransform,
  InputSignal
} from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TRI_CONFIG, TriConfig, TriConfigKey } from './config';
import { registerTheme } from './css-variables';

const isDefined = function (value?: TriSafeAny): boolean {
  return value !== undefined;
};

const defaultPrefixCls = 'ant';

@Injectable({
  providedIn: 'root'
})
export class TriConfigService {
  private configUpdated$ = new Subject<keyof TriConfig>();

  /**
   * Sharing config signals for all components, used for {@link withConfigFactory}
   * @internal
   * @todo use nested signal to refactor the whole config service
   */
  private readonly _configMap = new Map<TriConfigKey, WritableSignal<TriConfig[TriConfigKey]>>();

  /** Global config holding property. */
  private readonly config: TriConfig = inject(TRI_CONFIG, { optional: true }) || {};

  private readonly cspNonce: string | null = inject(CSP_NONCE, { optional: true });

  constructor() {
    if (this.config.theme) {
      // If theme is set with NZ_CONFIG, register theme to make sure css variables work
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, this.cspNonce);
    }
  }

  private _getConfigValue<T extends TriConfigKey>(componentName: T): WritableSignal<TriConfig[T]> {
    let configValue = this._configMap.get(componentName) as WritableSignal<TriConfig[T]>;
    if (configValue) {
      return configValue;
    }

    configValue = signal(this.config[componentName]);
    this._configMap.set(componentName, configValue);
    return configValue;
  }

  getConfig(): TriConfig {
    return this.config;
  }

  getConfigForComponent<T extends TriConfigKey>(componentName: T): TriConfig[T] {
    return this.config[componentName];
  }

  getConfigChangeEventForComponent(componentName: TriConfigKey): Observable<void> {
    return this.configUpdated$.pipe(
      filter(n => n === componentName),
      map(() => undefined)
    );
  }

  set<T extends TriConfigKey>(componentName: T, value: TriConfig[T]): void {
    this.config[componentName] = { ...this.config[componentName], ...value };
    this._configMap.get(componentName)?.set(this.config[componentName]);
    if (componentName === 'theme' && this.config.theme) {
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, this.cspNonce);
    }
    this.configUpdated$.next(componentName);
  }
}

/**
 * Subscribes to configuration change events for a specific NZ component after the next render cycle.
 *
 * This utility is intended for use within Angular injection contexts and handles automatic
 * unsubscription via `DestroyRef`. It returns a cleanup function that can be manually called
 * to unsubscribe early if needed.
 *
 * @param componentName - The name of the component (as defined in `NzConfigKey`) to listen for config changes.
 * @param callback - A function to invoke when the component's configuration changes.
 * @returns A cleanup function that destroys the post-render effect and unsubscribes from the config event.
 *
 * @throws If called outside of an Angular injection context (in dev mode).
 */
export function onConfigChangeEventForComponent(componentName: TriConfigKey, callback: () => void): () => void {
  if (typeof ngDevMode !== 'undefined' && ngDevMode) {
    assertInInjectionContext(onConfigChangeEventForComponent);
  }

  const destroyRef = inject(DestroyRef);
  const nzConfigService = inject(TriConfigService);
  let subscription: Subscription | null = null;

  const ref = afterNextRender(() => {
    subscription = nzConfigService
      .getConfigChangeEventForComponent(componentName)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(callback);
  });

  return () => {
    ref.destroy();
    subscription?.unsubscribe();
  };
}

/**
 * This decorator is used to decorate class field. If a class field is decorated and unassigned, it would try to load default value from `NZ_CONFIG`
 *
 * @note that the class must have `_nzModuleName`({@link TriConfigKey}) property.
 * @example
 * ```ts
 * class ExampleComponent {
 *   private readonly _nzModuleName: NzConfigKey = 'button';
 *   @WithConfig() size: string = 'default';
 * }
 * ```
 */
export function WithConfig<This, Value>() {
  return function (_value: undefined, context: ClassFieldDecoratorContext<This, Value>) {
    context.addInitializer(function () {
      const nzConfigService = inject(TriConfigService);
      const originalValue = this[context.name as keyof This];

      let value: Value;
      let assignedByUser = false;

      Object.defineProperty(this, context.name, {
        get: () => {
          const configValue = nzConfigService.getConfigForComponent(
            this['_nzModuleName' as keyof This] as TriConfigKey
          )?.[context.name as keyof TriConfig[TriConfigKey]];

          if (assignedByUser) {
            return value;
          }

          if (isDefined(configValue)) {
            return configValue;
          }

          return originalValue;
        },
        set: (newValue: Value) => {
          // if the newValue is undefined, we also consider it as not assigned by user
          assignedByUser = isDefined(newValue);
          value = newValue;
        },
        enumerable: true,
        configurable: true
      });
    });
  };
}

/**
 * Generate a `withConfig` function for a specific component, which would try to load default value from `NZ_CONFIG`
 * if the `input` property is not assigned by user.
 *
 * @param componentName The name of component (as defined in {@link TriConfigKey}) to listen for config changes.
 * @example
 * ```ts
 * const withConfig = withConfigFactory('button');
 *
 * class ExampleComponent {
 *   readonly nzSize = input<NzButtonSize>('default');
 *   protected readonly size = withConfig('nzSize', this.nzSize);
 * }
 * ```
 */
export function withConfigFactory<T extends TriConfigKey>(componentName: T) {
  return <N extends keyof NonNullable<TriConfig[T]>, V = NonNullable<TriConfig[T]>[N]>(
    name: N,
    inputSignal: InputSignal<V> | InputSignalWithTransform<V, unknown>
  ): Signal<V> => {
    const originalValue = inputSignal();
    const configValueSignal = inject(TriConfigService)['_getConfigValue'](componentName);

    return computed<V>(() => {
      const configValue = configValueSignal()?.[name] as V | undefined;
      const inputValue = inputSignal();
      // if the version of the inputSignal is 0 or the inputValue is undefined, we consider it as not assigned by user
      const assignedByUser = inputSignal[SIGNAL].version > 0 && isDefined(inputValue);

      if (assignedByUser) {
        return inputValue;
      } else if (configValue !== undefined) {
        return configValue;
      }

      return originalValue;
    });
  };
}
