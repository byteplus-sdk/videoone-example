// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import type { IDramaDetailListItem } from '@/interface';
import { selectDef } from './';

export const formatPreloadStreamList = (list: Array<IDramaDetailListItem['video_meta']>, hasSelectedDef?: string) => {
  return list
    ?.map(item => {
      const target = selectDef(item.videoModel?.PlayInfoList ?? [], hasSelectedDef);
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
