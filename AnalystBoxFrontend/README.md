# AnalystBox/Frontend

![Screenshot](../other/AnalystBoxFrontend.png)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Example](#example)
- [Props](#props)
- [Demos](#demos)
- [Development](#development)

<br/>

## Introduction

**The one search box to rule them all.**

AnalystBoxFrontend is an autocompleting, tokenized bolding, keyword highlighting, extremely configurable, fast search-box. It's a React component designed for high versatility, speed, and seamless integration with a wide variety of projects.

<br/>

## Installation

```shell
$ npm install @mobikitinc/analystbox
```

_However, that's not the only way to install AnalystBoxFrontend!_

<details>
<summary>Installation Alternatives</summary>

<br/>

1. Clone this repo

   ```shell
   $ git clone https://github.com/mobikitinc/analyst.git
   ```

2. Check for npm

   ```shell
   $ npm --version
   ```

3. Navigate to AnalystBoxFrontend

   ```shell
   $ cd path_to/AnalystBoxFrontend
   ```

4. Install dependencies

   ```shell
   $ npm ci
   ```

5. Build production dist

   ```shell
   $ npm run build
   ```

6. Install via Package Folder

   ```shell
   $ npm install path_to/AnalystBoxFrontend
   ```

7. Install via Tarball (analystbox-x.x.x.tgz)

   ```shell
   $ npm install path_to/analystbox-x.x.x.tgz
   ```

</details>

<br/>

## Example

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import AnalystBox from 'analystbox';

const questions = ['who loves documentation?'];

const onQuestionSelect = ({ questionIndex, question }) => {
  console.log('onQuestionSelect: ', questionIndex, question);
};

const App = () => {
  return (
    <AnalystBox questions={questions} onQuestionSelect={onQuestionSelect} />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

<br/>

## Props

_All props are optional unless otherwise noted._

_Below is every prop with type, default value, and description!_

<br/>

### base

Type: `object`

Default: `{}`

Specify base attributes and props.

<details>
<summary>Global and Specific HTML Input Attributes</summary>

<br/>

You can pass in [global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes) and [specific attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) for the HTML input element. Remember to lowerCamelCase them! Good examples include:

- `autoComplete`
- `autoCorrect`
- `autoCapitalize`
- `spellCheck`

</details>

<br/>

<details>
<summary>Semantic UI React Search Props</summary>

<br/>

You can also pass in props to be spread into the base search component. See [semantic-ui-react/search](https://react.semantic-ui.com/modules/search/) for more information about the following props:

- `aligned`
- `as`
- `className`
- `defaultOpen`
- `defaultValue`
- `fluid`
- `icon`
- `input`
- `minCharacters`
- `noResultsDescription`
- `noResultsMessage`
- `onBlur`
- `onFocus`
- `onMouseDown`
- `onSelectionChange`
- `open`
- `selectFirstResult`
- `showNoResults`
- `size`

Note, that some props **cannot** be overriden:

- `category`
- `categoryRenderer`
- `categoryLayoutRenderer`
- `disabled`
- `loading`
- `onResultSelect`
- `onSearchChange`
- `results`
- `resultRenderer`
- `value`

</details>

<br/>

### keywords

Type: `array`

Default: `[]`

Keywords to find and highlight within questions.

<br/>

### keywordColor

Type: `string`

Default: `'#467fcf'`

Color of highlighted keywords.

<br/>

### questions

Type: `array`

Default: `[]`

Questions to search over.

<br/>

### searchOptions

Type: `object`

Default:

```js
{
    engines: { linearSubstringSearch: {} },
    findTimeout: 100,
    maxResults: 5
}
```

Configure search over questions.

<br/>

### searchOptions.engines

Type: `object`

Default:

```js
{
  linearSubstringSearch: {
  }
}
```

Search algorithm to use. If multiple specified, all run in parallel, and the first non-empty results are returned.

Options:

```js
{
    binaryPrefixSearch: {forceSmallestLexicographicResults: false},
    linearSubstringSearch: {},
    triePrefixSearch: {shouldCache: false}
}
```

| Name                    | Type      | Initialize |          | Find       |           | TLDR                 |
| ----------------------- | --------- | ---------- | -------- | ---------- | --------- | -------------------- |
|                         |           | Time       | Space    | Time       | Space     |                      |
| `binaryPrefixSearch`    | Prefix    | O(n log n) | **O(n)** | O(q log n) | **O(1)**  | Low memory usage     |
| `linearSubstringSearch` | Substring | **O(1)**   | **O(n)** | O(n(q+m))  | O(q)      | Quick initialization |
| `triePrefixSearch`      | Prefix    | O(nm)      | O(nm)    | **O(m)**   | O(n(m-q)) | Super fast           |

| Variable | Value                        |
| -------- | ---------------------------- |
| n        | number of questions          |
| m        | average length of a question |
| q        | length of query              |

\* _(all time and space complexities are idealized / simplified)_

<br/>

### binaryPrefixSearch.forceSmallestLexicographicResults

Type: `boolean`

Default: `false`

Return smallest lexicographic results, i.e. [al**arm**, al**bum**, etc] instead of [al**umni**, al**ways**, etc].

<br/>

### triePrefixSearch.shouldCache

Type: `boolean`

Default: `false`

Cache results if the entire subtrie rooted at the last letter of a query has been explored.

<br/>

### searchOptions.findTimeout

Type: `number`

Default: `100`

How many milliseconds to wait for search algorithms to respond before giving up and moving on. This provides an upper bound on the search.

Note, proper configuration of this value is very important! If set too low, the search will incorrectly return no results when results exist. If set too high, when truly no results exist for a given query, AnalystBox will be forced to wait findTimeout length before responding with no results.

<br/>

### searchOptions.maxResults

Type: `number`

Default: `5`

Maximum number of results to show in autocomplete.

<br/>

### onQuestionSelect

Type: `function`

Default: `({questionIndex, question}) => {}`

Called when a question is selected, where question is the value selected and questionIndex is its index within the questions.

<br/>

### onSearchChange

Type: `function`

Default: `({query}) => {}`

Called on search input change, where query is the user's entered query.

<br/>

## Demos

_See AnalystBox in action!_

- [DACT](../demos/dact/README.md#frontend)
- [DarkSky](../demos/darksky/README.md#frontend)

<br/>

## Development

### Setup

_Easily set up a local development environment!_

1. Clone this repo

   ```shell
   $ git clone https://github.com/mobikitinc/analyst.git
   ```

2. Check for npm

   ```shell
   $ npm --version
   ```

3. Navigate to AnalystBoxFrontend

   ```shell
   $ cd path_to/AnalystBoxFrontend
   ```

4. Install dependencies

   ```shell
   $ npm ci
   ```

5. Build development dist

   ```shell
   $ npm run build:dev
   ```

6. Pack into tarball _(optional)_
   ```shell
   $ npm run build:pack
   ```

_And you're off to the races!_

<br/>

### Notes

- Readability is something sacrificed (using forEach, map, reduce, etc) to obtain a slight performance boost in critical functions that are run frequently, like on every keystroke. These decisions were made given current browser versions and online resources, such as [jsperf](https://jsperf.com), and should be periodically reconsidered as javascript engines and browsers change.
- Few errors will cause AnalystBox to "explicitly" and "loudly" fail. Instead, most errors will result in an appropriate error message being written to the console, possibly accompanied by atypical behavior.

<br/>

### Algorithms

- [linearSubstringSearch.js](src/services/SearchProvider/options/linearSubstringSearch.js#L14-L52) utilizes the Knuth–Morris–Pratt (KMP) substring algorithm to reduce the worst-case runtime to search for a length-q substring in a length-m string from O(qm) to O(q+m).
  - [Stack Overflow](https://stackoverflow.com/a/44936961)
  - [Project Nayuki](knuth-morris-pratt-string-matching/kmp-string-matcher.js)
  - [Wikipedia](https://en.wikipedia.org/wiki/Knuth–Morris–Pratt_algorithm)
- [trie.js](src/services/SearchProvider/utils/trie.js) was loosely inspired by [jaimeagudo/sofiatree](https://github.com/jaimeagudo/sofiatree).
