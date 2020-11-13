import { bindActionCreators } from 'redux';
import PageAction from './pagesAction';
import TableAction from './tableAction';
import SharedAction from './sharedAction';

const actions = (dispatch, main = '') => {
  const pages = bindActionCreators({ ...PageAction }, dispatch);
  const table = bindActionCreators({ ...TableAction }, dispatch);
  const shared = bindActionCreators({ ...SharedAction }, dispatch);

  switch (main) {
    case 'pages':
      return {
        actions: {
          ...pages,
          table,
          shared,
        },
      };

    case 'table':
      return {
        actions: {
          pages,
          ...table,
          shared,
        },
      };

    case 'shared':
      return {
        actions: {
          pages,
          table,
          ...shared,
        },
      };

    default:
      return {
        actions: {
          pages,
          table,
          shared,
        },
      };
  }
};

export default actions;
