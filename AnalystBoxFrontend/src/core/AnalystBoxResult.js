// External
import React from 'react';
import { Icon } from 'semantic-ui-react';

// AnalystBoxResult
const AnalystBoxResult = (props) => {
  const bold = (value, key) => <b key={key}>{value}</b>;

  const highlight = (value, color, key) => (
    <span key={key} style={{ color }}>
      {value}
    </span>
  );

  const largestPrefixMatchAndSplit = (result, queryArray) => {
    // Copy resultArray
    let resultArray = result.slice(0);

    // Create array to represent largest prefix match for each result word
    const largestPrefixMatchLength = new Array(resultArray.length).fill(0);

    // For each user query word
    queryArray.forEach((queryWord) => {
      // For each result word
      resultArray.forEach((resultWord, i) => {
        // If prefix match and largest match seen so far
        if (resultWord.startsWith(queryWord) && queryWord.length > largestPrefixMatchLength[i]) {
          // Update result word's prefix match length
          largestPrefixMatchLength[i] = queryWord.length;
        }
      });
    });

    // Split each result word at its largest prefix match length
    resultArray = resultArray.map((resultWord, i) => {
      const cut = largestPrefixMatchLength[i];
      return [resultWord.slice(0, cut), resultWord.slice(cut)];
    });

    // Return array of resulting split words
    return resultArray;
  };

  const findKeywords = (resultProcessed, keywords) => {
    // Create keywordIndices
    const keywordIndices = [];

    // For each keyword
    keywords.forEach((keyword) => {
      // Find index of keyword in result
      const index = resultProcessed.indexOf(keyword);

      // If keyword in result
      if (index !== -1) {
        // Determine keyword's starting index in result
        let start = (resultProcessed.slice(0, index).match(/\s/g) || []).length;

        // Determine keyword's ending index in result
        const end = start + (keyword.match(/\s/g) || []).length + 1;

        // While start is less than end
        while (start < end) {
          // Add current index to keywordIndices
          keywordIndices.push(start);
          start += 1;
        }
      }
    });

    // Return
    return keywordIndices;
  };

  const format = (result, query, keywords, keywordColor) => {
    // Input
    if (!result || !query) {
      return result;
    }

    // Setup
    const resultProcessed = result.toLowerCase();
    const resultArray = resultProcessed.split(/\s+/);
    const queryArray = query.toLowerCase().split(/\s+/);

    // Bold
    const resultPairs = largestPrefixMatchAndSplit(resultArray, queryArray);
    resultPairs.forEach((pair, i) => {
      if (pair[1] !== '') {
        pair[1] = bold(pair[1], i);
      }
    });

    // Highlight, if necessary
    if (keywords && keywords.length) {
      const keywordIndices = findKeywords(resultProcessed, keywords);
      keywordIndices.forEach((index) => {
        const pair = resultPairs[index];
        resultPairs[index] = [highlight(pair, keywordColor, index)];
      });
    }

    // Cleanup
    const resultFormatted = [];
    for (let i = 0; i < resultPairs.length; i += 1) {
      const current = resultPairs[i];
      for (let j = 0; j < current.length; j += 1) {
        if (current[j] !== '') {
          resultFormatted.push(current[j]);
        }
      }
      if (i + 1 < resultPairs.length) {
        resultFormatted.push(' ');
      }
    }

    // Return
    return resultFormatted;
  };

  return (
    <div>
      <Icon name="search" size="small" style={{ marginLeft: '-5px' }} />
      {format(props.result, props.query, props.keywords, props.keywordColor)}
    </div>
  );
};

export default AnalystBoxResult;
