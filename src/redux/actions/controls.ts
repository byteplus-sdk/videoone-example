// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
export const setPlayBackRate = (value: number) => ({
  type: 'SET_PLAY_BACK_RATE',
  payload: value,
});

export const setDefinition = (value: string) => ({
  type: 'SET_DEFINITION',
  payload: value,
});

export const setDefinitionPanelVisible = (value: boolean) => ({
  type: 'SET_DEFINITION_PANEL_VISIBLE',
  payload: value,
});

export const setPlayBackRatePanelVisible = (value: boolean) => ({
  type: 'SET_PLAY_BACK_PANEL_VISIBLE',
  payload: value,
});

export const setCommentPanelVisible = (value: boolean) => ({
  type: 'SET_COMMENT_PANEL_VISIBLE',
  payload: value,
});

export const setLockNumPageIndex = (value: number) => ({
  type: 'SET_LOCK_NUM_PAGE_INDEX',
  payload: value,
});

export const setLockNumDrawerVisible = (value: boolean) => ({
  type: 'SET_LOCK_NUM_DRAWER_VISIBLE',
  payload: value,
});
