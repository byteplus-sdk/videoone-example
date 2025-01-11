const initialState = {
  fullScreen: false,
  cssFullScreen: false,
  horizontal: false,
  isPortrait: false,
};

const playerReducer = (state = initialState, action: any = {}) => {
  switch (action.type) {
    case 'SET_FULL_SCREEN':
      return { ...state, fullScreen: action.payload };
    case 'SET_CSS_FULL_SCREEN':
      return { ...state, cssFullScreen: action.payload };
    case 'SET_HORIZONTAL':
      return { ...state, horizontal: action.payload };
    case 'SET_PORTRAIT':
      return { ...state, isPortrait: action.payload };
    default:
      return state;
  }
};

export default playerReducer;
