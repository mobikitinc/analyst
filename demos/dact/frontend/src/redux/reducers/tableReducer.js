import { Table } from '../utils/actionTypes';

const initialState = {
  columns: [{}],
  rows: [],
  isLoading: false,
};

const TableReducer = (state = initialState, action) => {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case Table.SET_COLUMNS: {
      return { ...state, columns: action.payload };
    }

    case Table.SET_ROWS: {
      return { ...state, rows: action.payload };
    }

    case Table.SET_IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default TableReducer;
