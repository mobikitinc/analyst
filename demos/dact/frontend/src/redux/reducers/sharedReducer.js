import { Shared } from '../utils/actionTypes';

const initialState = {
  qstIndex: 0,
  questions: [],
  sqls: [],
  keywords: [],
};

const SharedReducer = (state = initialState, action) => {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case Shared.SET_QST_INDEX: {
      return { ...state, qstIndex: action.payload };
    }

    case Shared.SET_QUESTIONS: {
      return { ...state, questions: action.payload };
    }

    case Shared.SET_SQLS: {
      return { ...state, sqls: action.payload };
    }

    case Shared.SET_KEYWORDS: {
      return { ...state, keywords: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default SharedReducer;
