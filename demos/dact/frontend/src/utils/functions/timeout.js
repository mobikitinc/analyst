const timeout = (ms, promise) => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Timed out'));
  }, ms);
  promise.then(resolve, reject);
});

export default timeout;
