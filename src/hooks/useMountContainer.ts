// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { RootState } from '@/redux/type';
import { useSelector } from 'react-redux';

const useMountContainer = () => {
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isPortrait = useSelector((state: RootState) => state.player.isPortrait);

  const getMountContainer = () => {
    return !isPortrait && isFullScreen && !isCssFullScreen ? window.playerSdk?.player?.root : document.body;
  };

  return { getMountContainer };
};

export default useMountContainer;
