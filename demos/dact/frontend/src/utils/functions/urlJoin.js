const urlJoin = (base, part) => {
  let result = base;

  if (part[0] === '/') {
    result += part;
  } else {
    result += `/${part}`;
  }

  return result;
};

export default urlJoin;
