import os
import re
import math
from .corpus import words

# Parser Setup
word_cost = dict(
    (
        word,
        math.log((i + 1) * math.log(len(words)))
    ) for i, word in enumerate(words)
)
max_length = max(len(x) for x in words)


# Parser
def parse(field):
    # Make lowercase
    field = field.lower()

    # Split on non-alphanumeric characters
    field = re.split(r'[^a-zA-Z0-9]+', field)

    # Parse all substrings
    result = [parse_core(subfield) for subfield in field]

    # Return string
    return " ".join(result)


# Parser Core
def parse_core(field):
    # Find best match's cost and length for the first i characters
    def best_match(i):
        candidates = enumerate(reversed(cost[max(0, i - max_length): i]))
        return min((c + word_cost.get(field[i - n - 1: i], 9e999), n + 1) for n, c in candidates)

    # Determine costs
    cost = [0]
    for i in range(1, len(field) + 1):
        c, n = best_match(i)
        cost.append(c)

    # Backtrack to find minimum cost string
    result = []
    i = len(field)
    while i > 0:
        c, n = best_match(i)
        assert c == cost[i]
        result.append(field[i - n: i])
        i -= n

    # Return string
    return " ".join(reversed(result))
