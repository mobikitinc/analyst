import sqlite3
from urllib.parse import urlparse
from warnings import warn

import psycopg2
import psycopg2.extras

from .datatypes import Datatype, postgres_to_datatype, sqlite3_to_datatype
from .field_parser import parse
from .helpers import is_valid_file
from .qrks import generate_qrks


# Database Connections
# Database Connections - Interface
class BaseConnection:
    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_value, traceback):
        pass


# Database Connections - SQLite
class SQLiteConnection(BaseConnection):
    def __init__(self, db_path):
        self.db_path = db_path
        self.db = None

    def __enter__(self):
        self.db = sqlite3.connect(self.db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        self.db.row_factory = sqlite3.Row
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        if self.db is not None:
            self.db.close()


# Database Connections - Postgres
class PostgresConnection(BaseConnection):
    def __init__(self, user, password, host, database):
        self.user = user
        self.password = password
        self.host = host
        self.database = database

        self.connection = None
        self.cursor = None

    def __enter__(self):
        self.connection = psycopg2.connect(
            user=self.user,
            password=self.password,
            host=self.host,
            database=self.database,
        )
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        return self.cursor

    def __exit__(self, exc_type, exc_value, traceback):
        if self.connection is not None:
            if self.cursor is not None:
                self.cursor.close()
            self.connection.close()


# Database Wrappers
# Database Wrappers - Interface
class BaseWrapper:
    def get_all_tables(self):
        pass

    def get_all_columns(self, table):
        pass


# Database Wrappers - SQLite
class SQLiteWrapper(BaseWrapper):
    def __init__(self, db_path):
        assert is_valid_file(
            db_path
        ), "db_path must resolve to an existing, readable file"
        self.db_path = db_path

    def __get_datatype(self, datatype):
        if datatype not in sqlite3_to_datatype:
            raise ValueError(
                f'datatype "{datatype}" must be in {set(sqlite3_to_datatype.keys())}'
            )

        return sqlite3_to_datatype[datatype]

    def get_all_tables(self):
        with SQLiteConnection(self.db_path) as db:
            tables = db.execute(f"SELECT name FROM sqlite_master WHERE type='table';")
            tables = [dict(result)["name"] for result in tables]

        return tables

    def get_all_columns(self, table):
        with SQLiteConnection(self.db_path) as db:
            columns = db.execute(f"PRAGMA table_info('{table}')")
            columns = [dict(result) for result in columns]

        columns = [
            (result["name"], self.__get_datatype(result["type"])) for result in columns
        ]
        return columns


# Database Wrappers - Postgres
class PostgresWrapper(BaseWrapper):
    def __init__(self, db_path):
        result = urlparse(db_path)
        self.user = result.username
        self.password = result.password
        self.host = result.hostname
        self.database = result.path[1:]

    def __get_datatype(self, datatype):
        if datatype not in postgres_to_datatype:
            raise ValueError(
                f'datatype "{datatype}" must be in {set(postgres_to_datatype.keys())}'
            )

        return postgres_to_datatype[datatype]

    def get_all_tables(self):
        with PostgresConnection(
            self.user, self.password, self.host, self.database
        ) as cursor:
            cursor.execute(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
            )
            tables = cursor.fetchall()
            tables = [table[0] for table in tables]

        return tables

    def get_all_columns(self, table):
        with PostgresConnection(
            self.user, self.password, self.host, self.database
        ) as cursor:
            columns = []

            cursor.execute(f"SELECT * FROM {table} LIMIT 0")
            column_names = [column.name for column in cursor.description]

            for column in column_names:
                cursor.execute(
                    f"SELECT data_type FROM information_schema.columns WHERE column_name = '{column}' AND table_name = '{table}'"
                )
                column_type = cursor.fetchall()[0][0]
                columns.append((column, self.__get_datatype(column_type)))

        return columns


# Database Wrappers - Main
class DatabaseWrapper(BaseWrapper):
    def __init__(self, db_path, db_type):
        # Database path
        self.db_path = db_path

        # Check if database type is valid
        supported_db_types = {"sqlite3": SQLiteWrapper, "postgres": PostgresWrapper}
        if db_type not in supported_db_types:
            raise ValueError(
                f'database type "{db_type}" must be in {set(supported_db_types.keys())}'
            )

        # Create proper database wrapper
        self.db = supported_db_types[db_type](self.db_path)

    def get_all_tables(self):
        return self.db.get_all_tables()

    def get_all_columns(self, table):
        return self.db.get_all_columns(table)


# Database
# Database - Main
class Database:
    """Represents a database."""

    def __init__(self, db_path, db_type, tables):
        # Create database wrapper
        self.db = DatabaseWrapper(db_path, db_type)

        # Get all tables
        all_tables = self.db.get_all_tables()

        # Check tables
        if not tables:
            tables = all_tables
        else:
            for table in tables:
                if table not in all_tables:
                    raise ValueError(f'table "{table}" must be in {set(all_tables)}')

        # Get tables and columns information
        self.tables = []
        for table in tables:
            columns = self.db.get_all_columns(table)
            columns = [Column(fieldname, datatype) for (fieldname, datatype) in columns]
            self.tables.append(Table(table, columns))

        # Create expansions and set max variate
        self.expansions = {}
        self.max_variate = 0

        # Create cache
        self.cache = None

    def add_expansion(self, rule, func):
        # If rule doesn't exist, create empty list
        if rule not in self.expansions:
            self.expansions[rule] = []

        # Append expansion function to rule's list
        self.expansions[rule].append(func)

        # Update max variate, if needed
        self.max_variate = max(self.max_variate, len(rule))

        # Invalidate cache
        self.cache = None

    def get_qrks(self):
        # If not cached, generate and cache QRKs
        if not self.cache:
            questions, results, keywords = [], [], []

            # For all tables
            for table in self.tables:
                # For each QRK in generator
                for qrk in generate_qrks(
                    self.expansions, self.max_variate, table.name, table.columns
                ):
                    questions.append(qrk.question)
                    results.append(qrk.result)
                    keywords.extend(qrk.keywords)

            # Make keywords distinct
            keywords = list(set(keywords))

            # Check for question collision
            if len(questions) != len(set(questions)):
                warn("question collision detected, consider changing expansions")

            # Set cache
            self.cache = (questions, results, keywords)

        # Return cache
        return self.cache


# Database - Table
class Table:
    """Represents a table in a database."""

    def __init__(self, name, columns):
        self.name = name
        self.columns = columns


# Database - Column
class Column:
    """Represents a column in a table.

    Given as a parameter in univariate, bivariate, and multivariate expansions.
    """

    def __init__(self, field, datatype):
        self.field = field
        self.datatype = datatype

        # Parse field to create more readable name
        self.name = parse(self.field)
