import { setDefinition, setDefinitionPanelVisible } from '@/redux/actions/controls';
import { RootState } from '@/redux/type';
import { Popup } from 'antd-mobile';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.less';
import translate from '@/utils/translation';
import { useCallback } from 'react';
import type { IPlayInfoListItem } from '@/interface';

const Definition = () => {
  const definitionDrawerVisible = useSelector((state: RootState) => state.controls.definitionDrawerVisible);
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const definition = useSelector((state: RootState) => state.controls.definition);
  const currentDetail = useSelector((state: RootState) => state.dramaDetail.currentDetail);
  const dispatch = useDispatch();

  const changeDefinition = useCallback((def: IPlayInfoListItem) => {
    window.playerSdk?.changeDefinition(def.Definition);
    dispatch(setDefinition(def.Definition));
    dispatch(setDefinitionPanelVisible(false));
  }, []);

  return (
    <Popup
      visible={definitionDrawerVisible}
      getContainer={isCssFullScreen ? document.body : window.playerSdk?.player?.root}
      onMaskClick={() => {
        dispatch(setDefinitionPanelVisible(false));
      }}
      position={(isFullScreen || isCssFullScreen) && isHorizontal ? 'right' : 'bottom'}
      bodyClassName={classNames(styles.popupBodyClass, { [styles.isFullScreen]: isFullScreen && isHorizontal })}
      maskClassName={styles.popupMaskClass}
    >
      <div className={styles.head}>{translate('d_definition')}</div>
      <div className={styles.body}>
        {currentDetail?.videoModel?.PlayInfoList?.map(def => (
          <div
            key={def.Definition}
            className={classNames(styles.item, { [styles.selected]: definition === def.Definition })}
            onClick={() => {
              changeDefinition(def);
            }}
          >
            {def.Definition}
          </div>
        ))}
      </div>
    </Popup>
  );
};

export default Definition;
