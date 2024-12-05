export interface IDramaInfo {
  dramaId: string;
  dramaTitle: string;
  description: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
  authorId: string;
}

export interface IVideoData {
  vid: string;
  caption: string;
  duration: number;
  cover_url: string;
  drama_id: string;
  drama_title: string;
  drama_length: number;
  play_times: number;
  subtitle: string;
  create_time: string;
  name: string;
  like: number;
  comment: number;
  height: number;
  width: number;
  order: number;
  drama_cover_url: string;
  drama_play_times: number;
}

export interface IVideoDataWithToken extends IVideoData {
  playAuthToken: string;
}

export interface IVideoDataWithModel extends IVideoData {
  videoModel: IVideoModel;
}

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

export interface IDramaDetailListItem {
  vid: string;
  order: number;
  video_model: string;
  vip: boolean;
  caption: string;
  duration: number;
  cover_url: string;
  play_times: number;
  drama_title: string;
  drama_id: string;
  height: number;
  width: number;
}

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
