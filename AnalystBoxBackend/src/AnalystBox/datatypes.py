from __future__ import annotations

from enum import Enum
from typing import List


# Datatype
class Datatype(Enum):
    """Represents the possible column datatypes that rules
    can specify. Allows variation between different database
    types to be handled properly.
    """

    INTEGER = "INTEGER"
    REAL = "REAL"
    TEXT = "TEXT"
    BOOLEAN = "BOOLEAN"
    TIME = "TIME"
    OTHER = "OTHER"
    NONE = "NONE"

    @staticmethod
    def get_list() -> List[Datatype]:
        """Get list of datatypes.

        :rtype: List[Datatype]
        """

        return [datatype for datatype in Datatype]


# Maps to Datatype
sqlite3_to_datatype = {
    "INT": Datatype.INTEGER,
    "INT2": Datatype.INTEGER,
    "INT8": Datatype.INTEGER,
    "INTEGER": Datatype.INTEGER,
    "TINYINT": Datatype.INTEGER,
    "SMALLINT": Datatype.INTEGER,
    "MEDIUMINT": Datatype.INTEGER,
    "BIGINT": Datatype.INTEGER,
    "UNSIGNED BIT INT": Datatype.INTEGER,
    "REAL": Datatype.REAL,
    "DOUBLE": Datatype.REAL,
    "DOUBLE PRECISION": Datatype.REAL,
    "FLOAT": Datatype.REAL,
    "DECIMAL": Datatype.REAL,
    "CHARACTER": Datatype.TEXT,
    "VARCHAR": Datatype.TEXT,
    "VARYING CHARACTER": Datatype.TEXT,
    "NCHAR": Datatype.TEXT,
    "NATIVE CHARACTER": Datatype.TEXT,
    "NVARCHAR": Datatype.TEXT,
    "TEXT": Datatype.TEXT,
    "CLOB": Datatype.TEXT,
    "BOOL": Datatype.BOOLEAN,
    "BOOLEAN": Datatype.BOOLEAN,
    "DATE": Datatype.TIME,
    "DATETIME": Datatype.TIME,
    "NUMERIC": Datatype.OTHER,
    "BLOB": Datatype.NONE,
    "": Datatype.NONE,
}

postgres_to_datatype = {
    "int2": Datatype.INTEGER,
    "int4": Datatype.INTEGER,
    "int8": Datatype.INTEGER,
    "integer": Datatype.INTEGER,
    "smallint": Datatype.INTEGER,
    "bigint": Datatype.INTEGER,
    "float4": Datatype.REAL,
    "float8": Datatype.REAL,
    "numeric": Datatype.REAL,
    "decimal": Datatype.REAL,
    "real": Datatype.REAL,
    "double precision": Datatype.REAL,
    "character varying": Datatype.TEXT,
    "character": Datatype.TEXT,
    "varchar": Datatype.TEXT,
    "char": Datatype.TEXT,
    "text": Datatype.TEXT,
    "citext": Datatype.TEXT,
    "bool": Datatype.BOOLEAN,
    "boolean": Datatype.BOOLEAN,
    "date": Datatype.TIME,
    "time": Datatype.TIME,
    "time with time zone": Datatype.TIME,
    "time without time zone": Datatype.TIME,
    "timestamp": Datatype.TIME,
    "timestamp with time zone": Datatype.TIME,
    "timestamp without time zone": Datatype.TIME,
    "timestamptz": Datatype.TIME,
    "timetz": Datatype.TIME,
    "interval": Datatype.TIME,
    "enum": Datatype.OTHER,
    "hstore": Datatype.OTHER,
    "money": Datatype.OTHER,
    "geography": Datatype.OTHER,
    "geometry": Datatype.OTHER,
    "cube": Datatype.OTHER,
    "point": Datatype.OTHER,
    "line": Datatype.OTHER,
    "lseg": Datatype.OTHER,
    "box": Datatype.OTHER,
    "circle": Datatype.OTHER,
    "path": Datatype.OTHER,
    "polygon": Datatype.OTHER,
    "cidr": Datatype.OTHER,
    "inet": Datatype.OTHER,
    "macaddr": Datatype.OTHER,
    "bit": Datatype.OTHER,
    "varbit": Datatype.OTHER,
    "bit varying": Datatype.OTHER,
    "bytea": Datatype.OTHER,
    "tsvector": Datatype.OTHER,
    "tsquery": Datatype.OTHER,
    "uuid": Datatype.OTHER,
    "xml": Datatype.OTHER,
    "json": Datatype.OTHER,
    "jsonb": Datatype.OTHER,
    "int4range": Datatype.OTHER,
    "int8range": Datatype.OTHER,
    "numrange": Datatype.OTHER,
    "tsrange": Datatype.OTHER,
    "tstzrange": Datatype.OTHER,
    "daterange": Datatype.OTHER,
    "": Datatype.NONE,
}
