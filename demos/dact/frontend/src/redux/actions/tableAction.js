import { Table } from '../utils/actionTypes';
import { API } from '../../services';

const TableAction = {
  setColumns: (columns) => ({
    type: Table.SET_COLUMNS,
    payload: columns,
  }),

  setRows: (rows) => ({
    type: Table.SET_ROWS,
    payload: rows,
  }),

  setIsLoading: (isLoading) => ({
    type: Table.SET_IS_LOADING,
    payload: isLoading,
  }),

  getData: () => async (dispatch, getState) => {
    const { sqls, qstIndex } = getState().shared;
    if (!sqls || sqls.length === 0 || qstIndex > sqls.length) {
      return;
    }

    dispatch(TableAction.setIsLoading(true));

    try {
      const { columns, rows } = await API.Table.getData(sqls[qstIndex]);
      dispatch(TableAction.setColumns(columns));
      dispatch(TableAction.setRows(rows));
    } catch (error) {
      console.log(error);
    }

    dispatch(TableAction.setIsLoading(false));
  },
};

export default TableAction;
