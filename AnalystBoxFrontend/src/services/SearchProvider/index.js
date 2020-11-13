// Internal
import BaseSearch from './utils/baseSearch';
import BinaryPrefixSearch from './options/binaryPrefixSearch';
import LinearSubstringSearch from './options/linearSubstringSearch';
import TriePrefixSearch from './options/triePrefixSearch';

// SearchProvider
class SearchProvider {
  indices = null;

  config = null;

  lastNoResultsQuery = null;

  constructor(config) {
    this.config = config;
  }

  initialize = (questions) => {
    // Input
    if (!questions || typeof questions !== 'object' || !questions.length) return;

    // Config
    const { maxResults, engines } = this.config;

    // Set indices by creating engines
    this.indices = Object.keys(engines).map((key) => {
      // Determine relevant engineConfig
      let engineConfig = engines[key];
      engineConfig = { ...engineConfig, maxResults };

      // Create new engine and initialize with questions
      switch (key) {
        case 'binaryPrefixSearch': {
          return new BinaryPrefixSearch(engineConfig).initialize(questions);
        }

        case 'linearSubstringSearch': {
          return new LinearSubstringSearch(engineConfig).initialize(questions);
        }

        case 'triePrefixSearch': {
          return new TriePrefixSearch(engineConfig).initialize(questions);
        }

        default: {
          return new BaseSearch(engineConfig).initialize(questions);
        }
      }
    });
  };

  find = async (query) => {
    // Input
    if (!query || !query.length) return [];
    if (!this.indices || !this.indices.length) return [];

    // Short-circuit if current query starts with lastNoResultsQuery
    if (this.lastNoResultsQuery && query.startsWith(this.lastNoResultsQuery)) return [];

    // Config
    const { findTimeout } = this.config;

    // Create promises for each index
    const promises = this.indices.map(
      (index) => new Promise((resolve) => {
        // Find matches
        const matches = index.find(query);

        // If matches
        if (matches && matches.length) {
          resolve(matches);
        }
      }),
    );

    // Add a timeout
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, findTimeout);
      }),
    );

    // Race promises to get results
    const results = await Promise.race(promises);

    // Set lastNoResultsQuery appropriately
    if (results.length === 0) {
      this.lastNoResultsQuery = query;
    } else {
      this.lastNoResultsQuery = null;
    }

    // Return
    return results;
  };
}

// Export
export default SearchProvider;
