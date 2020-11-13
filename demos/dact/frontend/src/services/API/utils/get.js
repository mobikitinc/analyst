import request from './request';

const get = async ({ url, time }) => {
  const result = await request({ method: 'GET', url, time });
  return result;
};

export default get;
