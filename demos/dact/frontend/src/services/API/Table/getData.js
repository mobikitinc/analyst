import post from '../utils/post';

const getData = async (sql) => {
  const { columns, rows } = await post({
    url: '/table/data',
    body: { sql },
  });
  return { columns, rows };
};

export default getData;
