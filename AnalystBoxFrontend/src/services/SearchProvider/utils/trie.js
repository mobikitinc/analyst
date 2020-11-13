class Trie {
  constructor(shouldCache = false) {
    this.shouldCache = shouldCache;

    this.root = this;
    this.children = null;
    this.cache = null;
    this.end = false;
    this.qrkIndex = null;
  }

  // Insert question into trie
  insert = (question, qrkIndex) => {
    // Input validation
    if (!question || typeof question !== 'string' || !question.length) return;

    // Input processing
    question = question.toLowerCase();

    // Setup
    let depth;
    let node = this.root;
    const { shouldCache } = this;

    // Find starting node (last letter of the question that is already present)
    for (
      depth = 0;
      depth < question.length && node.children && node.children[question[depth]];
      depth += 1
    ) {
      // Move to next node
      node = node.children[question[depth]];
    }

    // If letters remain
    if (depth < question.length) {
      // Add nodes for remaining letters
      while (depth < question.length) {
        // Create children
        if (!node.children) {
          node.children = {};
        }

        // Add letter
        node.children[question[depth]] = new Trie(shouldCache);

        // Move to next node
        node = node.children[question[depth]];
        depth += 1;
      }
    }

    // Mark end of question
    node.end = true;
    node.qrkIndex = qrkIndex;
  };

  // Get matches from trie
  getMatches = (prefix, maxResults) => {
    // Input validation
    if (!prefix || typeof prefix !== 'string') return [];

    // Input processing
    prefix = prefix.toLowerCase();

    // Setup
    let depth;
    let startNode = this.root;
    const results = [];
    const { shouldCache } = this;

    // Find the starting node to get matches from / last letter of prefix
    for (depth = 0; depth < prefix.length; depth += 1) {
      if (!startNode.children || !startNode.children[prefix[depth]]) {
        return results;
      }

      startNode = startNode.children[prefix[depth]];
    }

    // Setup "queue"
    let position = 0;
    let node = startNode;
    const nodes = [node];

    // While more nodes to see and insufficient number of results
    while (position < nodes.length && results.length < maxResults) {
      // Get next node
      node = nodes[position];

      // If end of question and not cached
      if (node.end && !node.cache) {
        // Add result
        results.push(node.qrkIndex);
      }

      // If caching and is cached
      if (shouldCache && node.cache) {
        // Add cached results
        node.cache.forEach((qrkIndex) => {
          results.push(qrkIndex);
        });
      } else if (node.children) {
        // Add subtrie to be visited
        const letters = Object.keys(node.children);
        for (let i = 0; i < letters.length; i += 1) {
          const letter = letters[i];
          nodes.push(node.children[letter]);
        }
      }

      // Clear current node
      nodes[position] = null;

      // Increment position
      position += 1;
    }

    // If caching, starting node not cached, and no more nodes to consider
    if (shouldCache && !startNode.cache && position === nodes.length) {
      startNode.cache = results;
    }

    // Return results
    return results.slice(0, maxResults);
  };
}

export default Trie;
