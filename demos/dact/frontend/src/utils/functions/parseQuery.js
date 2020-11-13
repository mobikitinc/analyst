import queryString from 'query-string';

const parseQuery = (query) => queryString.parse(query);

export default parseQuery;
