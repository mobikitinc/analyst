import sys
from flask import Flask, request, g
from flask_cors import CORS
from AnalystBox import AnalystBox
from table_provider import TableProvider


# Setup
DB_PATH_SQLITE3 = './data/demo.db'
DB_PATH_POSTGRES = 'postgresql://mobikit@localhost:5432/mobikit_demo'

DB_PATH = DB_PATH_SQLITE3
if len(sys.argv) >= 2:
    DB_PATH = sys.argv[1]

# Flask Setup
app = Flask(__name__)
CORS(app)

# AnalystBox Setup
box = AnalystBox(DB_PATH, db_type='sqlite3', default_expansions=True)

# Provider Setup
with app.app_context():
    tp = TableProvider(DB_PATH)
    app.teardown_appcontext(tp.teardown)


# Routes
@app.route('/', methods=['GET'])
def status():
    return 'Up and running!'


@app.route('/data/qsts', methods=['GET'])
def data_qsts():
    questions, results, _ = box.get_qrks()
    return {'success': True, 'questions': questions, 'sqls': results}


@app.route('/data/keywords', methods=['GET'])
def data_keywords():
    _, _, keywords = box.get_qrks()
    return {'success': True, 'keywords': keywords}


@app.route('/table/data', methods=['POST'])
def table_data():
    body = request.json

    if 'sql' not in body:
        return {'success': False}

    sql = body['sql']

    columns, rows = tp.query(sql)
    return {'success': True, 'columns': columns, 'rows': rows}


# Main
if __name__ == '__main__':
    app.run()
