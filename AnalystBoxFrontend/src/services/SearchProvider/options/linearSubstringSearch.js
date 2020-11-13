import BaseSearch from '../utils/baseSearch';

class LinearSubstringSearch extends BaseSearch {
  initialize = (questions) => {
    this.questions = questions;

    return this;
  };

  find = (query) => {
    // Setup
    const results = [];

    // Config
    const { maxResults } = this.config;

    // Compute longest suffix-prefix table
    const lsp = [0];
    for (let i = 1; i < query.length; i += 1) {
      let j = lsp[i - 1];

      while (j > 0 && query.charAt(i) !== query.charAt(j)) {
        j = lsp[j - 1];
      }

      if (query.charAt(i) === query.charAt(j)) {
        j += 1;
      }

      lsp.push(j);
    }

    // Iterate over all questions
    for (let q = 0; q < this.questions.length && results.length < maxResults; q += 1) {
      const question = this.questions[q];

      // Determine if query matches any part of question
      let j = 0;

      for (let i = 0; i < question.length; i += 1) {
        while (j > 0 && question.charAt(i) !== query.charAt(j)) {
          j = lsp[j - 1];
        }

        if (question.charAt(i) === query.charAt(j)) {
          j += 1;

          // If match found
          if (j === query.length) {
            results.push(q);
            break;
          }
        }
      }
    }

    // Return
    return results;
  };
}

export default LinearSubstringSearch;
