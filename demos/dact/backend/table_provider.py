import sqlite3
from flask import g


class TableProvider:
    def __init__(self, db_path):
        self.db_path = db_path

    def query(self, sql):
        db = self.__get_db()
        rows = db.execute(sql)
        rows = [dict(row) for row in rows]
        columns = rows[0].keys()
        columns = [{'headerName': column, 'field': column} for column in columns]
        return (columns, rows)

    def __get_db(self):
        if 'db' not in g:
            g.db = sqlite3.connect(
                self.db_path,
                detect_types=sqlite3.PARSE_DECLTYPES
            )
            g.db.row_factory = sqlite3.Row
        return g.db

    def teardown(self, error=None):
        db = g.pop('db', None)
        if db is not None:
            db.close()
