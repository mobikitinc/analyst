import { Pages } from '../utils/actionTypes';

const initialState = {
  canKeyDown: true,
};

const PagesReducer = (state = initialState, action) => {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case Pages.SET_CAN_KEY_DOWN: {
      return { ...state, canKeyDown: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default PagesReducer;
