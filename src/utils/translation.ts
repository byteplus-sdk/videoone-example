const translation = {
  home_title: {
    'zh-CN': '',
    en: 'VideoOne Center',
  },
  home_welcome: {
    'zh-CN': '',
    en: 'Welcome to the VideoOne Demo Center! Please select the scene of interest.',
  },
  home_video_tit: {
    'zh-CN': '',
    en: 'Interactive short video',
  },
  home_video_desc: {
    'zh-CN': '',
    en: 'Swipe up video, smooth playback, and video interaction experience',
  },
  tt_nav_tit: {
    'zh-CN': '',
    en: 'BytePlus VideoOne',
  },
  tt_nav_desc: {
    'zh-CN': '',
    en: 'Open it in "BytePlus VideoOne" App',
  },
  tt_unmute: {
    'zh-CN': '',
    en: 'Unmute',
  },
  tt_nav_btn: {
    'zh-CN': '',
    en: 'Open',
  },
  tt_guide: {
    'zh-CN': '',
    en: 'Slide up to view more videos',
  },
};

type ILang = 'zh-CN' | 'en' | 'zh';

export default (key: keyof typeof translation) => {
  let lang: ILang = window.navigator.language as ILang;
  if (lang === 'zh') {
    lang = 'zh-CN';
  }
  return translation[key]?.[lang] || translation[key]?.en;
};
