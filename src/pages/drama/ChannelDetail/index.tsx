import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, NavBar, Toast } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import useUrlState from '@ahooksjs/use-url-state';
import useAxios from 'axios-hooks';
import VideoSwiper, { RefVideoSwiper } from '@/components/video-swiper';
import { parseModel } from '@/utils';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import IconUp from '@/assets/svgr/iconUp.svg?react';
import IconMenu from '@/assets/svgr/iconMenu.svg?react';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import type { IDramaDetailListItem, IVideoModel } from '@/@types';
import styles from './index.module.less';
import 'swiper/less';
import '@byteplus/veplayer/index.min.css';
import { API_PATH } from '@/service/path';
import Loading from '@/components/loading';
import LikeComp from '@/components/like';
import { renderCount } from '@/utils/util';
import CommentComp from '@/components/comment';
import classNames from 'classnames';
import LoclAlert from '@/assets/images/lockAlert.png';
import { DialogShowHandler } from 'antd-mobile/es/components/dialog';
import LockAll from '@/components/lockAll';
import LockNum from '@/components/lockNum';
import Ad from '@/components/ad';
import {
  setCommentPanelVisible,
  setLockNumDrawerVisible,
  setLockNumPageIndex,
  setPlayBackRate,
  setPlayBackRatePanelVisible,
} from '@/redux/actions/controls';
import { RootState } from '@/redux/type';
import { resetDetail, setDetail, setList } from '@/redux/actions/dramaDetail';
import Speed, { playbackRateList } from '@/components/speed';
import Definition from '@/components/definition';
import t from '@/utils/translation';

interface ILockData {
  vid: string;
  order: number;
  subtitle_auth_token: string;
  video_model: string;
}

function ChannelDetail() {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const refDialog = useRef<DialogShowHandler>();
  const videoSwiperRef = useRef<RefVideoSwiper>(null);
  const startTime = urlState.startTime || 0;
  const [adVisible, setAdVisible] = useState(false);
  const [lockAllDrawerOpen, setLockAllDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const playbackRate = useSelector((state: RootState) => state.controls.playbackRate);
  const definition = useSelector((state: RootState) => state.controls.definition);
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isPortrait = useSelector((state: RootState) => state.player.isPortrait);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const commentDrawerVisible = useSelector((state: RootState) => state.controls.commentDrawerVisible);

  const list = useSelector((state: RootState) => state.dramaDetail.list);
  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetDramaList,
      method: 'POST',
      data: {
        drama_id: urlState.id,
        play_info_type: 1,
        user_id: window.sessionStorage.getItem('user_id'),
      },
    },
    { useCache: true },
  );

  const [{ data: commentsData, loading: commentLoading }, executeGetComments] = useAxios(
    {
      url: API_PATH.GetDramaVideoComments,
      method: 'GET',
    },
    { manual: true },
  );

  const [activeIndex, setActiveIndex] = useState(urlState.order ? urlState.order - 1 : 0);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPlayBackRate(1));
  }, [activeIndex]);

  const [{ data: lockData, loading: lockLoading }, executeGetDramaDetail] = useAxios(
    {
      url: API_PATH.GetDramaDetail,
      method: 'POST',
    },
    { useCache: true, manual: true },
  );

  useEffect(() => {
    const list = ((data?.response || []) as IDramaDetailListItem['video_meta'][]).map(item => {
      return {
        ...item,
        videoModel: parseModel(item.video_model) as IVideoModel,
      };
    });
    dispatch(setList(list));
  }, [data?.response]);

  /**
   * vip解锁更新
   */
  useEffect(() => {
    if (!lockData?.response) {
      return;
    }
    setLockAllDrawerOpen(false);
    const newList = list.map(item => {
      const findItem = (lockData?.response as ILockData[]).find(lockItem => lockItem.order === item.order);
      if (findItem) {
        return {
          ...item,
          vip: false,
          videoModel: parseModel(findItem.video_model) as IVideoModel,
        };
      }
      return item;
    });
    dispatch(setList(newList));
  }, [lockData?.response]);

  const current = useMemo(() => list?.[activeIndex] ?? {}, [activeIndex, list]);
  const numArrList = useMemo(() => {
    const nums = Array.from({ length: Math.ceil(list.length) }, (_, index) => index + 1);
    let tempList: number[][] = [];
    let temp: number[] = [];
    nums.forEach(item => {
      if (temp.length === 7) {
        tempList.push(temp);
        temp = [item];
      } else {
        temp.push(item);
      }
    });
    if (temp.length > 0) {
      tempList.push(temp);
    }
    return tempList;
  }, [list.length]);

  useEffect(() => {
    dispatch(setDetail(current ?? {}));

    if (current.vid) {
      toastRef?.current?.close();
      executeGetComments({
        params: {
          vid: current.vid,
        },
      });
    } else {
      toastRef.current = Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0,
      });
    }
  }, [current]);

  useEffect(() => {
    const scrollFn = () => {
      window.scrollTo({ left: 0, top: 0 });
    };
    window.addEventListener('scrollend', scrollFn);
    return () => {
      window.removeEventListener('scrollend', scrollFn);
    };
  }, []);

  const getLockData = (lockData: IDramaDetailListItem['video_meta'][]) => {
    executeGetDramaDetail({
      data: {
        drama_id: current.drama_id,
        vid_list: lockData.map(item => item.vid),
        play_info_type: 1,
        user_id: window.sessionStorage.getItem('user_id'),
      },
    });
  };

  const showLockPrompt = useCallback(() => {
    refDialog.current = Dialog.show({
      header: (
        <div className={styles.alertHeader}>
          <h3>{t('d_for_free_to_1_episode')}</h3>
          <img src={LoclAlert} />
        </div>
      ),
      bodyClassName: classNames(styles.lockAlertBody, { [styles.isFullScreen]: isFullScreen || isCssFullScreen }),
      maskClassName: styles.lockAlertMask,
      getContainer: isCssFullScreen ? document.body : window.playerSdk?.player?.root,
      content: (
        <div className={styles.alertContent}>
          <div className={styles.title}>
            <span>{t('d_episode')}</span>
          </div>
          <div className={styles.btnGroups}>
            <Button
              block
              shape="rounded"
              className={styles.watch}
              onClick={() => {
                refDialog.current?.close();
                dispatch(setLockNumDrawerVisible(false));
                setAdVisible(true);
              }}
            >
              {t('d_watch_an_advertising_video')}
            </Button>
            <Button
              block
              shape="rounded"
              fill="outline"
              className={styles.unlock}
              onClick={() => {
                refDialog.current?.close();
                setLockAllDrawerOpen(true);
              }}
            >
              {t('d_unlock_all_episodes')}
            </Button>
          </div>
        </div>
      ),
      actions: [],
      closeOnMaskClick: true,
    });
  }, [isFullScreen, isCssFullScreen, isHorizontal]);

  return loading ? (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  ) : list.length > 0 ? (
    <div className={styles.wrap}>
      {!isCssFullScreen && (
        <NavBar
          backIcon={<IconBack />}
          className={styles.head}
          left={<div className={styles.caption}>{current.caption}</div>}
          onBack={() => {
            dispatch(resetDetail());
            navigate('/dramaGround?device_id=001');
          }}
        />
      )}
      <div className={styles.body}>
        <VideoSwiper
          startTime={startTime}
          initActiveIndex={Number(activeIndex)}
          adVisible={adVisible}
          playbackRate={playbackRate}
          definition={definition}
          videoDataList={list}
          ref={videoSwiperRef}
          showLockPrompt={showLockPrompt}
          onChange={index => {
            const findIndex = numArrList.findIndex(itemArr => itemArr.includes(index + 1));
            setActiveIndex(index);
            dispatch(setLockNumPageIndex(findIndex));
          }}
          otherComponent={
            isPortrait ? (
              <div>
                <div className={styles.rightLane}>
                  <div className={styles.btns}>
                    <div className={styles.like}>
                      <LikeComp like={current.like} />
                    </div>
                    <div
                      className={styles.comment}
                      onClick={e => {
                        e.stopPropagation();
                        dispatch(setCommentPanelVisible(true));
                      }}
                    >
                      <IconComment />
                      <span>{renderCount(current.comment)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          }
        />
      </div>
      {isPortrait ? (
        <div className={styles.footer}>
          <div
            className={styles.button}
            onClick={() => {
              dispatch(setLockNumDrawerVisible(true));
            }}
          >
            <div className={styles.info}>
              <IconMenu />
              <span className={styles.title}>
                {current.caption} · {list.length} videos
              </span>
            </div>
            <IconUp />
          </div>
          <div
            className={styles.playbackRateBtn}
            onClick={() => {
              dispatch(setPlayBackRatePanelVisible(true));
            }}
          >
            {playbackRateList.find(item => item.value === playbackRate)?.title}
          </div>
        </div>
      ) : null}
      <CommentComp
        isFullScreen={isFullScreen}
        isCssFullScreen={isCssFullScreen}
        isHorizontal={isHorizontal}
        commentVisible={commentDrawerVisible}
        setCommentVisible={value => {
          dispatch(setCommentPanelVisible(value));
        }}
        list={commentsData?.response ?? []}
        loading={commentLoading}
      />

      <Ad
        visible={adVisible}
        drama_id={current.drama_id}
        vid_list={[current.vid]}
        getLockData={() => {
          getLockData([current]);
        }}
        onClose={() => {
          setAdVisible(false);
        }}
      />
      <Speed />
      <Definition />
      <LockNum
        activeIndex={activeIndex}
        numArrList={numArrList}
        list={list}
        setLockAllDrawerOpen={setLockAllDrawerOpen}
        clickCallBack={value => {
          setActiveIndex(value);
          videoSwiperRef.current?.onSelectClick(value);
        }}
        {...current}
      />
      <LockAll
        {...current}
        list={list}
        count={list.length}
        loading={lockLoading}
        visible={lockAllDrawerOpen}
        getLockData={getLockData}
        setLockAllDrawerOpen={setLockAllDrawerOpen}
        {...current}
      />
    </div>
  ) : null;
}

export default ChannelDetail;
