class BaseSearch {
  constructor(config = {}) {
    this.config = config;
  }

  initialize = () => this;

  find = () => [];
}

export default BaseSearch;
