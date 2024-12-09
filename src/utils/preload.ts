import { IDramaDetailListItem } from '@/@types';
import { selectDef } from './';

export const formatPreloadStreamList = (list: Array<IDramaDetailListItem['video_meta']>): any => {
  return list
    ?.map(item => {
      const target = selectDef(item.videoModel?.PlayInfoList ?? []);
      if (!target) {
        return undefined;
      }
      return {
        url: target.MainPlayUrl,
        bitrate: target.Bitrate,
        duration: target.Duration,
        size: target.Size,
        definition: target.Definition,
        streamType: target?.Format,
        codec: target?.Codec,
        vid: item.vid,
      };
    })
    .filter(i => i?.vid);
};
