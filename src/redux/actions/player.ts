// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
export const setFullScreen = (value: boolean) => ({
  type: 'SET_FULL_SCREEN',
  payload: value,
});

export const setCssFullScreen = (value: boolean) => ({
  type: 'SET_CSS_FULL_SCREEN',
  payload: value,
});

export const setIsHorizontal = (value: boolean) => ({
  type: 'SET_HORIZONTAL',
  payload: value,
});

export const setIsPortrait = (value: boolean) => ({
  type: 'SET_PORTRAIT',
  payload: value,
});
