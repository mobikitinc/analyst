from __future__ import annotations

import math
import os
import re
from typing import Tuple

from .corpus import words

# Parser Setup
word_cost = dict(
    (word, math.log((i + 1) * math.log(len(words)))) for i, word in enumerate(words)
)
max_length = max(len(x) for x in words)


# Parser
def parse(field: str) -> str:
    # Make lowercase
    field = field.lower()

    # Split on non-alphanumeric characters
    field_words = re.split(r"[^a-zA-Z0-9]+", field)

    # Parse all substrings
    result = [parse_core(word) for word in field_words]

    # Return string
    return " ".join(result)


# Parser Core
def parse_core(word: str) -> str:
    # Find best match's cost and length for the first i characters
    def best_match(i: int) -> Tuple[float, int]:
        candidates = enumerate(reversed(cost[max(0, i - max_length) : i]))
        return min(
            (c + word_cost.get(word[i - n - 1 : i], 9e999), n + 1)
            for n, c in candidates
        )

    # Determine costs
    cost = [0.0]
    for i in range(1, len(word) + 1):
        c, n = best_match(i)
        cost.append(c)

    # Backtrack to find minimum cost string
    result = []
    i = len(word)
    while i > 0:
        c, n = best_match(i)
        assert c == cost[i]
        result.append(word[i - n : i])
        i -= n

    # Return string
    return " ".join(reversed(result))
