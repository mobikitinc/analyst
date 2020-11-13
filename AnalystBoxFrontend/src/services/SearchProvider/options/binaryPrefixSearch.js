import BaseSearch from '../utils/baseSearch';

class BinaryPrefixSearch extends BaseSearch {
  initialize = (questions) => {
    // Create zip of questions and qrkIndices
    const zip = [];

    for (let i = 0; i < questions.length; i += 1) {
      zip.push({ question: questions[i], qrkIndex: i });
    }

    // Sort zip by questions
    zip.sort((a, b) => a.question > b.question);

    // Expand zip to questions and qrkIndices
    this.questions = [];
    this.qrkIndices = [];

    for (let i = 0; i < questions.length; i += 1) {
      const curr = zip[i];
      this.questions.push(curr.question);
      this.qrkIndices.push(curr.qrkIndex);
    }

    // Return
    return this;
  };

  find = (query) => {
    // Setup
    const results = [];

    // Config
    const { maxResults, forceSmallestLexicographicResults = false } = this.config;

    // Setup binary search
    let low = 0;
    let high = this.questions.length - 1;

    // While low is less than high
    while (low < high) {
      // Find middle
      const mid = Math.floor((low + high) / 2);

      // If middle question starts with query
      if (this.questions[mid].startsWith(query)) {
        // Set left cursor, right cursor, and range
        let midlow = mid - 1;
        let midhigh = mid + 1;
        let range = 1;

        // If forcing smallest lexicographic results
        if (forceSmallestLexicographicResults) {
          // Move left cursor as far left as possible while also incrementing range
          while (midlow >= low && this.questions[midlow].startsWith(query)) {
            midlow -= 1;
            range += 1;
          }

          // Move left cursor back to a valid question
          midlow += 1;

          // Add results from left cursor to appropriate position on right
          this.qrkIndices
            .slice(midlow, midlow + Math.min(range, maxResults))
            .forEach((qrkIndex) => {
              results.push(qrkIndex);
            });

          // If maxResults found
          if (range >= maxResults) {
            // Return
            return results;
          }
        } else {
          // Add result from middle question
          results.push(this.qrkIndices[mid]);

          // Move left cursor as far left as possible while also adding results
          while (
            results.length < maxResults
            && midlow >= low
            && this.questions[midlow].startsWith(query)
          ) {
            results.push(this.qrkIndices[midlow]);
            midlow -= 1;
          }
        }

        // Move right cursor as far right as possible while also adding results
        while (
          results.length < maxResults
          && midhigh <= high
          && this.questions[midhigh].startsWith(query)
        ) {
          results.push(this.qrkIndices[midhigh]);
          midhigh += 1;
        }

        // Return
        return results;
      }

      // Update high or low based on query's relation to middle question
      if (query < this.questions[mid]) {
        high = mid - 1;
      } else if (query > this.questions[mid]) {
        low = mid + 1;
      }
    }

    // Return
    return results;
  };
}

export default BinaryPrefixSearch;
