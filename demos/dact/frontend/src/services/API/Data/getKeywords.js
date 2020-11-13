import get from '../utils/get';

const getKeywords = async () => {
  const { keywords } = await get({ url: '/data/keywords' });
  return keywords;
};

export default getKeywords;
