/**
 * Video playback information
 */
export interface IPlayInfoListItem {
  BackupPlayUrl: string;
  Bitrate: number;
  Codec: 'h264' | 'h265';
  Definition: string;
  Duration: number;
  FileId: string;
  FileType: string;
  Format: string;
  Height: number;
  MainPlayUrl: string;
  Quality: string;
  Size: number;
  Width: number;
}

export enum CHANNEL_MODE {
  NORMAL = 0,
  CARD = 1,
}

/**
 * Short drama list page
 */
export interface IDramaDetailListItem {
  drama_meta: {
    drama_title: string;
    drama_id: string;
    drama_length: number;
    drama_cover_url: string;
    drama_play_times: number;
    drama_video_orientation: number;
  };

  video_meta: {
    vid: string;
    order: number;
    video_model: string;
    drama_id: string;
    vip: boolean;
    caption: string;
    duration: number;
    cover_url: string;
    name: string;
    play_times: number;
    display_type: CHANNEL_MODE;
    height: number;
    width: number;
    like: number;
    comment: number;

    videoModel: IVideoModel;
  };
}

/**
 * Parsed video_model returned from the server
 */
export interface IVideoModel {
  Duration: number;
  FileType: string;
  Status: number;
  TotalCount: number;
  Version: number;
  Vid: string;
  PosterUrl: string;
  PlayInfoList: IPlayInfoListItem[];
}
