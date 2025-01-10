import { setDefinition, setDefinitionPanelVisible } from '@/redux/actions/controls';
import { RootState } from '@/redux/type';
import { Popup } from 'antd-mobile';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.less';

const Definition = () => {
  const definitionDrawerVisible = useSelector((state: RootState) => state.controls.definitionDrawerVisible);
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const definition = useSelector((state: RootState) => state.controls.definition);
  const currentDetail = useSelector((state: RootState) => state.dramaDetail.currentDetail);
  const dispatch = useDispatch();

  return (
    <Popup
      visible={definitionDrawerVisible}
      getContainer={isFullScreen ? window.playerSdk?.player?.root : document.body}
      onMaskClick={() => {
        dispatch(setDefinitionPanelVisible(false));
      }}
      position={isFullScreen && isHorizontal ? 'right' : 'bottom'}
      bodyClassName={classNames(styles.popupBodyClass, { [styles.isFullScreen]: isFullScreen && isHorizontal })}
      maskClassName={styles.popupMaskClass}
    >
      <div className={styles.head}>Playback speed</div>
      <div className={styles.body}>
        {currentDetail?.videoModel?.PlayInfoList?.map(def => (
          <div
            key={def.Definition}
            className={classNames(styles.item, { [styles.selected]: definition === def.Definition })}
            onClick={() => {
              dispatch(setDefinition(def.Definition));
              dispatch(setDefinitionPanelVisible(false));
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
