import { IPlayInfoListItem, IVideoModel } from '@/@types';
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
  isWeixin?: boolean;
  isLark?: boolean;
} {
  if (typeof navigator === 'undefined') {
    return {};
  }
  const ua = navigator.userAgent;
  const isAndroid = /(?:Android)/.test(ua);
  const isFireFox = /(?:Firefox)/.test(ua);
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
    isWeixin,
    isLark,
  };
}

export const os = getOS();

export function parseModel(videoModel: string): undefined | IVideoModel {
  try {
    return JSON.parse(videoModel);
  } catch (err) {
    console.warn('parse videoModel error: ', err);
  }
}

export function isWifi() {
  try {
    let wifi = false;
    const ua = window.navigator.userAgent;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const con = window.navigator.connection;
    // 如果是微信
    if (os.isWeixin) {
      if (ua.indexOf('WIFI') >= 0) {
        return true;
      }
      // 如果支持navigator.connection
    } else if (con) {
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
 * 根据环境选择清晰度
 * @param list 清晰度列表
 * @param defaultDef 弱网下的默认清晰度
 */
export function selectDef(list: IPlayInfoListItem[], defaultDef = '720p'): undefined | IPlayInfoListItem {
  if (!list.length) {
    return;
  }
  const orderList = list.sort((a, b) => a.Bitrate - b.Bitrate);
  const lowestDef = orderList[0];
  const highestDef = orderList[orderList.length - 1];
  if (os.isPc) {
    // pc使用最高码率
    return highestDef;
  } else {
    // 其他环境下，如h5
    if (isWifi()) {
      // wifi 下使用最高码率
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

/** 获取当前设备宽高的兼容写法 */
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

// 获取当前手机是否是横向
export const getIsLandscape = () => {
  if (window.screen.orientation?.type) {
    return window.screen.orientation?.type.includes('landscape');
  }
  // 旧的方向判断方案（兼容）
  if (window.orientation) {
    return [90, -90, '90', '-90'].includes(window.orientation);
  }

  // iframe及不支持orientation的浏览器（兼容）
  const { width, height } = getDeciceWidth();
  return width > height;
};

// hack
export const isHitBlackList = () => {
  // 1+手机自带浏览器  window.orientation window.screen.width 获取值存在问题，需要屏蔽
  const blacklist = ['HeyTapBrowser', 'DingTalk'];
  return blacklist.some(item => navigator.userAgent.includes(item));
};

// 屏幕旋转监听
export const bindOrientationEvents = (isBind: boolean, fn: () => void) => {
  if (isHitBlackList()) {
    return;
  }
  const eventName = window.orientation !== undefined ? 'orientationchange' : 'resize';
  if (isBind) {
    window.addEventListener(eventName, fn);
  } else {
    window.removeEventListener(eventName, fn);
  }
};
