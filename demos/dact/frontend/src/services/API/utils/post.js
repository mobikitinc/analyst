import request from './request';

const post = async ({ url, time, body }) => {
  const result = await request({
    method: 'POST',
    url,
    time,
    body,
  });
  return result;
};

export default post;
