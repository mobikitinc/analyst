# Internal
from .database import Database
from .datatypes import Datatype
from .helpers import get_datatype_permutations
from .defaults import blueprint


# AnalystBox
class AnalystBox:
    """The AnalystBox object acts as the central object.
    It is passed the file path to a database. Once it is created it will act as
    the central registry for rules and their cooresponding expansions.

    :param db_path: Used to specify the path to the database.
    :param db_type: Used to specify the type of the database.
    :param tables: The name of table(s) that should be used from the database.
    :param default_expansions: Whether the default expansions in defaults should be used.
    """

    def __init__(self, db_path, db_type='postgres', tables=[], default_expansions=False):
        # Input
        assert type(db_path) == str, 'db_path must be of type str'
        assert type(db_type) == str, 'db_type must be of type str'
        assert type(tables) == str or type(tables) == list, 'tables must be of type Union[str, List[str]]'
        assert type(default_expansions) == bool, 'default_expansions must be of type bool'

        if type(tables) == str:
            tables = [tables]

        # Create database
        self.db = Database(db_path, db_type, tables)

        # Create blueprints
        self.blueprints = {}

        # If default expansions wanted, register default blueprint
        if default_expansions:
            self.register_blueprint(blueprint)

    def add_expansion(self, func, rule=None, variate=0):
        """Adds an expansion rule. Works exactly like the :meth:`expansion` decorator.

        Basically this example::

            @box.expansion(variate=0)
            def index(table, *args):
                yield QRK('', '', [])

        Is equivalent to the following::

            def index(table, *args):
                yield QRK('', '', [])
            box.add_expansion(None, index, variate=0)

        :param func: The function to yield one or more :mod:`QRK` objects.
        :param rule: The expansion rule.
        :param variate: A shorthand to specify the "variate" the expansion rule should target, i.e. univariate, bivariate, etc.
        """

        # Input
        assert func, 'func must be defined'
        if rule:
            assert type(rule) == tuple, 'rule must be of type tuple'
            for datatype in rule:
                if datatype not in Datatype.__members__:
                    assert type(datatype) == Datatype, f'datatype {datatype} must be in {list(Datatype)}'
        else:
            assert variate is not None, 'either rule or variate must be specified'
            assert type(variate) == int, 'variate must be of type int'
            assert variate >= 0, 'variate must be greater than or equal to 0'

        # If rule, add single expansion
        if rule:
            self.db.add_expansion(rule, func)
        else:
            # Otherwise, add multiple expansions
            for rule in get_datatype_permutations(variate):
                self.db.add_expansion(rule, func)

    def expansion(self, rule=None, variate=0):
        """A decorator that is used to register an expansion function
        for a given rule. This does the same thing as add_expansion() but is
        intended for decorator usage::

            @box.expansion(variate=0)
            def index(table, *args):
                yield QRK('', '', [])

        :param rule: The expansion rule.
        :param variate: A shorthand to specify the "variate" the expansion rule should target, i.e. univariate, bivariate, etc.
        """

        def decorator(func):
            self.add_expansion(func, rule, variate)
            return func

        return decorator

    def get_qrks(self):
        """Get :mod:`QRK`s and split into lists given current database, tables, and expansions.

        :rtype: Tuple[List[str], List[str], List[Any]]
        """

        return self.db.get_qrks()

    def register_blueprint(self, blueprint):
        """Register a :mod:`Blueprint` on the application.

        Calls the blueprint's register method after recording the blueprint
        in the application's blueprints. That call then subsequently calls
        application's :meth:`add_expansion` several times.

        :param blueprint: The blueprint to register.
        """

        # Input
        if blueprint.name in self.blueprints:
            assert self.blueprints[blueprint.name] == blueprint, 'blueprint collision detected'

        # If no collision, add blueprint
        if blueprint.name not in self.blueprints:
            self.blueprints[blueprint.name] = blueprint

        # Register blueprint to AnalystBox
        blueprint.register(self)
