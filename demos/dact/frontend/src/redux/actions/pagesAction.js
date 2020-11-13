import { Pages } from '../utils/actionTypes';

const PagesAction = {
  setCanKeyDown: (canKeyDown) => ({
    type: Pages.SET_CAN_KEY_DOWN,
    payload: canKeyDown,
  }),
};

export default PagesAction;
