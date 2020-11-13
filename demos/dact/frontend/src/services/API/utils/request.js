import fetch from 'cross-fetch';
import { timeout, urlJoin } from '../../../utils/functions';
import { times, serverURL } from '../../../utils/config';

const preprocess = (req) => {
  if (!req.method) {
    req.method = 'GET';
  }

  req.url = urlJoin(serverURL, req.url);

  if (!req.time) {
    req.time = times.short;
  }

  if (req.body) {
    req.body = JSON.stringify(req.body);
  }

  return req;
};

const request = async (req) => {
  const {
    method, url, time, body,
  } = preprocess(req);

  try {
    const response = await timeout(
      time,
      fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method,
        body,
      }),
    );

    if (response.ok) {
      const responseJson = await response.json();

      if (responseJson.success) {
        return responseJson;
      }

      throw new Error('Unsuccessful request');
    }

    throw new Error('Bad request');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default request;
