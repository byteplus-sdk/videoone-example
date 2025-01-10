export const setFullScreen = (value: boolean) => ({
  type: 'SET_FULL_SCREEN',
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
