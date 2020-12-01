from __future__ import annotations

import itertools
import json
from typing import TYPE_CHECKING, Any, Callable, Dict, Iterable, List, Protocol, Tuple

if TYPE_CHECKING:
    from .database import Column
    from .datatypes import Datatype
    from .types import QRKGenerator, QRKRule


# Generate QRKs
def generate_qrks(
    expansions: Dict[QRKRule, List[QRKGenerator]],
    max_variate: int,
    table_name: str,
    columns: List[Column],
) -> Iterable[QRK]:
    # Create result
    results = []

    # For each variate
    for r in range(0, max_variate + 1):
        # Generate column options
        column_options = itertools.permutations(columns, r=r)

        # For each option
        for option in column_options:
            # Get cooresponding rule
            rule = tuple((o.datatype for o in option))

            # Get all generators (relevant expansions) for the rule
            generators = expansions.get(rule, [])

            # For each generator
            for generator in generators:
                # Call generator with table name and columns
                generator_result = generator(table_name, *list(option))

                # Append generator to result
                results.append(generator_result)

    # Chain resulting generators together
    result = itertools.chain(*results)

    # Return QRK generator
    return result


# QRK
class QRK:
    """Represents a question-result-keywords pair that should be
    yielded one or more times from any valid expansion function.
    """

    def __init__(self, question: Any, result: Any, keywords: List[Any] = []):
        self.question = question
        self.result = result
        self.keywords = keywords
