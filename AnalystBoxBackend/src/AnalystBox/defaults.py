from .qrks import QRK
from .datatypes import Datatype
from .blueprints import Blueprint


# Create default blueprint
blueprint = Blueprint('default')


# Add nullivariate expansions
@blueprint.expansion(variate=0)
def generator0(table, *args):
    yield QRK(
        f'{table} - show me everything',
        f'SELECT * FROM {table};',
        [table]
    )


# Add univariate expansions
@blueprint.expansion(variate=1)
def generator1(table, column0, *args):
    yield QRK(
        f'{table} - how many unique values are in {column0.name}',
        f'SELECT COUNT(DISTINCT {column0.field}) AS unique_values FROM {table};',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - how many null values are in {column0.name}',
        f'SELECT COUNT(*) AS null_values FROM {table} WHERE {column0.field} IS NULL;',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - show me all values of {column0.name}',
        f'SELECT {column0.field} FROM {table};',
        [table, column0.name]
    )


# Add boolean expansions
@blueprint.expansion((Datatype.BOOLEAN,))
def generator1_boolean(table, column0, *args):
    yield QRK(
        f'{table} - how many of {column0.name} are true',
        f'SELECT COUNT(*) AS true_values FROM {table} WHERE {column0.field};',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - how many of {column0.name} are false',
        f'SELECT COUNT(*) AS false_values FROM {table} WHERE {column0.field};',
        [table, column0.name]
    )


# Add date expansions
@blueprint.expansion((Datatype.TIME,))
def generator1_date(table, column0, *args):
    yield QRK(
        f'{table} - what is the timespan of {column0.name}',
        f'SELECT (MAX({column0.field}) - MIN({column0.field})) AS timespan FROM {table};',
        [table, column0.name]
    )


# Add integer expansions
@blueprint.expansion((Datatype.INTEGER,))
def generator1_integer(table, column0, *args):
    yield QRK(
        f'{table} - show me the most common values for {column0.name}',
        f'SELECT {column0.field}, COUNT({column0.field}) AS count FROM {table} GROUP BY {column0.field} ORDER BY count DESC;',
        [table, column0.name]
    )


# Add numeric expansions
@blueprint.expansion((Datatype.REAL,))
def generator1_numeric(table, column0, *args):
    yield QRK(
        f'{table} - what is the average of {column0.name}',
        f'SELECT AVG({column0.field}) AS mean FROM {table};',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - what is the minimum of {column0.name}',
        f'SELECT MIN({column0.field}) AS min FROM {table};',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - what is the maximum of {column0.name}',
        f'SELECT MAX({column0.field}) AS max FROM {table};',
        [table, column0.name]
    )
    yield QRK(
        f'{table} - show me the top 10 ordered by {column0.name}',
        f'SELECT * FROM {table} ORDER BY {column0.field} DESC LIMIT 10;',
        [table, column0.name]
    )


# Add text expansions
@blueprint.expansion((Datatype.TEXT,))
def generator1_text(table, column0, *args):
    yield QRK(
        f'{table} - show me the most common values for {column0.name}',
        f'SELECT {column0.field}, COUNT({column0.field}) AS count FROM {table} GROUP BY {column0.field} ORDER BY count DESC;',
        [table, column0.name]
    )


# Add bivariate expansions
@blueprint.expansion(variate=2)
def generator2(table, column0, column1, *args):
    yield QRK(
        f'{table} - show me all values of {column0.name} and {column1.name}',
        f'SELECT {column0.field}, {column1.field} FROM {table};',
        [table, column0.name, column1.name]
    )
    yield QRK(
        f'{table} - show me all values of {column0.name} grouped by {column1.name}',
        f'SELECT {column0.field} FROM {table} GROUP BY {column1.field};',
        [table, column0.name, column1.name]
    )
