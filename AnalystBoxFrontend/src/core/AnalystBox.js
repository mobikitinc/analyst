// External
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';

// Internal
import AnalystBoxResult from './AnalystBoxResult';
import SearchProvider from '../services/SearchProvider';

// AnalystBox
class AnalystBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      matches: [],
      isLoading: true,
      isDisabled: true,
    };

    this.searchProvider = null;
  }

  componentDidMount() {
    this.initializeSearchProvider();
  }

  componentDidUpdate(prevProps) {
    // If questions have changed
    if (this.props.questions.length !== prevProps.questions.length) {
      this.initializeSearchProvider();
    }
  }

  /*
   * Events
   */
  onQuestionSelect = (event, data) => {
    // Get questionIndex and question
    const { index: questionIndex, title: question } = data.result;

    // Set query to question
    this.setState({ query: question });

    // Call props.onQuestionSelect
    this.props.onQuestionSelect({ questionIndex, question });
  };

  onSearchChange = (event, data) => {
    // Get query
    const { value: query } = data;

    // Set isLoading and query
    this.setState({ isLoading: true, query });

    // Call search provider, then set matches and isLoading
    this.callSearchProvider(query).then((matches) => {
      this.setState({ matches, isLoading: false });
    });

    // Call props.onSearchChange
    this.props.onSearchChange({ query });
  };

  /*
   * SearchProvider Helpers
   */
  initializeSearchProvider = () => {
    // Create new search provider with options
    this.searchProvider = new SearchProvider({
      ...AnalystBox.defaultProps.searchOptions,
      ...this.props.searchOptions,
    });

    // Initialize search provider with questions
    this.searchProvider.initialize(this.props.questions);

    // Set isDisabled and isLoading
    this.setState({ isDisabled: false, isLoading: false });
  };

  callSearchProvider = async (query) => {
    // Wait for search provider's result
    const indices = await this.searchProvider.find(query);

    // Create matches using indices
    const matches = indices.map((index) => ({
      index,
      title: this.props.questions[index],
    }));

    // Return matches
    return matches;
  };

  /*
   * Render
   */
  render() {
    const { base, keywords, keywordColor } = this.props;
    const {
      query, matches, isLoading, isDisabled,
    } = this.state;

    return (
      <Search
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        fluid
        size="big"
        input={{ fluid: true, iconPosition: 'left' }}
        {...base}
        category={false}
        categoryRenderer={() => {}}
        categoryLayoutRenderer={() => {}}
        value={query}
        results={matches}
        loading={isLoading}
        disabled={isDisabled}
        onResultSelect={this.onQuestionSelect}
        onSearchChange={this.onSearchChange}
        resultRenderer={({ id, title }) => (
          <AnalystBoxResult
            key={id}
            result={title}
            query={query}
            keywords={keywords}
            keywordColor={keywordColor}
          />
        )}
      />
    );
  }
}

// AnalystBox - Default Props
AnalystBox.defaultProps = {
  base: {},
  keywords: [],
  keywordColor: '#467fcf',
  questions: [],
  searchOptions: {
    engines: { linearSubstringSearch: {} },
    findTimeout: 100,
    maxResults: 5,
  },
  onQuestionSelect: () => {},
  onSearchChange: () => {},
};

// AnalystBox - PropTypes
AnalystBox.propTypes = {
  base: PropTypes.object,
  keywords: PropTypes.arrayOf(PropTypes.string),
  keywordColor: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.string),
  searchOptions: PropTypes.shape({
    engines: PropTypes.exact({
      binaryPrefixSearch: PropTypes.shape({
        forceSmallestLexicographicResults: PropTypes.bool,
      }),
      linearSubstringSearch: PropTypes.object,
      triePrefixSearch: PropTypes.shape({
        shouldCache: PropTypes.bool,
      }),
    }),
    findTimeout: PropTypes.number,
    maxResults: PropTypes.number,
  }),
  onQuestionSelect: PropTypes.func,
  onSearchChange: PropTypes.func,
};

// Export
export default AnalystBox;
