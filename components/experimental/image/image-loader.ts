/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isNil } from 'ng-zorro-antd/core/util';

import { TriImageSrcLoader } from './typings';
import { normalizeSrc } from './utils';

export const defaultImageSrcLoader: TriImageSrcLoader = ({ src }) => {
  return src;
};

/**
 * AliObjectsLoader return format
 * {domain}/{src}?x-oss-process=image/resize,w_{width}
 */
export function createAliObjectsLoader(domain: string): TriImageSrcLoader {
  return ({ src, width }) => {
    const params = isNil(width) ? '' : `?x-oss-process=image/resize,w_${width}`;
    return `${domain}/${normalizeSrc(src)}${params}`;
  };
}

/**
 * ImgixLoader return format
 * {domain}/{src}?format=auto&fit=max&w={width}
 */
export function createImgixLoader(domain: string): TriImageSrcLoader {
  return ({ src, width }) => {
    const params = isNil(width) ? '' : `&fit=max&w=${width}`;
    return `${domain}/${normalizeSrc(src)}?format=auto${params}`;
  };
}

/**
 * CloudinaryLoader return format
 * {domain}/c_limit,q_auto,w_{width}/{src}
 */
export function createCloudinaryLoader(domain: string): TriImageSrcLoader {
  return ({ src, width }) => {
    const params = isNil(width) ? '' : `,w_${width}`;
    return `${domain}/c_limit,q_auto${params}/${normalizeSrc(src)}`;
  };
}
