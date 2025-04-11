// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import type { IPlayInfoListItem, IVideoModel } from '@/interface';
export * from './preload';

function getOS(): {
  isTablet?: boolean;
  isPhone?: boolean;
  isIpad?: boolean;
  isIos?: boolean;
  isAndroid?: boolean;
  isPc?: boolean;
  isMobile?: boolean;
  isFireFox?: boolean;
  isChrome?: boolean;
  isWeixin?: boolean;
  isLark?: boolean;
} {
  if (typeof navigator === 'undefined') {
    return {};
  }
  const ua = navigator.userAgent;
  const isAndroid = /(?:Android)/.test(ua);
  const isFireFox = /(?:Firefox)/.test(ua);
  const isChrome = /(?:Chrome)/.test(ua);
  const isIpad = /(?:iPad|PlayBook)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isTablet = isIpad || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
  const isPc = !isPhone && !isAndroid && !isTablet;
  const isWeixin = /(?:micromessenger)/.test(ua.toLocaleLowerCase());
  const isLark = /(?:lark)/.test(ua.toLocaleLowerCase());
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  return {
    isTablet,
    isPhone,
    isIpad,
    isIos: isPhone || isIpad,
    isAndroid,
    isPc,
    isMobile: isPhone || isAndroid || isSymbian || isTablet,
    isFireFox,
    isChrome,
    isWeixin,
    isLark,
  };
}

export const os = getOS();

export function parseModel(videoModel: string): undefined | IVideoModel {
  if (!videoModel) return;
  try {
    return JSON.parse(videoModel);
  } catch (err) {
    console.warn('parse videoModel error: ', err);
  }
}

export function isWifi() {
  try {
    let wifi = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const con = window.navigator.connection;
    if (con) {
      const network = con.type;
      if (network === 'wifi') {
        wifi = true;
      }
    }
    return wifi;
  } catch (e) {
    return false;
  }
}

/**
 * Select the definition based on the environment
 * @param list The list of definitions
 * @param defaultDef The default definition for weak networks
 */
export function selectDef(list: IPlayInfoListItem[], defaultDef = '720p'): undefined | IPlayInfoListItem {
  if (!list.length) {
    return;
  }
  const orderList = list.sort((a, b) => a.Bitrate - b.Bitrate);
  const lowestDef = orderList[0];
  const highestDef = orderList[orderList.length - 1];
  if (os.isPc) {
    // pc uses the highest bitrate
    return highestDef;
  } else {
    // In other environments, such as h5
    if (isWifi()) {
      // wifi uses the highest bitrate
      return highestDef;
    } else {
      const target = list.find(item => item.Definition === defaultDef);
      if (target) {
        return target;
      } else {
        return lowestDef;
      }
    }
  }
}

export function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

export const canSupportPreload = os.isPc || os.isAndroid;

/** Compatible writing for getting the current device width and height */
export function getDeciceWidth(): { width: number; height: number } {
  const docEl = document.documentElement;
  const width =
    docEl.clientWidth || docEl.getBoundingClientRect().width || document.body.clientWidth || window.screen.width || 0;
  const height =
    docEl.clientHeight ||
    docEl.getBoundingClientRect().height ||
    document.body.clientHeight ||
    window.screen.height ||
    0;

  return {
    width,
    height,
  };
}

/** Get whether the current phone is horizontal */
export const getIsLandscape = () => {
  if (window.screen.orientation?.type) {
    return window.screen.orientation?.type.includes('landscape');
  }
  // Old orientation detection scheme (compatible)
  if (window.orientation) {
    return [90, -90, '90', '-90'].includes(window.orientation);
  }

  // iframe and browsers that do not support orientation (compatible)
  const { width, height } = getDeciceWidth();
  return width > height;
};

// Screen rotation monitoring
export const bindOrientationEvents = (isBind: boolean, fn: () => void) => {
  const eventName = window.orientation !== undefined ? 'orientationchange' : 'resize';
  if (isBind) {
    window.addEventListener(eventName, fn);
  } else {
    window.removeEventListener(eventName, fn);
  }
};

export const imgUrl = (url: string, prefix?: string) => {
  if (os.isChrome) {
    // Currently, only Chrome and Android have good support for webp
    url = url.replace(/.image$/, prefix || '.webp');
  }
  return url;
};
