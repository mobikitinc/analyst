# AnalystBox/Backend

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Installation](#installation)
- [Example](#example)
- [Quick Start](#quick-start)
- [API](#api)
  - [Application Object](#application-object)
  - [Blueprint Object](#blueprint-object)
  - [Datatype Object](#datatype-object)
  - [QRK Object](#qrk-object)
- [Demos](#demos)
- [Development](#development)

<br/>

## Introduction

**Understand data one and all.**

AnalystBoxBackend is a data analyst that enables database queries in natural language - your language - allowing data to be understood by anyone. It's a python package designed for high versatility and seamless integration with a wide variety of projects.

<br/>

## Setup

_The basics you'll need before you can get started with anything else!_

1. Clone this repo

   ```shell
   $ git clone https://github.com/mobikitinc/analyst.git
   ```

2. Check for python3 (_let's just call this `python`_)

   ```shell
   $ python --version
   $ python3 --version
   $ ...
   ```

3. Check for pip3 (_we'll call this `pip` from here on out_)
   ```shell
   $ pip --version
   $ pip3 --version
   $ ...
   ```

<br/>

## Installation

_AnalystBox isn't on the Python Package Index (PyPI), so installing it is a bit different than usual!_

Via Package Folder

```shell
$ pip install path_to/AnalystBoxBackend
```

Via Source Archive (AnalystBox-x.x.x.tar.gz)

```shell
$ pip install path_to/AnalystBox-x.x.x.tar.gz
```

Via Built Distribution (AnalystBox-x.x.x-py3-none-any.whl)

```shell
$ pip install path_to/AnalystBox-x.x.x-py3-none-any.whl
```

<br/>

## Example

```python
from AnalystBox import AnalystBox

box = AnalystBox('postgresql://user:password@netloc:port/dbname')

box = AnalystBox('path_to/file.db', db_type='sqlite3')

questions, results, keywords = box.get_qrks()

# ...
```

<br/>

## Quick Start

### Basic

_First, let's import everything we'll need._

```python
from AnalystBox import AnalystBox
```

_Next, create the box._

_We want AnalystBox to do the heavy lifting, so remember to let it use defaults expansions. This will generate question-result-keywords (QRKs) automatically._

```python
db_path = 'path_to/file.db'
box = AnalystBox(db_path, db_type='sqlite3', default_expansions=True)
```

_And that's it, let's call [get_qrks](#application-get-qrks) and see the questions!_

```python
questions, results, keywords = box.get_qrks()
print(questions)
```

<br/>

### Advanced

_We'll need to import a few more things._

```python
from AnalystBox import AnalystBox, Datatype, QRK
```

_Like before, create the box. This time without any default expansions._

```python
db_path = 'path_to/file.db'
box = AnalystBox(db_path, db_type='sqlite3')
```

_Use the [expansion decorator](#application-expansion) to define an expansion for a particular rule._

_Here our rule applies to any column of Datatype.TEXT._

_We can assume that AnalystBox will do the right thing and give us the table name and [Column](#column-object). We'll ignore any other parameters._

```python
@box.expansion((Datatype.TEXT,))
def index(table, column0, *args):
    yield QRK(
        f'show me all values of {column0.name}',
        f'SELECT {column.field} from {table};',
        [column0.name]
    )
```

_Actually, it'd be nice to ask that question for every column - that is every datatype._

_Turns out it's pretty easy, all we need to do is change the rule from Datatype.Text to variate=1 (for univariate)._

```python
@box.expansion(variate=1)
def index(table, column0, *args):
    yield QRK(
        f'show me all values of {column0.name}',
        f'SELECT {column.field} from {table};',
        [column0.name]
    )
```

_Let's add a bivariate question._

_Turns out this isn't that hard either, all we need to do is assume we get another [Column](#column-object)._

```python
@box.expansion(variate=2)
def index(table, column0, column1, *args):
    yield QRK(
        f'show me all values of {column0.name} and {column1.name}',
        f'SELECT {column0.field}, {column1.field} from {table};',
        [column0.name, column1.name]
    )
```

_And that's it, let's see how many question-result pairs and keywords we have!_

```python
questions, results, keywords = box.get_qrks()
print(len(questions))
print(len(results))
print(len(keywords))
```

<br/>

### Expert

_This time, we import everything._

```python
from AnalystBox import AnalystBox, Blueprint, Datatype, QRK
```

_Next create a blueprint._

```python
example = Blueprint('documentation')
```

_Like before, use the expansion decorator, except this time on the blueprint, not the box._

_Also, let's use the nullivariate rule, which just means our expansion will run on the entire table without needing any columns._

```python
@example.expansion(variate=0)
def index(table, *args):
    yield QRK(
        'who loves documentation',
        'mobikit',
        ['loves documentation']
    )
    yield QRK(
        'show me everything',
        f'SELECT * from {table}',
        ['everything']
    )
```

_We can then store this blueprint and use it later!_

_Whenever you're ready, create the box._

```python
db_path = 'path_to/file.db'
box = AnalystBox(db_path, db_type='sqlite3')
```

_Then, call [register_blueprint](#blueprint-register-blueprint) on the box!_

```python
box.register_blueprint(example)
```

_Finally, get the QRKs!_

```python
questions, results, keywords = box.get_qrks()
print(questions, results, keywords)
```

<br/>

## API

_This part of the documentation covers all of the interfaces of AnalystBox!_

<br/>

### Application Object

_class_ AnalystBox.**AnalystBox**( _db_path, db_type='postgres', tables=[], default_expansions=False_ )

The AnalystBox object acts as the central object. It is passed the file path to a database. Once it is created it will act as the central registry for rules and their cooresponding expansions.

<details open>
<summary>Parameters</summary>

<h4 id="application-db-path">db_path</h4>

Used to specify the path to the database.

Type: `str`

Default: N/A

<br/>

<h4 id="application-db-type">db_type</h4>

Used to specify the type of the database.

Type: `str`

Default: `'postgres'`

Options: `'postgres'`, `'sqlite3'`

<br/>

<h4 id="application-tables">tables</h4>

The name of table(s) that should be used from the database.

Type: `Union[str, List[str]]`

Default: `[]`

<br/>

<h4 id="application-default-expansions">default_expansions</h4>

Whether the default expansions in [defaults](src/AnalystBox/defaults.py) should be used.

Type: `bool`

Default: `False`

</details>

<br/>

<details open>
<summary>Instance Attributes</summary>

<h4 id="application-add-expansion">add_expansion( <i>func, rule=None, variate=0</i> )</h4>

Adds an expansion rule. Works exactly like the [expansion()](#application-expansion) decorator.

Basically this example:

```python
@box.expansion(variate=0)
def index(table, *args):
    yield QRK('', '', [])
```

Is equivalent to the following:

```python
def index(table, *args):
    yield QRK('', '', [])
box.add_expansion(None, index, variate=0)
```

<details>
<summary>Parameters</summary>

<h5 id="application-add_expansion-func">func</h5>

The function to yield one or more [QRK](#qrk-object) objects.

Type: `Callable`

Default: N/A

<br/>

<h5 id="application-add_expansion-rule">rule <i>(optional)</i></h5>

The expansion rule.

Type: `Tuple[`[Datatype](#datatype-object)`, ...]`

Default: `None`

<br/>

<h5 id="application-add_expansion-variate">variate <i>(optional)</i></h5>

A shorthand to specify the "variate" the expansion rule should target, i.e. univariate, bivariate, etc.

Type: `int`

Default: `0`

</details>

<br/>

<h4 id="application-blueprints">blueprints = <i>None</i></h4>

Internal. Use Cautiously. Blueprints registered on the application.

<br/>

<h4 id="application-db">db = <i>None</i></h4>

Internal. Use Cautiously. Database representation.

<br/>

<h4 id="application-expansion">expansion( <i>rule=None, variate=0</i> )</h4>

A decorator that is used to register an expansion function for a given rule. This does the same thing as [add_expansion()](#analystbox-add-expansion) but is intended for decorator usage:

```python
@box.expansion(variate=0)
def index(table, *args):
    yield QRK('', '', [])
```

<details>
<summary>Parameters</summary>

<h5 id="application-expansion-rule">rule <i>(optional)</i></h5>

The expansion rule.

Type: `Tuple[`[Datatype](#datatype-object)`, ...]`

Default: `None`

<br/>

<h5 id="application-expansion-variate">variate <i>(optional)</i></h5>

A shorthand to specify the "variate" the expansion rule should target, i.e. univariate, bivariate, etc.

Type: `int`

Default: `0`

</details>

<br/>

<h4 id="application-get-qrks">get_qrks()</h4>

Get [QRK](#qrk-object)s and split into lists given current database, tables, and expansions.

Returns: `Tuple[List[Any], List[Any], List[Any]]`

<br/>

<h4 id="application-register-blueprint">register_blueprint( <i>blueprint</i> )</h4>

Register a [Blueprint](#blueprint-object) on the application.

Calls the blueprint's register method after recording the blueprint in the application's [blueprints](#application-blueprints). That call then subsequently calls application's [add_expansion()](#application-add-expansion) several times.

<details>
<summary>Parameters</summary>

<h5 id="application-register-blueprint-blueprint">blueprint</h5>

The blueprint to register.

Type: [Blueprint](#blueprint-object)

Default: `None`

</details>

</details>

<br/>

### Blueprint Object

_class_ AnalystBox.**Blueprint**( _name_ )

Represents a blueprint, a collection of rules and their corresponding expansion functions that can be registered on a real application later.

A blueprint is an object that allows defining application expansion functions without requiring an application object ahead of time. It uses the same decorators as AnalystBox but defers the need for an application by recording them for later registration.

<details>
<summary>Parameters</summary>

<h4 id="blueprint-name">name</h4>

Used to specify the name of the blueprint.

Type: `str`

Default: N/A

</details>

<br/>

<details>
<summary>Instance Attributes</summary>

<h4 id="blueprint-add-expansion">add_expansion( <i>func, rule=None, variate=0</i> )</h4>

Like [AnalystBox.add_expansion()](#application-add-expansion) but for a blueprint.

<br/>

<h4 id="blueprint-deferred">deferred = <i>None</i></h4>

Internal. Use Cautiously. Functions to be registered at a later time.

<br/>

<h4 id="blueprint-expansion">expansion( <i>rule=None, variate=0</i> )</h4>

Like [AnalystBox.expansion()](#application-expansion) but for a blueprint.

<br/>

<h4 id="blueprint-name">name = <i>None</i></h4>

Internal. Use Cautiously. Name of the blueprint.

<br/>

<h4 id="blueprint-record">record( <i>func</i> )</h4>

Registers a function that is called when the blueprint is registered on the application.

<details>
<summary>Parameters</summary>

<h5 id="blueprint-record-func">func</h5>

The function to call on blueprint register.

Type: `Callable`

Default: N/A

</details>

<br/>

<h4 id="blueprint-register">register( <i>state</i> )</h4>

Called by [AnalystBox.register_blueprint()](#application-register-blueprint) with the application to register all rules and their corresponding expansion functions.

<details>
<summary>Parameters</summary>

<h5 id="blueprint-register-state">state</h5>

The application to register the blueprint onto.

Type: [AnalystBox](#application-object)

Default: N/A

</details>

</details>

<br/>

### Column Object

_class_ AnalystBox.**Column**

Represents a column in the database. Given as a parameter in univariate, bivariate, and multivariate expansions.

<details>
<summary>Instance Attributes</summary>

<h4 id="column-datatype">datatype = <i>None</i></h4>

Column's datatype.

Type: [Datatype](#datatype-object)

<br/>

<h4 id="column-field">field = <i>None</i></h4>

Column's field, as received from database.

Type: `str`

<br/>

<h4 id="column-name">name = <i>None</i></h4>

Column's parsed name for indecipherable fields. For example, `thisisanexample` will be converted to `this is an example`.

</details>

<br/>

### Datatype Object

_class_ AnalystBox.**Datatype**

Represents the possible column datatypes that rules can specify. Allows variation between different database types to be handled properly.

<details>
<summary>Members</summary>

```python
    INTEGER = 'INTEGER'
    REAL = 'REAL'
    TEXT = 'TEXT'
    BOOLEAN = 'BOOLEAN'
    TIME = 'TIME'
    OTHER = 'OTHER'
    NONE = 'NONE'
```

</details>

<br/>

<details>
<summary>Class Attributes</summary>

<h4 id="datatype-get-list">get_list()</h4>

Get list of datatypes.

Returns: `List[Datatype]`

</details>

<br/>

### QRK Object

_class_ AnalystBox.**QRK**( _question, result, keywords=[]_ )

Represents a question-result-keywords pair that should be yielded one or more times from any valid expansion function.

<details>
<summary>Parameters</summary>

<h4 id="qrk-question">question</h4>

QRK's question.

Type: `Any`

Default: N/A

<br/>

<h4 id="qrk-result">result</h4>

QRK's result.

Type: `Any`

Default: N/A

<br/>

<h4 id="qrk-keywords">keywords <i>(optional)</i></h4>

QRK's keywords.

Type: `List[Any]`

Default: `[]`

</details>

<br/>

<details>
<summary>Instance Attributes</summary>

<h4 id="qrk-keywords">keywords = <i>None</i></h4>

Internal. Use Cautiously. QRK's keywords.

<br/>

<h4 id="qrk-result">result = <i>None</i></h4>

Internal. Use Cautiously. QRK's result.

<br/>

<h4 id="qrk-question">question = <i>None</i></h4>

Internal. Use Cautiously. QRK's question.

</details>

<br/>

## Demos

_See AnalystBox in action!_

- [DACT](../demos/dact/README.md#backend)

<br/>

## Development

### Setup

_Easily set up a local development environment!_

1. Navigate to AnalystBoxBackend

   ```shell
   $ cd path_to/AnalystBoxBackend
   ```

2. Create venv

   ```shell
   $ python -m venv venv
   ```

3. Activate venv

   ```shell
   $ source venv/bin/activate
   ```

4. Install requirements

   ```shell
   $ pip install -r requirements.txt
   ```

5. Install AnalystBox in development mode

   ```shell
   $ pip install -e path_to/AnalystBoxBackend
   ```

6. Generate distribution archives - [PyPA](https://packaging.python.org/tutorials/packaging-projects/#generating-distribution-archives) _(optional)_

   ```shell
   $ pip install --upgrade setuptools wheel

   $ python setup.py sdist bdist_wheel
   ```

_And you're off to the races!_

<br/>

### Algorithms

- [field_parser/index.py](src/AnalystBox/field_parser/index.py) was inspired by [Stack Overflow](https://stackoverflow.com/a/11642687).
