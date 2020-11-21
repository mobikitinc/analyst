import itertools
import json


# Generate QRKs
def generate_qrks(expansions, max_variate, table, columns):
    # Create result
    result = []

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
                generator = generator(table, *list(option))

                # Append generator to result
                result.append(generator)

    # Chain resulting generators together
    result = itertools.chain(*result)

    # Return QRK generator
    return result


# QRK
class QRK:
    """Represents a question-result-keywords pair that should be
    yielded one or more times from any valid expansion function.
    """

    def __init__(self, question, result, keywords=[]):
        self.question = question
        self.result = result
        self.keywords = keywords
