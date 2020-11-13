# External
from warnings import warn


# Blueprint
class Blueprint():
    """Represents a blueprint, a collection of rules and their
    corresponding expansion functions that can be registered
    on a real application later.

    A blueprint is an object that allows defining application
    expansion functions without requiring an application object
    ahead of time. It uses the same decorators as AnalystBox but
    defers the need for an application by recording them for later registration.

    :param name: Used to specify the name of the blueprint.
    """

    _is_registered = False

    def __init__(self, name):
        self.name = name

        # Create list of deferred functions
        self.deferred = []

    def add_expansion(self, func, rule=None, variate=0):
        """Like :meth:`AnalystBox.add_expansion` but for a blueprint.
        """

        # Record expansion
        self.record(lambda s: s.add_expansion(func, rule, variate))

    def expansion(self, rule=None, variate=0):
        """Like :meth:`AnalystBox.expansion` but for a blueprint.
        """

        def decorator(func):
            self.add_expansion(func, rule, variate)
            return func

        return decorator

    def record(self, func):
        """Registers a function that is called when the blueprint is
        registered on the application.

        :param func: The function to call on blueprint register.
        """

        # If already registered, warn
        if self._is_registered:
            warn('blueprint has been registered and is being modified, new changes will not appear')

        # Add function to deferred
        self.deferred.append(func)

    def register(self, state):
        """Called by :meth:`AnalystBox.register_blueprint` with the application
        to register all rules and their corresponding expansion functions.

        :param state: The application to register the blueprint onto.
        """

        # If already registered, warn
        if self._is_registered:
            warn('blueprint already registered, registration is being skipped')
        else:
            # Otherwise set registered
            self._is_registered = True

        # Call all deferred functions with AnalystBox as the state
        for func in self.deferred:
            func(state)
