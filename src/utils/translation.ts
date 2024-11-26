const translation = {
  home_title: {
    'zh-CN': 'VideoOne 体验中心',
    en: 'VideoOne Center',
  },
  home_welcome: {
    'zh-CN': '欢迎来到VideoOne Demo中心，请选择感兴趣的场景进入体验。',
    en: 'Welcome to the VideoOne Demo Center! Please select the scene of interest.',
  },
  home_video_tit: {
    'zh-CN': '互动视频',
    en: 'Interactive Video',
  },
  home_drama_tit: {
    'zh-CN': '短剧',
    en: 'Short drama',
  },
  home_video_desc: {
    'zh-CN': '视频上下滑，丝滑播放，视频互动体验',
    en: 'Swipe up video, smooth playback, and video interaction experience',
  },
  home_drama_desc: {
    'zh-CN': '精彩的短剧集、视频播放和广告插入',
    en: 'Exciting short drama episodes, Video playback and Ad insertions',
  },
  show_nav_tit: {
    'zh-CN': 'BytePlus VideoOne',
    en: 'BytePlus VideoOne',
  },
  show_nav_desc: {
    'zh-CN': '在App中获得完整体验',
    en: 'Get the full experience on the app',
  },
  show_unmute: {
    'zh-CN': '取消静音',
    en: 'Unmute',
  },
  show_nav_btn: {
    'zh-CN': '获取应用',
    en: 'Get app',
  },
  show_guide: {
    'zh-CN': '上滑查看更多视频',
    en: 'Slide up to view more videos',
  },
  c_delete_confirm: {
    'zh-CN': '确认删除？',
    en: 'Confirm deletion?',
  },
  c_more: {
    'zh-CN': '更多',
    en: 'More',
  },
  c_content_confirm: {
    'zh-CN': '当前评论内容删除后无法恢复，请确认操作。',
    en: 'The comment content can not be restored after deletion. Please confirm the operation.',
  },
  c_comment_num: {
    'zh-CN': 'placeholder 条评论',
    en: 'placeholder comments',
  },
  c_comment_del: {
    'zh-CN': '删除',
    en: 'Delete',
  },
  c_cancel: {
    'zh-CN': '取消',
    en: 'Cancel',
  },
  c_confirm: {
    'zh-CN': '确认',
    en: 'Confirm',
  },
  c_add: {
    'zh-CN': '添加评论...',
    en: 'Add comment...',
  },
};

type ILang = 'zh-CN' | 'en' | 'zh' | 'zh-Hans-CN';

export default (key: keyof typeof translation, placeholder?: number) => {
  let lang = window.navigator.language as ILang;
  if (/zh/i.test(lang)) {
    lang = 'zh-CN';
  } else {
    lang = 'en';
  }

  const finalTrans = translation[key][lang];
  if (typeof placeholder === 'number') {
    return finalTrans.replace('placeholder', placeholder.toString());
  } else {
    return finalTrans;
  }
};
