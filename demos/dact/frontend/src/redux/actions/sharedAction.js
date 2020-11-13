import { Shared } from '../utils/actionTypes';
import TableAction from './tableAction';
import { API } from '../../services';

const SharedAction = {
  setQstIndex: (qstIndex) => ({
    type: Shared.SET_QST_INDEX,
    payload: qstIndex,
  }),

  setQuestions: (questions) => ({
    type: Shared.SET_QUESTIONS,
    payload: questions,
  }),

  setSQLs: (sqls) => ({
    type: Shared.SET_SQLS,
    payload: sqls,
  }),

  setKeywords: (keywords) => ({
    type: Shared.SET_KEYWORDS,
    payload: keywords,
  }),

  getQsts: () => async (dispatch) => {
    try {
      const { questions, sqls } = await API.Data.getQsts();
      dispatch(SharedAction.setQuestions(questions));
      dispatch(SharedAction.setSQLs(sqls));
    } catch (error) {
      console.log(error);
    }
  },

  getKeywords: () => async (dispatch) => {
    try {
      const keywords = await API.Data.getKeywords();
      dispatch(SharedAction.setKeywords(keywords));
    } catch (error) {
      console.log(error);
    }
  },

  onQuestionSelect: (questionIndex) => async (dispatch) => {
    dispatch(SharedAction.setQstIndex(questionIndex));
    await dispatch(TableAction.getData());
  },
};

export default SharedAction;
