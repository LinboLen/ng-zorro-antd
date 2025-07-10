/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriTimelineMode = 'left' | 'alternate' | 'right' | 'custom';

export type TriTimelinePosition = 'left' | 'right';

export const TimelineTimeDefaultColors = ['red', 'blue', 'green', 'grey', 'gray'] as const;
export type TriTimelineItemColor = (typeof TimelineTimeDefaultColors)[number] | string;
