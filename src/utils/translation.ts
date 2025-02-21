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
    'zh-CN': '精彩短剧剧集，视频播放和商业变现',
    en: 'Exciting short drama episodes, Video playback,and Monetization',
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
  // drama
  d_play_now: {
    'zh-CN': '立即播放',
    en: 'Play Now',
  },
  d_most_trending: {
    'zh-CN': '热门流行',
    en: 'Most trending',
  },
  d_new_release: {
    'zh-CN': '最新发布',
    en: 'New release',
  },
  d_recommended: {
    'zh-CN': '为你推荐',
    en: 'Recommended',
  },
  d_home: {
    'zh-CN': '首页',
    en: 'Home',
  },
  d_for_you: {
    'zh-CN': '猜你喜欢',
    en: 'For you',
  },
  d_full_screen: {
    'zh-CN': '进入全屏',
    en: 'Full screen',
  },
  d_recommend_for_you: {
    'zh-CN': '为你推荐',
    en: 'Recommend for you',
  },
  d_short_drama_placeholder: {
    'zh-CN': '短剧 | placeholder',
    en: 'Short drama | placeholder',
  },
  d_for_free_to_1_episode: {
    'zh-CN': '观看广告可免费解锁当前剧集',
    en: 'For free to 1 episode',
  },
  d_watch_an_advertising_video: {
    'zh-CN': '观看广告视频',
    en: 'Watch an advertising video',
  },
  d_unlock_all_episodes: {
    'zh-CN': '解锁全部剧集',
    en: 'Unlock all',
  },
  d_episode: {
    'zh-CN': '集',
    en: 'Episode',
  },
  d_unlock_multiple_episodes: {
    'zh-CN': '解锁多集',
    en: 'Unlock multiple episodes',
  },
  d_all_episodes_placeholder: {
    'zh-CN': '共 placeholder 集',
    en: 'All episodes placeholder',
  },
  d_permanent_viewing: {
    'zh-CN': ' 永久观看',
    en: 'Permanent viewing',
  },
  d_no_refund: {
    'zh-CN': '不退还',
    en: 'No refund',
  },
  d_placeholder_episodes: {
    'zh-CN': 'placeholder 集',
    en: 'placeholder episodes',
  },
  d_all_episodes: {
    'zh-CN': '全集',
    en: 'All episodes',
  },
  d_pay_for_usd_placeholder: {
    'zh-CN': '付款 $placeholder',
    en: 'Pay for USD placeholder',
  },
  d_usd_placeholder: {
    'zh-CN': '$placeholder',
    en: 'USD placeholder',
  },
  d_click_to_unmute: {
    'zh-CN': '点击取消静音',
    en: 'Click to unmute',
  },
  d_unlock_all_episodes_placeholder: {
    'zh-CN': '已经解锁全部剧集',
    en: 'Already unlocked all episodes',
  },
  d_definition: {
    'zh-CN': '清晰度',
    en: 'Definition',
  },
  d_playback_speed: {
    'zh-CN': '倍速',
    en: 'Playback speed',
  },
  d_data_error: {
    'zh-CN': '数据异常',
    en: 'Data exception',
  },
  d_data_over: {
    'zh-CN': '看完了！',
    en: 'Finished!',
  },
  d_loading: {
    'zh-CN': '加载中…',
    en: 'Loading...',
  },
};

type ILang = 'zh-CN' | 'en' | 'zh' | 'zh-Hans-CN';

export default (key: keyof typeof translation, placeholder: number | string = '') => {
  let lang = window.navigator.language as ILang;
  if (/zh/i.test(lang)) {
    lang = 'zh-CN';
  } else {
    lang = 'en';
  }

  const finalTrans = translation[key][lang];
  if (typeof placeholder !== undefined) {
    return finalTrans.replace('placeholder', placeholder!.toString());
  } else {
    return finalTrans;
  }
};
