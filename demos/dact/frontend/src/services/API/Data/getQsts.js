import get from '../utils/get';
import { times } from '../../../utils/config';

const getQsts = async () => {
  const { questions, sqls } = await get({ url: '/data/qsts', time: times.medium });
  return { questions, sqls };
};

export default getQsts;
