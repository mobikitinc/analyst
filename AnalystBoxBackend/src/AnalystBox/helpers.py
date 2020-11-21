import itertools
import os
import warnings
from pathlib import Path

from .datatypes import Datatype


# Is Valid File
def is_valid_file(file_path):
    path = Path(file_path)

    # Return if path exists, path is file, and file can be read ok
    return path.exists() and path.is_file and os.access(file_path, os.R_OK)


# Get Datatype Permutations
def get_datatype_permutations(variate):
    return itertools.product(Datatype.get_list(), repeat=variate)
