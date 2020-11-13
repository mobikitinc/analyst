import BaseSearch from '../utils/baseSearch';
import Trie from '../utils/trie';

class TriePrefixSearch extends BaseSearch {
  initialize = (questions) => {
    // Config
    const { shouldCache = false } = this.config;

    // Create trie
    this.index = new Trie(shouldCache);

    // Add all questions to trie
    questions.forEach((question, qrkIndex) => {
      this.index.insert(question, qrkIndex);
    });

    // Return
    return this;
  };

  find = (query) => {
    // Config
    const { maxResults } = this.config;

    // Get matches
    return this.index.getMatches(query, maxResults);
  };
}

export default TriePrefixSearch;
