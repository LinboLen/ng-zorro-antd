/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Locale } from 'date-fns';

export interface TriPaginationI18nInterface {
  items_per_page: string;
  jump_to: string;
  jump_to_confirm: string;
  page: string;

  // Pagination.jsx
  prev_page: string;
  next_page: string;
  prev_5: string;
  next_5: string;
  prev_3: string;
  next_3: string;
}

export interface TriGlobalI18nInterface {
  placeholder: string;
}

export interface TriDatePickerI18nInterface {
  lang: TriDatePickerLangI18nInterface;
  timePickerLocale: TriTimePickerI18nInterface;
}

export interface TriCalendarI18nInterface {
  today: string;
  now: string;
  backToToday: string;
  ok: string;
  clear: string;
  month: string;
  year: string;
  timeSelect: string;
  dateSelect: string;
  monthSelect: string;
  yearSelect: string;
  decadeSelect: string;
  yearFormat: string;
  monthFormat?: string;
  dateFormat: string;
  dayFormat: string;
  dateTimeFormat: string;
  monthBeforeYear?: boolean;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousDecade: string;
  nextDecade: string;
  previousCentury: string;
  nextCentury: string;
}

export interface TriDatePickerLangI18nInterface extends TriCalendarI18nInterface {
  placeholder?: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  rangePlaceholder?: string[];
  rangeYearPlaceholder?: string[];
  rangeQuarterPlaceholder?: string[];
  rangeMonthPlaceholder?: string[];
  rangeWeekPlaceholder?: string[];
}

export interface TriTimePickerI18nInterface {
  placeholder?: string;
  rangePlaceholder?: string[];
}

export type ValidateMessage = string | (() => string);

export type TriCascaderI18nInterface = TriGlobalI18nInterface;

export interface TriTableI18nInterface {
  filterTitle?: string;
  filterConfirm?: string;
  filterReset?: string;
  selectAll?: string;
  selectInvert?: string;
  selectionAll?: string;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export interface TriModalI18nInterface {
  okText: string;
  cancelText: string;
  justOkText: string;
}

export interface TriPopconfirmI18nInterface {
  okText: string;
  cancelText: string;
}

export interface TriTransferI18nInterface {
  titles?: string[];
  searchPlaceholder?: string;
  itemUnit?: string;
  itemsUnit?: string;
}

export interface TriUploadI18nInterface {
  uploading?: string;
  removeFile?: string;
  uploadError?: string;
  previewFile?: string;
  downloadFile?: string;
}

export interface TriEmptyI18nInterface {
  description: string;
}

export interface TriTextI18nInterface {
  edit: string;
  copy: string;
  copied: string;
  expand: string;
}

export interface TriCronExpressionLabelI18n {
  second?: string;
  minute?: string;
  hour?: string;
  day?: string;
  month?: string;
  week?: string;
}

export interface TriCronExpressionCronErrorI18n {
  cronError?: string;
}

export type TriCronExpressionI18nInterface = TriCronExpressionCronErrorI18n & TriCronExpressionLabelI18n;

export interface TriQRCodeI18nInterface {
  expired: string;
  refresh: string;
  scanned: string;
}

export interface TriCheckListI18nInterface {
  checkList: string;
  checkListFinish: string;
  checkListClose: string;
  checkListFooter: string;
  checkListCheck: string;
  ok: string;
  cancel: string;
  checkListCheckOther: string;
}

export interface TriFormI18nInterface {
  optional: string;
}

export interface TriI18nInterface {
  locale: string;
  Pagination: TriPaginationI18nInterface;
  DatePicker: TriDatePickerI18nInterface;
  TimePicker: TriTimePickerI18nInterface;
  Calendar: TriDatePickerI18nInterface;
  global?: TriGlobalI18nInterface;
  Table: TriTableI18nInterface;
  Modal: TriModalI18nInterface;
  Popconfirm: TriPopconfirmI18nInterface;
  Transfer: TriTransferI18nInterface;
  Upload: TriUploadI18nInterface;
  Empty: TriEmptyI18nInterface;
  Form: TriFormI18nInterface;
  Text?: TriTextI18nInterface;
  CronExpression?: TriCronExpressionI18nInterface;
  QRCode?: TriQRCodeI18nInterface;
  CheckList?: TriCheckListI18nInterface;
}

export type DateLocale = Locale;
